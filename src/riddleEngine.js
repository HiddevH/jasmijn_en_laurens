// Riddle Engine - Beheert raadsels, antwoorden en validatie voor de bruiloft app
export class RiddleEngine {
    constructor() {
        this.raadsels = this.initializeRiddles();
        this.hints = this.initializeHints();
        this.validationRules = this.initializeValidationRules();

        console.log('RiddleEngine geïnitialiseerd met', this.raadsels.length, 'raadsels');
    }

    // Initialiseer alle raadsels met bruiloft thema - INTELLECTUELE UITDAGING
    initializeRiddles() {
        return [
            {
                id: 1,
                titel: "De Verborgen Renaissance",
                raadsel: `Een kunsthistorische puzzel om jullie bruiloft op 15-08-2025 te vieren.
                        
                        🎨 Deze beroemde schilder overleed op 37-jarige leeftijd in 1610
                        🖼️ Zijn meesterwerk "Judith onthoofdt Holofernes" hangt in de Uffizi
                        ⚔️ Hij schilderde dramatische scènes met extreme licht-donker contrasten
                        🔍 Zijn voornaam begint met een 'C' en hij kwam uit Milaan
                        
                        📊 Tel de letters in zijn achternaam (zonder voornaam)
                        ➕ Tel daar de som van alle cijfers in jullie trouwdatum bij op
                        
                        Wat is het totaal? (Letters in achternaam + som cijfers 15-08-2025)`,
                antwoorden: ["33", "drieendertig"],
                type: "exact",
                caseSensitive: false,
                category: "kunstgeschiedenis"
            },
            {
                id: 2,
                titel: "Het Caesarische Geheim",
                raadsel: `Een historische versleutelingstechniek voor jullie liefdesboodschap.
                        
                        🏛️ Julius Caesar gebruikte een simpele verschuivingscipher voor geheime berichten
                        📜 Deze versleutelde boodschap wacht op jullie: "YVRSQR VF UNNE JBBEQ"
                        🔤 De sleutel ligt verborgen in de afstand tussen het begin en midden van het alfabet
                        💕 Decodeer de Nederlandse boodschap die verschijnt
                        
                        🧮 Tel alle unieke letters in de gedecodeerde Nederlandse zin
                        📅 Tel daar de som van alle cijfers in jullie trouwdatum bij op (1+5+0+8+2+0+2+5)
                        🎯 Dit geeft jullie het magische getal van de liefde
                        
                        Wat is het totaal? (Unieke letters + som trouwdatum cijfers)`,
                antwoorden: ["34", "vierendertig"],
                type: "exact",
                caseSensitive: false,
                category: "cryptografie_geschiedenis"
            },
            {
                id: 3,
                titel: "De Anatomische Liefde",
                raadsel: `Een medische puzzel over het hart - letterlijk en figuurlijk.
                        
                        💓 Het menselijk hart is een fascinerende spierpomp
                        🩸 Bij een gezonde volwassene in rust klopt het hart regelmatig
                        ⏰ Elke hartcyclus bestaat uit samentrekking en ontspanning
                        🫀 Door de hartkleppen stroomt het bloed altijd in één richting
                        
                        🧮 Los deze cardiovasculaire puzzel op:
                        📊 Een normaal slagvolume is 70-90ml per hartslag
                        💉 Een normale rustpols ligt tussen 60-80 slagen per minuut
                        🔢 De cardiac output wordt uitgedrukt in liters per minuut
                        🏥 Het hart heeft verschillende kleppen voor eenrichtingsverkeer
                        
                        🧠 Bereken het antwoord:
                        ➡️ Neem het gemiddelde van het slagvolume bereik
                        ➡️ Neem het gemiddelde van het polsbereik
                        ➡️ Bereken de cardiac output in ml per minuut
                        ➡️ Converteer naar liters en rond af naar heel getal
                        ➡️ Tel het aantal hoofdhartkleppen erbij op
                        
                        Wat is je eindresultaat?`,
                antwoorden: ["10", "tien"],
                type: "exact",
                caseSensitive: false,
                category: "geneeskunde"
            },
            {
                id: 4,
                titel: "De Logica van Aristoteles",
                raadsel: `Een filosofische puzzel over liefde en logica.
                        
                        🏛️ Aristoteles leerde ons over syllogismen en logische redeneringen
                        📚 Evalueer deze premissen over jullie liefde:
                        
                        • P: "Alle ware liefde is eeuwig"
                        • Q: "Jullie liefde is waar"  
                        • R: "Eeuwige dingen zijn kostbaar"
                        • S: "Jullie trouwen op 15-08-2024"
                        
                        🧠 Evalueer deze logische uitdrukking:
                        ((P ∧ Q) → R) ∧ ¬S ⊕ ¬(P ∧ Q ∧ R)
                        
                        🔍 Als WAAR: antwoord = 7  |  Als ONWAAR: antwoord = 3
                        
                        Wat is de waarheidswaarde van deze logische expressie?`,
                antwoorden: ["7", "zeven"],
                type: "exact",
                caseSensitive: false,
                category: "filosofie_logica"
            },
            {
                id: 5,
                titel: "De Alchemistische Formule",
                raadsel: `De finale uitdaging: Een wiskundige transformatie van jullie namen.
                        
                        🧪 In de alchemie werden letters omgezet naar getallen voor mystieke berekeningen
                        📜 Gebruik deze "alchemistische functie" op jullie namen:
                        
                        ⚗️ Voor elke letter: (Alfabetpositie × Letterplaats in naam)
                        
                        Bijvoorbeeld voor "CAT": C(3×1) + A(1×2) + T(20×3) = 3 + 2 + 60 = 65
                        
                        JASMIJN: ?
                        LAURENS: ?
                        
                        🧮 Bereken beide "alchemistische waarden"
                        ➕ Tel ze bij elkaar op: JASMIJN-waarde + LAURENS-waarde
                        ➗ Deel door 10 (naar beneden afronden)
                        🏆 Dit is jullie "harmonie-coëfficiënt"
                        
                        Wat is het eindresultaat? (som gedeeld door 10, afgerond naar beneden)`,
                antwoorden: ["71", "eenenzeventig"],
                type: "exact",
                caseSensitive: false,
                category: "alchemie_wiskunde"
            }
        ];
    }

    // Initialiseer hints voor elk raadsel - NERD LEVEL
    initializeHints() {
        return {
            1: [
                "💡 Caravaggio is de schilder (Michelangelo Merisi da Caravaggio)",
                "💡 CARAVAGGIO heeft 10 letters (C-A-R-A-V-A-G-G-I-O)",
                "💡 Som cijfers trouwdatum: 1+5+0+8+2+0+2+5 = 23, dus 10+23 = 33"
            ],
            2: [
                "💡 ROT13: Verschuif elke letter 13 posities in het alfabet (A→N, B→O, etc.)",
                "💡 YVRSQR VF UNNE JBBEQ → LIEFDE IS HAAR WOORD (L-I-E-F-D-S-H-A-R-W-O = 11 unieke letters)",
                "💡 Som trouwdatum: 1+5+0+8+2+0+2+5 = 23, dus 11+23 = 34"
            ],
            3: [
                "💡 Gemiddelde slagvolume = (70+90)/2 = 80ml, gemiddelde pols = (60+80)/2 = 70/min",
                "💡 Cardiac output = 80ml × 70/min = 5600ml/min = 5.6L/min ≈ 6L/min (afgerond)",
                "💡 Het hart heeft 4 hoofdkleppen (tricuspidaal, mitraal, aorta, pulmonaal), dus 6 + 4 = 10"
            ],
            4: [
                "💡 P, Q, R zijn logische uitspraken - evalueer ze. S klopt niet: jullie trouwen in 2025!",
                "💡 P=waar, Q=waar, R=waar, S=onwaar. Onthou: ∧=EN, →=ALS-DAN, ¬=NIET, ⊕=XOR",
                "💡 ((waar∧waar)→waar) ∧ ¬onwaar ⊕ ¬(waar∧waar∧waar) = waar∧waar ⊕ onwaar = waar"
            ],
            5: [
                "💡 JASMIJN: J(10×1) + A(1×2) + S(19×3) + M(13×4) + I(9×5) + J(10×6) + N(14×7) = 324",
                "💡 LAURENS: L(12×1) + A(1×2) + U(21×3) + R(18×4) + E(5×5) + N(14×6) + S(19×7) = 391", 
                "💡 Som: 324 + 391 = 715. Gedeeld door 10 = 71.5, naar beneden afgerond = 71"
            ]
        };
    }

    // Initialiseer validatie regels
    initializeValidationRules() {
        return {
            // Normalisatie functies voor verschillende antwoord types
            normalizeAnswer: (answer) => {
                return answer.toString().toLowerCase().trim()
                    .replace(/\s+/g, ' ') // Meerdere spaties naar enkele spatie
                    .replace(/[.,;:!?]/g, '') // Interpunctie verwijderen
                    .replace(/[-/]/g, '-'); // Verschillende scheidingstekens normaliseren
            },

            // Speciale validatie voor datums
            validateDate: (answer) => {
                const datePatterns = [
                    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
                    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
                    /^(\d{1,2})\s*(augustus|aug)\s*(\d{4})$/i
                ];

                for (const pattern of datePatterns) {
                    const match = answer.match(pattern);
                    if (match) {
                        if (pattern.toString().includes('augustus')) {
                            return match[1] === '15' && match[3] === '2025';
                        } else {
                            return match[1] === '15' && (match[2] === '8' || match[2] === '08') && match[3] === '2025';
                        }
                    }
                }
                return false;
            },

            // Speciale validatie voor getallen (inclusief geschreven getallen)
            validateNumber: (answer, expectedNumbers) => {
                const numberWords = {
                    'een': 1, 'twee': 2, 'drie': 3, 'vier': 4, 'vijf': 5,
                    'zes': 6, 'zeven': 7, 'acht': 8, 'negen': 9, 'tien': 10,
                    'elf': 11, 'twaalf': 12, 'dertien': 13, 'veertien': 14, 'vijftien': 15,
                    'zestien': 16, 'zeventien': 17, 'achttien': 18, 'negentien': 19, 'twintig': 20,
                    'eenentwintig': 21, 'tweeentwintig': 22, 'drieentwintig': 23, 'vierentwintig': 24, 'vijfentwintig': 25,
                    'zesentwintig': 26, 'zevenentwintig': 27, 'achtentwintig': 28, 'negenentwintig': 29, 'dertig': 30,
                    'eenendertig': 31, 'tweeendertig': 32, 'drieendertig': 33, 'vierendertig': 34, 'vijfendertig': 35,
                    'zesendertig': 36, 'zevenendertig': 37, 'achtendertig': 38, 'negenendertig': 39, 'veertig': 40,
                    'eenenveertig': 41, 'tweeenveertig': 42, 'drieenveertig': 43, 'vierenveertig': 44, 'vijfenveertig': 45,
                    'zesenveertig': 46, 'zevenenveertig': 47, 'achtenveertig': 48, 'negenenveertig': 49, 'vijftig': 50,
                    'eenenvijftig': 51, 'tweeenvijftig': 52, 'drieenvijftig': 53, 'vierenvijftig': 54, 'vijfenvijftig': 55,
                    'zesenvijftig': 56, 'zevenenvijftig': 57, 'achtenvijftig': 58, 'negenenvijftig': 59, 'zestig': 60,
                    'zeventig': 70, 'tachtig': 80, 'negentig': 90, 'honderd': 100
                };

                const normalizedAnswer = this.validationRules.normalizeAnswer(answer);

                // Check numerieke waarde
                const numericValue = parseInt(normalizedAnswer);
                if (!isNaN(numericValue) && expectedNumbers.includes(numericValue.toString())) {
                    return true;
                }

                // Check geschreven getal
                if (numberWords[normalizedAnswer] && expectedNumbers.includes(numberWords[normalizedAnswer].toString())) {
                    return true;
                }

                return expectedNumbers.includes(normalizedAnswer);
            }
        };
    }

    // Krijg raadsel per ID
    getRiddle(riddleId) {
        const riddle = this.raadsels.find(r => r.id === parseInt(riddleId));
        if (!riddle) {
            console.error(`Raadsel met ID ${riddleId} niet gevonden`);
            return null;
        }

        return {
            id: riddle.id,
            titel: riddle.titel,
            raadsel: riddle.raadsel,
            category: riddle.category,
            type: riddle.type
        };
    }

    // Controleer antwoord
    validateAnswer(riddleId, userAnswer) {
        const riddle = this.raadsels.find(r => r.id === parseInt(riddleId));
        if (!riddle) {
            return { correct: false, error: 'Raadsel niet gevonden' };
        }

        if (!userAnswer || userAnswer.trim() === '') {
            return { correct: false, error: 'Geen antwoord ingevoerd' };
        }

        const normalizedUserAnswer = this.validationRules.normalizeAnswer(userAnswer);

        // Speciale validatie voor verschillende types
        switch (riddle.category) {
            case 'kunstgeschiedenis':
            case 'cryptografie_geschiedenis':
            case 'geneeskunde':
            case 'filosofie_logica':
            case 'alchemie_wiskunde':
                if (this.validationRules.validateNumber(normalizedUserAnswer, riddle.antwoorden)) {
                    const messages = {
                        'kunstgeschiedenis': '🎉 Uitstekend! Je kunsthistorische kennis is indrukwekkend!',
                        'cryptografie_geschiedenis': '🎉 Perfect! Je hebt de historische cipher gekraakt als een ware codebreker!',
                        'geneeskunde': '🎉 Briljant! Jouw medische inzicht klopt als een gezond hart!',
                        'filosofie_logica': '🎉 Logisch correct! Aristoteles zou trots zijn op je redenering!',
                        'alchemie_wiskunde': '🎉 Magistraal! Je beheerst de alchemistische kunst van getallen!'
                    };
                    return { correct: true, message: messages[riddle.category] };
                }
                break;

            default:
                // Fallback naar exacte matching
                for (const correctAnswer of riddle.antwoorden) {
                    const normalizedCorrect = this.validationRules.normalizeAnswer(correctAnswer);
                    if (riddle.caseSensitive) {
                        if (userAnswer.trim() === correctAnswer) {
                            return { correct: true, message: '🎉 Correct antwoord!' };
                        }
                    } else {
                        if (normalizedUserAnswer === normalizedCorrect) {
                            return { correct: true, message: '🎉 Correct antwoord!' };
                        }
                    }
                }
        }

        return {
            correct: false,
            message: '❌ Niet correct. Probeer opnieuw!',
            hint: `💭 Dit raadsel valt onder de categorie: ${riddle.category}`
        };
    }

    // Krijg hints voor een raadsel
    getHints(riddleId) {
        return this.hints[parseInt(riddleId)] || [];
    }

    // Krijg specifieke hint
    getHint(riddleId, hintNumber = 1) {
        const riddleHints = this.getHints(riddleId);
        const hintIndex = Math.min(hintNumber - 1, riddleHints.length - 1);

        if (hintIndex < 0) {
            return "💡 Er zijn nog geen hints beschikbaar voor dit raadsel.";
        }

        return riddleHints[hintIndex];
    }

    // Krijg totaal aantal raadsels
    getTotalRiddles() {
        return this.raadsels.length;
    }

    // Debug functie voor ontwikkeling
    getAllAnswers() {
        if (process.env.NODE_ENV === 'development') {
            return this.raadsels.map(r => ({
                id: r.id,
                titel: r.titel,
                antwoorden: r.antwoorden
            }));
        }
        return null;
    }

    // Valideer dat alle raadsels correct geconfigureerd zijn
    validateRiddleConfiguration() {
        const errors = [];

        for (const riddle of this.raadsels) {
            if (!riddle.id || !riddle.titel || !riddle.raadsel) {
                errors.push(`Raadsel ${riddle.id || 'unknown'}: Ontbrekende basis informatie`);
            }

            if (!riddle.antwoorden || riddle.antwoorden.length === 0) {
                errors.push(`Raadsel ${riddle.id}: Geen antwoorden gedefinieerd`);
            }

            if (!this.hints[riddle.id] || this.hints[riddle.id].length === 0) {
                errors.push(`Raadsel ${riddle.id}: Geen hints gedefinieerd`);
            }
        }

        if (errors.length > 0) {
            console.error('RiddleEngine configuratie fouten:', errors);
            return false;
        }

        console.log('✅ Alle raadsels zijn correct geconfigureerd');
        return true;
    }
}