// ProgressManager - Robuust systeem voor het bijhouden van gebruikersvoortgang
export class ProgressManager {
    constructor() {
        this.storageKey = 'bruiloft-raadsels-progress';
        this.sessionKey = 'bruiloft-raadsels-session';
        this.totaalRaadsels = 5;
        
        // Default state
        this.defaultState = {
            huidigRaadsel: 1,
            voltooideRaadsels: [],
            startTijd: null,
            laatsteActiviteit: null,
            hintGebruik: {},
            sessieId: null,
            versie: '1.0'
        };
        
        this.state = { ...this.defaultState };
        this.isIncognito = this.detectIncognitoMode();
        
        // Laad bestaande progress
        this.laadProgress();
        
        // Start nieuwe sessie
        this.startNieuweSessie();
        
        // Auto-save periodiek
        this.startAutoSave();
    }
    
    // Detecteer incognito/private mode
    detectIncognitoMode() {
        try {
            localStorage.setItem('test-storage', 'test');
            localStorage.removeItem('test-storage');
            return false;
        } catch (e) {
            console.warn('Incognito mode gedetecteerd - gebruiken sessionStorage');
            return true;
        }
    }
    
    // Kies juiste storage methode
    getStorage() {
        return this.isIncognito ? sessionStorage : localStorage;
    }
    
    // Laad opgeslagen progress
    laadProgress() {
        try {
            const storage = this.getStorage();
            const savedData = storage.getItem(this.storageKey);
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                
                // Valideer data integriteit
                if (this.valideerProgressData(parsedData)) {
                    this.state = { ...this.defaultState, ...parsedData };
                    console.log('Progress succesvol geladen:', this.state);
                } else {
                    console.warn('Ongeldige progress data - reset naar default');
                    this.resetProgress();
                }
            } else {
                console.log('Geen bestaande progress gevonden - nieuwe gebruiker');
            }
        } catch (error) {
            console.error('Fout bij laden progress:', error);
            this.resetProgress();
        }
    }
    
    // Valideer progress data om cheating te voorkomen
    valideerProgressData(data) {
        // Check basis structuur
        if (!data || typeof data !== 'object') return false;
        
        // Check voltooide raadsels
        if (!Array.isArray(data.voltooideRaadsels)) return false;
        
        // Valideer dat raadsels in logische volgorde zijn opgelost
        const gesorteerdeRaadsels = [...data.voltooideRaadsels].sort((a, b) => a - b);
        for (let i = 0; i < gesorteerdeRaadsels.length; i++) {
            const verwachtRaadsel = i + 1;
            if (gesorteerdeRaadsels[i] !== verwachtRaadsel) {
                console.warn(`Ongeldige raadsel volgorde gedetecteerd: ${data.voltooideRaadsels}`);
                return false;
            }
        }
        
        // Check huidig raadsel is logisch
        const maxToegestaan = Math.min(data.voltooideRaadsels.length + 1, this.totaalRaadsels + 1);
        if (data.huidigRaadsel > maxToegestaan) {
            console.warn(`Ongeldig huidig raadsel: ${data.huidigRaadsel}, max toegestaan: ${maxToegestaan}`);
            return false;
        }
        
        // Check timestamps
        if (data.startTijd && data.laatsteActiviteit) {
            if (new Date(data.startTijd) > new Date(data.laatsteActiviteit)) {
                console.warn('Ongeldige timestamps gedetecteerd');
                return false;
            }
        }
        
        return true;
    }
    
    // Sla progress op
    slaProgressOp() {
        try {
            this.state.laatsteActiviteit = new Date().toISOString();
            
            const storage = this.getStorage();
            storage.setItem(this.storageKey, JSON.stringify(this.state));
            
            // Debug log
            console.log('Progress opgeslagen:', this.state);
        } catch (error) {
            console.error('Fout bij opslaan progress:', error);
            
            // Fallback naar sessie storage als localStorage vol is
            if (error.name === 'QuotaExceededError') {
                try {
                    sessionStorage.setItem(this.storageKey, JSON.stringify(this.state));
                    console.log('Progress opgeslagen in sessie storage (fallback)');
                } catch (fallbackError) {
                    console.error('Fallback storage ook gefaald:', fallbackError);
                }
            }
        }
    }
    
    // Start nieuwe sessie
    startNieuweSessie() {
        this.state.sessieId = 'sessie-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        if (!this.state.startTijd) {
            this.state.startTijd = new Date().toISOString();
        }
        
        this.slaProgressOp();
    }
    
    // Mark raadsel als opgelost
    markeerRaadselOpgelost(raadselNummer) {
        const nummer = parseInt(raadselNummer);
        
        // Validatie: kan gebruiker dit raadsel oplossen?
        if (!this.kanRaadselOplossen(nummer)) {
            console.error(`Poging tot oplossen van niet-toegestaan raadsel: ${nummer}`);
            return false;
        }
        
        // Voeg toe aan voltooide raadsels
        if (!this.state.voltooideRaadsels.includes(nummer)) {
            this.state.voltooideRaadsels.push(nummer);
            this.state.voltooideRaadsels.sort((a, b) => a - b); // Sorteer voor consistentie
            
            // Update huidig raadsel
            this.state.huidigRaadsel = Math.min(nummer + 1, this.totaalRaadsels + 1);
            
            this.slaProgressOp();
            
            console.log(`Raadsel ${nummer} gemarkeerd als opgelost!`);
            return true;
        }
        
        return false;
    }
    
    // Controleer of gebruiker een raadsel mag oplossen
    kanRaadselOplossen(raadselNummer) {
        const nummer = parseInt(raadselNummer);
        
        // Raadsel moet binnen bereik zijn
        if (nummer < 1 || nummer > this.totaalRaadsels) {
            return false;
        }
        
        // Kan alleen het volgende raadsel in de reeks oplossen
        const verwachtVolgend = this.state.voltooideRaadsels.length + 1;
        return nummer === verwachtVolgend;
    }
    
    // Controleer toegang tot raadsel pagina
    heeftToegang(raadselNummer) {
        const nummer = parseInt(raadselNummer);
        
        // Toegang tot voltooide raadsels + het volgende raadsel
        return nummer <= this.state.voltooideRaadsels.length + 1 && nummer <= this.totaalRaadsels;
    }
    
    // Hint gebruikt tracking
    registreerHintGebruik(raadselNummer, hintNummer = 1) {
        const key = `raadsel-${raadselNummer}`;
        
        if (!this.state.hintGebruik[key]) {
            this.state.hintGebruik[key] = [];
        }
        
        const hintInfo = {
            hintNummer: hintNummer,
            tijdstip: new Date().toISOString()
        };
        
        this.state.hintGebruik[key].push(hintInfo);
        this.slaProgressOp();
        
        console.log(`Hint ${hintNummer} gebruikt voor raadsel ${raadselNummer}`);
    }
    
    // Krijg hint statistieken
    getHintStatistieken(raadselNummer = null) {
        if (raadselNummer) {
            const key = `raadsel-${raadselNummer}`;
            return this.state.hintGebruik[key] || [];
        }
        
        return this.state.hintGebruik;
    }
    
    // Get progress percentage
    getProgressPercentage() {
        return Math.round((this.state.voltooideRaadsels.length / this.totaalRaadsels) * 100);
    }
    
    // Check of alle raadsels voltooid zijn
    isVoltooid() {
        return this.state.voltooideRaadsels.length === this.totaalRaadsels;
    }
    
    // Get huidige status
    getStatus() {
        return {
            huidigRaadsel: this.state.huidigRaadsel,
            voltooideRaadsels: [...this.state.voltooideRaadsels],
            totaalRaadsels: this.totaalRaadsels,
            percentage: this.getProgressPercentage(),
            isVoltooid: this.isVoltooid(),
            startTijd: this.state.startTijd,
            laatsteActiviteit: this.state.laatsteActiviteit,
            isIncognito: this.isIncognito
        };
    }
    
    // Reset alle progress (voor testing of nieuwe start)
    resetProgress() {
        this.state = { ...this.defaultState };
        this.startNieuweSessie();
        
        try {
            const storage = this.getStorage();
            storage.removeItem(this.storageKey);
            console.log('Progress gereset');
        } catch (error) {
            console.error('Fout bij resetten progress:', error);
        }
    }
    
    // Auto-save systeem
    startAutoSave() {
        // Save elke 30 seconden als er activiteit is
        setInterval(() => {
            if (this.state.laatsteActiviteit) {
                const laatsteActiviteit = new Date(this.state.laatsteActiviteit);
                const nu = new Date();
                const verschilMinuten = (nu - laatsteActiviteit) / 1000 / 60;
                
                // Save als er recente activiteit was (laatste 5 minuten)
                if (verschilMinuten < 5) {
                    this.slaProgressOp();
                }
            }
        }, 30000);
    }
    
    // Update laatste activiteit timestamp
    updateLaatsteActiviteit() {
        this.state.laatsteActiviteit = new Date().toISOString();
    }
    
    // Export data voor backup/sharing
    exportProgress() {
        return {
            ...this.state,
            exportTijd: new Date().toISOString(),
            versie: this.state.versie
        };
    }
    
    // Import progress data (met validatie)
    importProgress(data) {
        if (this.valideerProgressData(data)) {
            this.state = { ...this.defaultState, ...data };
            this.slaProgressOp();
            console.log('Progress geïmporteerd');
            return true;
        } else {
            console.error('Ongeldige import data');
            return false;
        }
    }
}