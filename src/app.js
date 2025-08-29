// Hoofd applicatie class
import { ProgressManager } from './progressManager.js';
import { RiddleEngine } from './riddleEngine.js';

export class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.progressManager = new ProgressManager();
        this.riddleEngine = new RiddleEngine();

        // Valideer riddle configuratie
        this.riddleEngine.validateRiddleConfiguration();

        // Event listeners voor interacties
        this.setupEventListeners();

        console.log('App geïnitialiseerd met ProgressManager en RiddleEngine');
    }

    // Setup event listeners voor UI interacties
    setupEventListeners() {
        console.log('Setting up event listeners...'); // Debug log

        // Luister naar clicks op dynamische content
        document.addEventListener('click', (e) => {
            console.log('Click detected on:', e.target); // Debug log

            // Update activiteit bij elke click
            this.progressManager.updateLaatsteActiviteit();

            // Handle hint buttons
            if (e.target.matches('.hint-btn')) {
                e.preventDefault();
                const raadselNummer = parseInt(e.target.dataset.raadsel);
                this.toonHint(raadselNummer);
            }

            // Handle antwoord controleren (tijdelijke implementatie)
            if (e.target.matches('.controleer-antwoord')) {
                console.log('Controleer antwoord button clicked!'); // Debug log
                e.preventDefault();
                const raadselNummer = parseInt(e.target.dataset.raadsel);
                console.log('Raadsel nummer:', raadselNummer); // Debug log
                this.controleerAntwoord(raadselNummer);
            }

            // Handle progress reset (voor testing)
            if (e.target.matches('.reset-progress')) {
                e.preventDefault();
                this.resetProgress();
            }
        });

        // Luister naar input events
        document.addEventListener('input', () => {
            this.progressManager.updateLaatsteActiviteit();
        });
    }

    // Render een pagina template
    renderPagina(template) {
        this.appElement.innerHTML = template;
    }

    // Home pagina template
    homePagina() {
        const status = this.progressManager.getStatus();
        const totaalRaadsels = status.totaalRaadsels;
        const progress = status.voltooideRaadsels.length;

        return `
            <div class="container">
                <header class="hero">
                    <h1>🎉 Bruiloft Raadsels</h1>
                    <p class="subtitle">Een speciale uitdaging voor een speciale dag</p>
                </header>
                
                <main class="main-content">
                    <div class="progress-card">
                        <h2>Jouw Voortgang</h2>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${status.percentage}%"></div>
                        </div>
                        <p>${progress} van ${totaalRaadsels} raadsels opgelost (${status.percentage}%)</p>
                        
                        ${status.startTijd ? `
                            <div class="progress-info">
                                <p><small>Gestart: ${new Date(status.startTijd).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        })}</small></p>
                                ${status.isIncognito ? '<p><small>⚠️ Incognito modus - progress wordt niet permanent opgeslagen</small></p>' : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="actions">
                        ${!status.isVoltooid ?
                `<button class="btn-primary" data-route="/raadsel/${status.huidigRaadsel}">${status.huidigRaadsel === 1 ? 'Begin de Uitdaging' : 'Ga Verder'
                }</button>` :
                `<button class="btn-primary" data-route="/beloning">🏆 Zie je Beloning!</button>`
            }
                        
                        ${progress > 0 ? `
                            <div class="raadsel-lijst">
                                <h3>Beschikbare Raadsels:</h3>
                                ${this.genereerRaadselLinks(status)}
                            </div>
                        ` : ''}
                        
                        <div class="debug-actions">
                            <button class="btn-secondary reset-progress">🔄 Reset Progress</button>
                        </div>
                    </div>
                </main>
            </div>
        `;
    }

    // Raadsel pagina template
    raadselPagina(riddleId) {
        const raadselNummer = parseInt(riddleId);
        const status = this.progressManager.getStatus();

        // Check toegang met ProgressManager
        if (!this.progressManager.heeftToegang(raadselNummer)) {
            return `
                <div class="container">
                    <div class="error-card">
                        <h2>🔒 Raadsel Vergrendeld</h2>
                        <p>Je moet eerst de vorige raadsels oplossen!</p>
                        <p><small>Huidige toegang tot raadsel: ${status.voltooideRaadsels.length + 1}</small></p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;
        }

        // Krijg raadsel data van de RiddleEngine
        const riddleData = this.riddleEngine.getRiddle(raadselNummer);
        if (!riddleData) {
            return `
                <div class="container">
                    <div class="error-card">
                        <h2>❌ Raadsel Niet Gevonden</h2>
                        <p>Het opgevraagde raadsel bestaat niet.</p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;
        }

        const isOpgelost = status.voltooideRaadsels.includes(raadselNummer);
        const hintStats = this.progressManager.getHintStatistieken(raadselNummer);

        return `
            <div class="container">
                <header class="raadsel-header">
                    <nav class="breadcrumb">
                        <a data-route="/">Home</a> → Raadsel ${raadselNummer}
                    </nav>
                    <div class="raadsel-progress">
                        <span class="raadsel-nummer">Raadsel ${raadselNummer} ${isOpgelost ? '✅' : ''}</span>
                        <div class="mini-progress">
                            ${status.voltooideRaadsels.length} / ${status.totaalRaadsels}
                        </div>
                    </div>
                </header>
                
                <main class="raadsel-content">
                    <div class="raadsel-card">
                        <h2>${riddleData.titel}</h2>
                        <div class="raadsel-tekst">
                            ${riddleData.raadsel.split('\n').map(line =>
            line.trim() ? `<p>${line.trim()}</p>` : ''
        ).join('')}
                        </div>
                        
                        ${!isOpgelost ? `
                            <div class="raadsel-input">
                                <input type="text" placeholder="Jouw antwoord..." class="antwoord-input" id="antwoord-${raadselNummer}">
                                <button class="btn-primary controleer-antwoord" data-raadsel="${raadselNummer}">Controleer Antwoord</button>
                            </div>
                            
                            <div class="raadsel-hints">
                                <button class="btn-secondary hint-btn" data-raadsel="${raadselNummer}">💡 Hint ${hintStats.length > 0 ? `(${hintStats.length} gebruikt)` : ''}</button>
                            </div>
                        ` : `
                            <div class="opgelost-bericht">
                                <h3>✅ Raadsel Opgelost!</h3>
                                <p>Goed gedaan! Ga verder naar het volgende raadsel.</p>
                                ${hintStats.length > 0 ? `<p><small>Je hebt ${hintStats.length} hint(s) gebruikt voor dit raadsel.</small></p>` : ''}
                            </div>
                        `}
                    </div>
                </main>
                
                <div class="navigatie">
                    ${raadselNummer > 1 ? `<button class="btn-secondary" data-route="/raadsel/${raadselNummer - 1}">← Vorig Raadsel</button>` : ''}
                    <button class="btn-secondary" data-route="/">🏠 Home</button>
                    ${raadselNummer < status.totaalRaadsels && this.progressManager.heeftToegang(raadselNummer + 1) ?
                `<button class="btn-secondary" data-route="/raadsel/${raadselNummer + 1}">Volgend Raadsel →</button>` :
                raadselNummer === status.totaalRaadsels && isOpgelost ?
                    `<button class="btn-primary" data-route="/beloning">🏆 Naar Beloning!</button>` : ''
            }
                </div>
            </div>
        `;
    }

    // Beloning pagina template
    beloningPagina() {
        const status = this.progressManager.getStatus();

        if (!status.isVoltooid) {
            return `
                <div class="container">
                    <div class="error-card">
                        <h2>🔒 Beloning Vergrendeld</h2>
                        <p>Los eerst alle raadsels op om je beloning te zien!</p>
                        <p><small>Voortgang: ${status.voltooideRaadsels.length}/${status.totaalRaadsels} raadsels</small></p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;
        }

        // Bereken statistieken
        const startTijd = new Date(status.startTijd);
        const eindTijd = new Date(status.laatsteActiviteit);
        const duurMinuten = Math.round((eindTijd - startTijd) / (1000 * 60));
        const totaalHints = Object.values(this.progressManager.getHintStatistieken()).reduce((sum, hints) => sum + hints.length, 0);

        return `
            <div class="container beloning-pagina">
                <div class="confetti-container">
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                    <div class="confetti"></div>
                </div>
                
                <div class="beloning-card celebration">
                    <div class="celebration-header">
                        <h1>🎉🥳 GEFELICITEERD! 🥳🎉</h1>
                        <p class="success-text bounce">Jullie hebben alle intellectuele uitdagingen overwonnen!</p>
                        <div class="emoji-celebration">🌟✨🎊💫⭐🎈🎁🏆🎯🌈</div>
                    </div>
                    
                    <div class="beloning-reveal festive">
                        <h2>🎊 Jullie Speciale Beloning 🎊</h2>
                        <div class="beloning-wrapper">
                            <div class="beloning-nummer pulse">5</div>
                            <div class="hearts-animation">💕💖💝💗💘💞</div>
                        </div>
                        <p class="beloning-tekst festive-text">
                            🌹 Het magische getal! 🌹<br>
                            💒 Voor Jasmijn & Laurens 💒
                        </p>
                    </div>
                    
                    <div class="celebration-message">
                        <h3>🧠 Jullie Briljante Prestatie 🧠</h3>
                        <p>Van kunstgeschiedenis tot alchemie - jullie hebben bewezen dat jullie samen elk raadsel kunnen oplossen!</p>
                        <div class="achievement-badges">
                            <span class="badge">🎨 Kunst Kenner</span>
                            <span class="badge">🔐 Code Kraker</span>
                            <span class="badge">⚕️ Medisch Genie</span>
                            <span class="badge">🧮 Logica Meester</span>
                            <span class="badge">⚗️ Alchemist</span>
                        </div>
                    </div>
                    
                    <div class="statistieken celebration-stats">
                        <h3>📊 Jullie Epische Stats:</h3>
                        <div class="stats-grid festive">
                            <div class="stat-item glow">
                                <span class="stat-nummer">${status.totaalRaadsels}</span>
                                <span class="stat-label">🏆 Raadsels Gemeesterd</span>
                            </div>
                            <div class="stat-item glow">
                                <span class="stat-nummer">${duurMinuten}</span>
                                <span class="stat-label">⏱️ Minuten Totaal</span>
                            </div>
                            <div class="stat-item glow">
                                <span class="stat-nummer">${totaalHints}</span>
                                <span class="stat-label">💡 Hints Gebruikt</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="final-message">
                        <h2>💕 Voor het Bruidspaar 💕</h2>
                        <p class="wedding-wish">
                            Moge jullie liefde net zo sterk zijn als jullie probleemoplossend vermogen,<br>
                            en moge elk raadsel dat het leven jullie voorschotelt,<br>
                            samen makkelijk op te lossen zijn! 🥂
                        </p>
                    </div>
                    
                    <button class="btn-primary celebration-btn" data-route="/">🏠 Terug naar Home</button>
                </div>
            </div>
        `;
    }

    // Genereer links naar beschikbare raadsels
    genereerRaadselLinks(status) {
        let links = '';
        for (let i = 1; i <= status.totaalRaadsels; i++) {
            const opgelost = status.voltooideRaadsels.includes(i);
            const toegang = this.progressManager.heeftToegang(i);

            if (toegang) {
                links += `
                    <a class="raadsel-link ${opgelost ? 'opgelost' : 'beschikbaar'}" data-route="/raadsel/${i}">
                        ${opgelost ? '✅' : '🔓'} Raadsel ${i}
                    </a>
                `;
            } else {
                links += `
                    <span class="raadsel-link vergrendeld">
                        🔒 Raadsel ${i}
                    </span>
                `;
            }
        }
        return links;
    }

    // Toon hint functie
    toonHint(raadselNummer) {
        this.progressManager.registreerHintGebruik(raadselNummer);

        const hintStats = this.progressManager.getHintStatistieken(raadselNummer);
        const hintNumber = hintStats.length;
        const allHints = this.riddleEngine.getHints(raadselNummer);

        // Bouw bericht met alle hints tot nu toe
        let hintMessage = `💡 Hints voor Raadsel ${raadselNummer}:\n\n`;

        for (let i = 0; i < Math.min(hintNumber, allHints.length); i++) {
            hintMessage += `Hint ${i + 1}: ${allHints[i]}\n\n`;
        }

        // Als er nog hints beschikbaar zijn
        if (hintNumber > allHints.length) {
            hintMessage += `Je hebt alle ${allHints.length} beschikbare hints al gebruikt.`;
        }

        alert(hintMessage.trim());

        // Refresh de pagina om hint counter bij te werken
        location.reload();
    }

    // Controleer antwoord functie
    controleerAntwoord(raadselNummer) {
        console.log('controleerAntwoord called with:', raadselNummer); // Debug log

        const input = document.getElementById(`antwoord-${raadselNummer}`);
        console.log('Input element:', input); // Debug log

        const antwoord = input?.value?.trim();
        console.log('User answer:', antwoord); // Debug log

        if (!antwoord) {
            alert('❌ Voer eerst een antwoord in!');
            return;
        }

        console.log('Calling riddleEngine.validateAnswer...'); // Debug log

        // Gebruik de RiddleEngine voor antwoord validatie
        const result = this.riddleEngine.validateAnswer(raadselNummer, antwoord);

        console.log('Validation result:', result); // Debug log

        if (result.correct) {
            console.log('Answer is correct!'); // Debug log
            if (this.progressManager.markeerRaadselOpgelost(raadselNummer)) {
                alert(`${result.message}\n\n🎉 Raadsel opgelost!`);

                // Navigeer naar volgende raadsel of beloning via router
                const totalRiddles = this.riddleEngine.getTotalRiddles();
                if (raadselNummer < totalRiddles) {
                    setTimeout(() => {
                        // Use the router's navigation method instead of direct history manipulation
                        if (window.router) {
                            window.router.navigeren(`/raadsel/${raadselNummer + 1}`);
                        } else {
                            location.reload();
                        }
                    }, 1500);
                } else {
                    setTimeout(() => {
                        // Use the router's navigation method instead of direct history manipulation
                        if (window.router) {
                            window.router.navigeren('/beloning');
                        } else {
                            location.reload();
                        }
                    }, 1500);
                }
            } else {
                alert('Dit raadsel is al opgelost!');
            }
        } else {
            let message = result.message;
            if (result.hint) {
                message += `\n\n${result.hint}`;
            }
            alert(message);

            // Clear input voor nieuwe poging
            input.value = '';
            input.focus();
        }
    }

    // Reset progress voor testing
    resetProgress() {
        if (confirm('Weet je zeker dat je alle progress wilt resetten?')) {
            this.progressManager.resetProgress();
            alert('Progress gereset!');
            location.reload();
        }
    }

    // Public method om ProgressManager beschikbaar te maken
    getProgressManager() {
        return this.progressManager;
    }
}