(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();class l{constructor(){this.routes=new Map,this.currentRoute=null,window.addEventListener("popstate",e=>{this.handleRoute(window.location.pathname)}),document.addEventListener("click",e=>{e.target.matches("[data-route]")&&(e.preventDefault(),this.navigeren(e.target.getAttribute("data-route")))})}route(e,t){return this.routes.set(e,t),this}navigeren(e){window.history.pushState({},"",e),this.handleRoute(e)}handleRoute(e){this.currentRoute=e;let t=this.routes.get(e);if(!t&&e.startsWith("/raadsel/")){const a=e.split("/")[2];if(t=this.routes.get("/raadsel/:id"),t){t(a);return}}t||(t=this.routes.get("/")||(()=>{console.error(`Route niet gevonden: ${e}`)})),typeof t=="function"&&t()}start(){const e=window.location.pathname||"/";this.handleRoute(e)}}class d{constructor(){this.storageKey="bruiloft-raadsels-progress",this.sessionKey="bruiloft-raadsels-session",this.totaalRaadsels=5,this.defaultState={huidigRaadsel:1,voltooideRaadsels:[],startTijd:null,laatsteActiviteit:null,hintGebruik:{},sessieId:null,versie:"1.0"},this.state={...this.defaultState},this.isIncognito=this.detectIncognitoMode(),this.laadProgress(),this.startNieuweSessie(),this.startAutoSave()}detectIncognitoMode(){try{return localStorage.setItem("test-storage","test"),localStorage.removeItem("test-storage"),!1}catch{return console.warn("Incognito mode gedetecteerd - gebruiken sessionStorage"),!0}}getStorage(){return this.isIncognito?sessionStorage:localStorage}laadProgress(){try{const t=this.getStorage().getItem(this.storageKey);if(t){const a=JSON.parse(t);this.valideerProgressData(a)?(this.state={...this.defaultState,...a},console.log("Progress succesvol geladen:",this.state)):(console.warn("Ongeldige progress data - reset naar default"),this.resetProgress())}else console.log("Geen bestaande progress gevonden - nieuwe gebruiker")}catch(e){console.error("Fout bij laden progress:",e),this.resetProgress()}}valideerProgressData(e){if(!e||typeof e!="object"||!Array.isArray(e.voltooideRaadsels))return!1;const t=[...e.voltooideRaadsels].sort((s,i)=>s-i);for(let s=0;s<t.length;s++){const i=s+1;if(t[s]!==i)return console.warn(`Ongeldige raadsel volgorde gedetecteerd: ${e.voltooideRaadsels}`),!1}const a=Math.min(e.voltooideRaadsels.length+1,this.totaalRaadsels+1);return e.huidigRaadsel>a?(console.warn(`Ongeldig huidig raadsel: ${e.huidigRaadsel}, max toegestaan: ${a}`),!1):e.startTijd&&e.laatsteActiviteit&&new Date(e.startTijd)>new Date(e.laatsteActiviteit)?(console.warn("Ongeldige timestamps gedetecteerd"),!1):!0}slaProgressOp(){try{this.state.laatsteActiviteit=new Date().toISOString(),this.getStorage().setItem(this.storageKey,JSON.stringify(this.state)),console.log("Progress opgeslagen:",this.state)}catch(e){if(console.error("Fout bij opslaan progress:",e),e.name==="QuotaExceededError")try{sessionStorage.setItem(this.storageKey,JSON.stringify(this.state)),console.log("Progress opgeslagen in sessie storage (fallback)")}catch(t){console.error("Fallback storage ook gefaald:",t)}}}startNieuweSessie(){this.state.sessieId="sessie-"+Date.now()+"-"+Math.random().toString(36).substr(2,9),this.state.startTijd||(this.state.startTijd=new Date().toISOString()),this.slaProgressOp()}markeerRaadselOpgelost(e){const t=parseInt(e);return this.kanRaadselOplossen(t)?this.state.voltooideRaadsels.includes(t)?!1:(this.state.voltooideRaadsels.push(t),this.state.voltooideRaadsels.sort((a,s)=>a-s),this.state.huidigRaadsel=Math.min(t+1,this.totaalRaadsels+1),this.slaProgressOp(),console.log(`Raadsel ${t} gemarkeerd als opgelost!`),!0):(console.error(`Poging tot oplossen van niet-toegestaan raadsel: ${t}`),!1)}kanRaadselOplossen(e){const t=parseInt(e);if(t<1||t>this.totaalRaadsels)return!1;const a=this.state.voltooideRaadsels.length+1;return t===a}heeftToegang(e){const t=parseInt(e);return t<=this.state.voltooideRaadsels.length+1&&t<=this.totaalRaadsels}registreerHintGebruik(e,t=1){const a=`raadsel-${e}`;this.state.hintGebruik[a]||(this.state.hintGebruik[a]=[]);const s={hintNummer:t,tijdstip:new Date().toISOString()};this.state.hintGebruik[a].push(s),this.slaProgressOp(),console.log(`Hint ${t} gebruikt voor raadsel ${e}`)}getHintStatistieken(e=null){if(e){const t=`raadsel-${e}`;return this.state.hintGebruik[t]||[]}return this.state.hintGebruik}getProgressPercentage(){return Math.round(this.state.voltooideRaadsels.length/this.totaalRaadsels*100)}isVoltooid(){return this.state.voltooideRaadsels.length===this.totaalRaadsels}getStatus(){return{huidigRaadsel:this.state.huidigRaadsel,voltooideRaadsels:[...this.state.voltooideRaadsels],totaalRaadsels:this.totaalRaadsels,percentage:this.getProgressPercentage(),isVoltooid:this.isVoltooid(),startTijd:this.state.startTijd,laatsteActiviteit:this.state.laatsteActiviteit,isIncognito:this.isIncognito}}resetProgress(){this.state={...this.defaultState},this.startNieuweSessie();try{this.getStorage().removeItem(this.storageKey),console.log("Progress gereset")}catch(e){console.error("Fout bij resetten progress:",e)}}startAutoSave(){setInterval(()=>{if(this.state.laatsteActiviteit){const e=new Date(this.state.laatsteActiviteit);(new Date-e)/1e3/60<5&&this.slaProgressOp()}},3e4)}updateLaatsteActiviteit(){this.state.laatsteActiviteit=new Date().toISOString()}exportProgress(){return{...this.state,exportTijd:new Date().toISOString(),versie:this.state.versie}}importProgress(e){return this.valideerProgressData(e)?(this.state={...this.defaultState,...e},this.slaProgressOp(),console.log("Progress geïmporteerd"),!0):(console.error("Ongeldige import data"),!1)}}class g{constructor(){this.raadsels=this.initializeRiddles(),this.hints=this.initializeHints(),this.validationRules=this.initializeValidationRules(),console.log("RiddleEngine geïnitialiseerd met",this.raadsels.length,"raadsels")}initializeRiddles(){return[{id:1,titel:"De Verborgen Renaissance",raadsel:`Een kunsthistorische puzzel om jullie bruiloft op 15-08-2025 te vieren.
                        
                        🎨 Deze beroemde schilder overleed op 37-jarige leeftijd in 1610
                        🖼️ Zijn meesterwerk "Judith onthoofdt Holofernes" hangt in de Uffizi
                        ⚔️ Hij schilderde dramatische scènes met extreme licht-donker contrasten
                        🔍 Zijn voornaam begint met een 'C' en hij kwam uit Milaan
                        
                        📊 Tel de letters in zijn achternaam (zonder voornaam)
                        ➕ Tel daar de som van alle cijfers in jullie trouwdatum bij op
                        
                        Wat is het totaal? (Letters in achternaam + som cijfers 15-08-2025)`,antwoorden:["33","drieendertig"],type:"exact",caseSensitive:!1,category:"kunstgeschiedenis"},{id:2,titel:"Het Caesarische Geheim",raadsel:`Een historische versleutelingstechniek voor jullie liefdesboodschap.
                        
                        🏛️ Julius Caesar gebruikte een simpele verschuivingscipher voor geheime berichten
                        📜 Deze versleutelde boodschap wacht op jullie: "YVRSQR VF UNNE JBBEQ"
                        🔤 De sleutel ligt verborgen in de afstand tussen het begin en midden van het alfabet
                        💕 Decodeer de Nederlandse boodschap die verschijnt
                        
                        🧮 Tel alle unieke letters in de gedecodeerde Nederlandse zin
                        📅 Tel daar de som van alle cijfers in jullie trouwdatum bij op (1+5+0+8+2+0+2+5)
                        🎯 Dit geeft jullie het magische getal van de liefde
                        
                        Wat is het totaal? (Unieke letters + som trouwdatum cijfers)`,antwoorden:["34","vierendertig"],type:"exact",caseSensitive:!1,category:"cryptografie_geschiedenis"},{id:3,titel:"De Anatomische Liefde",raadsel:`Een medische puzzel over het hart - letterlijk en figuurlijk.
                        
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
                        
                        Wat is je eindresultaat?`,antwoorden:["10","tien"],type:"exact",caseSensitive:!1,category:"geneeskunde"},{id:4,titel:"De Logica van Aristoteles",raadsel:`Een filosofische puzzel over liefde en logica.
                        
                        🏛️ Aristoteles leerde ons over syllogismen en logische redeneringen
                        📚 Evalueer deze premissen over jullie liefde:
                        
                        • P: "Alle ware liefde is eeuwig"
                        • Q: "Jullie liefde is waar"  
                        • R: "Eeuwige dingen zijn kostbaar"
                        • S: "Jullie trouwen op 15-08-2024"
                        
                        🧠 Evalueer deze logische uitdrukking:
                        ((P ∧ Q) → R) ∧ ¬S ⊕ ¬(P ∧ Q ∧ R)
                        
                        🔍 Als WAAR: antwoord = 7  |  Als ONWAAR: antwoord = 3
                        
                        Wat is de waarheidswaarde van deze logische expressie?`,antwoorden:["7","zeven"],type:"exact",caseSensitive:!1,category:"filosofie_logica"},{id:5,titel:"De Alchemistische Formule",raadsel:`De finale uitdaging: Een wiskundige transformatie van jullie namen.
                        
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
                        
                        Wat is het eindresultaat? (som gedeeld door 10, afgerond naar beneden)`,antwoorden:["71","eenenzeventig"],type:"exact",caseSensitive:!1,category:"alchemie_wiskunde"}]}initializeHints(){return{1:["💡 Caravaggio is de schilder (Michelangelo Merisi da Caravaggio)","💡 CARAVAGGIO heeft 10 letters (C-A-R-A-V-A-G-G-I-O)","💡 Som cijfers trouwdatum: 1+5+0+8+2+0+2+5 = 23, dus 10+23 = 33"],2:["💡 ROT13: Verschuif elke letter 13 posities in het alfabet (A→N, B→O, etc.)","💡 YVRSQR VF UNNE JBBEQ → LIEFDE IS HAAR WOORD (L-I-E-F-D-S-H-A-R-W-O = 11 unieke letters)","💡 Som trouwdatum: 1+5+0+8+2+0+2+5 = 23, dus 11+23 = 34"],3:["💡 Gemiddelde slagvolume = (70+90)/2 = 80ml, gemiddelde pols = (60+80)/2 = 70/min","💡 Cardiac output = 80ml × 70/min = 5600ml/min = 5.6L/min ≈ 6L/min (afgerond)","💡 Het hart heeft 4 hoofdkleppen (tricuspidaal, mitraal, aorta, pulmonaal), dus 6 + 4 = 10"],4:["💡 P, Q, R zijn logische uitspraken - evalueer ze. S klopt niet: jullie trouwen in 2025!","💡 P=waar, Q=waar, R=waar, S=onwaar. Onthou: ∧=EN, →=ALS-DAN, ¬=NIET, ⊕=XOR","💡 ((waar∧waar)→waar) ∧ ¬onwaar ⊕ ¬(waar∧waar∧waar) = waar∧waar ⊕ onwaar = waar"],5:["💡 JASMIJN: J(10×1) + A(1×2) + S(19×3) + M(13×4) + I(9×5) + J(10×6) + N(14×7) = 324","💡 LAURENS: L(12×1) + A(1×2) + U(21×3) + R(18×4) + E(5×5) + N(14×6) + S(19×7) = 391","💡 Som: 324 + 391 = 715. Gedeeld door 10 = 71.5, naar beneden afgerond = 71"]}}initializeValidationRules(){return{normalizeAnswer:e=>e.toString().toLowerCase().trim().replace(/\s+/g," ").replace(/[.,;:!?]/g,"").replace(/[-/]/g,"-"),validateDate:e=>{const t=[/^(\d{1,2})-(\d{1,2})-(\d{4})$/,/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,/^(\d{1,2})\s*(augustus|aug)\s*(\d{4})$/i];for(const a of t){const s=e.match(a);if(s)return a.toString().includes("augustus")?s[1]==="15"&&s[3]==="2025":s[1]==="15"&&(s[2]==="8"||s[2]==="08")&&s[3]==="2025"}return!1},validateNumber:(e,t)=>{const a={een:1,twee:2,drie:3,vier:4,vijf:5,zes:6,zeven:7,acht:8,negen:9,tien:10,elf:11,twaalf:12,dertien:13,veertien:14,vijftien:15,zestien:16,zeventien:17,achttien:18,negentien:19,twintig:20,eenentwintig:21,tweeentwintig:22,drieentwintig:23,vierentwintig:24,vijfentwintig:25,zesentwintig:26,zevenentwintig:27,achtentwintig:28,negenentwintig:29,dertig:30,eenendertig:31,tweeendertig:32,drieendertig:33,vierendertig:34,vijfendertig:35,zesendertig:36,zevenendertig:37,achtendertig:38,negenendertig:39,veertig:40,eenenveertig:41,tweeenveertig:42,drieenveertig:43,vierenveertig:44,vijfenveertig:45,zesenveertig:46,zevenenveertig:47,achtenveertig:48,negenenveertig:49,vijftig:50,eenenvijftig:51,tweeenvijftig:52,drieenvijftig:53,vierenvijftig:54,vijfenvijftig:55,zesenvijftig:56,zevenenvijftig:57,achtenvijftig:58,negenenvijftig:59,zestig:60,zeventig:70,tachtig:80,negentig:90,honderd:100},s=this.validationRules.normalizeAnswer(e),i=parseInt(s);return!isNaN(i)&&t.includes(i.toString())||a[s]&&t.includes(a[s].toString())?!0:t.includes(s)}}}getRiddle(e){const t=this.raadsels.find(a=>a.id===parseInt(e));return t?{id:t.id,titel:t.titel,raadsel:t.raadsel,category:t.category,type:t.type}:(console.error(`Raadsel met ID ${e} niet gevonden`),null)}validateAnswer(e,t){const a=this.raadsels.find(i=>i.id===parseInt(e));if(!a)return{correct:!1,error:"Raadsel niet gevonden"};if(!t||t.trim()==="")return{correct:!1,error:"Geen antwoord ingevoerd"};const s=this.validationRules.normalizeAnswer(t);switch(a.category){case"kunstgeschiedenis":case"cryptografie_geschiedenis":case"geneeskunde":case"filosofie_logica":case"alchemie_wiskunde":if(this.validationRules.validateNumber(s,a.antwoorden))return{correct:!0,message:{kunstgeschiedenis:"🎉 Uitstekend! Je kunsthistorische kennis is indrukwekkend!",cryptografie_geschiedenis:"🎉 Perfect! Je hebt de historische cipher gekraakt als een ware codebreker!",geneeskunde:"🎉 Briljant! Jouw medische inzicht klopt als een gezond hart!",filosofie_logica:"🎉 Logisch correct! Aristoteles zou trots zijn op je redenering!",alchemie_wiskunde:"🎉 Magistraal! Je beheerst de alchemistische kunst van getallen!"}[a.category]};break;default:for(const i of a.antwoorden){const n=this.validationRules.normalizeAnswer(i);if(a.caseSensitive){if(t.trim()===i)return{correct:!0,message:"🎉 Correct antwoord!"}}else if(s===n)return{correct:!0,message:"🎉 Correct antwoord!"}}}return{correct:!1,message:"❌ Niet correct. Probeer opnieuw!",hint:`💭 Dit raadsel valt onder de categorie: ${a.category}`}}getHints(e){return this.hints[parseInt(e)]||[]}getHint(e,t=1){const a=this.getHints(e),s=Math.min(t-1,a.length-1);return s<0?"💡 Er zijn nog geen hints beschikbaar voor dit raadsel.":a[s]}getTotalRiddles(){return this.raadsels.length}getAllAnswers(){return null}validateRiddleConfiguration(){const e=[];for(const t of this.raadsels)(!t.id||!t.titel||!t.raadsel)&&e.push(`Raadsel ${t.id||"unknown"}: Ontbrekende basis informatie`),(!t.antwoorden||t.antwoorden.length===0)&&e.push(`Raadsel ${t.id}: Geen antwoorden gedefinieerd`),(!this.hints[t.id]||this.hints[t.id].length===0)&&e.push(`Raadsel ${t.id}: Geen hints gedefinieerd`);return e.length>0?(console.error("RiddleEngine configuratie fouten:",e),!1):(console.log("✅ Alle raadsels zijn correct geconfigureerd"),!0)}}class c{constructor(){this.appElement=document.getElementById("app"),this.progressManager=new d,this.riddleEngine=new g,this.riddleEngine.validateRiddleConfiguration(),this.setupEventListeners(),console.log("App geïnitialiseerd met ProgressManager en RiddleEngine")}setupEventListeners(){console.log("Setting up event listeners..."),document.addEventListener("click",e=>{if(console.log("Click detected on:",e.target),this.progressManager.updateLaatsteActiviteit(),e.target.matches(".hint-btn")){e.preventDefault();const t=parseInt(e.target.dataset.raadsel);this.toonHint(t)}if(e.target.matches(".controleer-antwoord")){console.log("Controleer antwoord button clicked!"),e.preventDefault();const t=parseInt(e.target.dataset.raadsel);console.log("Raadsel nummer:",t),this.controleerAntwoord(t)}e.target.matches(".reset-progress")&&(e.preventDefault(),this.resetProgress())}),document.addEventListener("input",()=>{this.progressManager.updateLaatsteActiviteit()})}renderPagina(e){this.appElement.innerHTML=e}homePagina(){const e=this.progressManager.getStatus(),t=e.totaalRaadsels,a=e.voltooideRaadsels.length;return`
            <div class="container">
                <header class="hero">
                    <h1>🎉 Bruiloft Raadsels</h1>
                    <p class="subtitle">Een speciale uitdaging voor een speciale dag</p>
                </header>
                
                <main class="main-content">
                    <div class="progress-card">
                        <h2>Jouw Voortgang</h2>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${e.percentage}%"></div>
                        </div>
                        <p>${a} van ${t} raadsels opgelost (${e.percentage}%)</p>
                        
                        ${e.startTijd?`
                            <div class="progress-info">
                                <p><small>Gestart: ${new Date(e.startTijd).toLocaleDateString("nl-NL",{day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})}</small></p>
                                ${e.isIncognito?"<p><small>⚠️ Incognito modus - progress wordt niet permanent opgeslagen</small></p>":""}
                            </div>
                        `:""}
                    </div>
                    
                    <div class="actions">
                        ${e.isVoltooid?'<button class="btn-primary" data-route="/beloning">🏆 Zie je Beloning!</button>':`<button class="btn-primary" data-route="/raadsel/${e.huidigRaadsel}">${e.huidigRaadsel===1?"Begin de Uitdaging":"Ga Verder"}</button>`}
                        
                        ${a>0?`
                            <div class="raadsel-lijst">
                                <h3>Beschikbare Raadsels:</h3>
                                ${this.genereerRaadselLinks(e)}
                            </div>
                        `:""}
                        
                        <div class="debug-actions">
                            <button class="btn-secondary reset-progress">🔄 Reset Progress</button>
                        </div>
                    </div>
                </main>
            </div>
        `}raadselPagina(e){const t=parseInt(e),a=this.progressManager.getStatus();if(!this.progressManager.heeftToegang(t))return`
                <div class="container">
                    <div class="error-card">
                        <h2>🔒 Raadsel Vergrendeld</h2>
                        <p>Je moet eerst de vorige raadsels oplossen!</p>
                        <p><small>Huidige toegang tot raadsel: ${a.voltooideRaadsels.length+1}</small></p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;const s=this.riddleEngine.getRiddle(t);if(!s)return`
                <div class="container">
                    <div class="error-card">
                        <h2>❌ Raadsel Niet Gevonden</h2>
                        <p>Het opgevraagde raadsel bestaat niet.</p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;const i=a.voltooideRaadsels.includes(t),n=this.progressManager.getHintStatistieken(t);return`
            <div class="container">
                <header class="raadsel-header">
                    <nav class="breadcrumb">
                        <a data-route="/">Home</a> → Raadsel ${t}
                    </nav>
                    <div class="raadsel-progress">
                        <span class="raadsel-nummer">Raadsel ${t} ${i?"✅":""}</span>
                        <div class="mini-progress">
                            ${a.voltooideRaadsels.length} / ${a.totaalRaadsels}
                        </div>
                    </div>
                </header>
                
                <main class="raadsel-content">
                    <div class="raadsel-card">
                        <h2>${s.titel}</h2>
                        <div class="raadsel-tekst">
                            ${s.raadsel.split(`
`).map(o=>o.trim()?`<p>${o.trim()}</p>`:"").join("")}
                        </div>
                        
                        ${i?`
                            <div class="opgelost-bericht">
                                <h3>✅ Raadsel Opgelost!</h3>
                                <p>Goed gedaan! Ga verder naar het volgende raadsel.</p>
                                ${n.length>0?`<p><small>Je hebt ${n.length} hint(s) gebruikt voor dit raadsel.</small></p>`:""}
                            </div>
                        `:`
                            <div class="raadsel-input">
                                <input type="text" placeholder="Jouw antwoord..." class="antwoord-input" id="antwoord-${t}">
                                <button class="btn-primary controleer-antwoord" data-raadsel="${t}">Controleer Antwoord</button>
                            </div>
                            
                            <div class="raadsel-hints">
                                <button class="btn-secondary hint-btn" data-raadsel="${t}">💡 Hint ${n.length>0?`(${n.length} gebruikt)`:""}</button>
                            </div>
                        `}
                    </div>
                </main>
                
                <div class="navigatie">
                    ${t>1?`<button class="btn-secondary" data-route="/raadsel/${t-1}">← Vorig Raadsel</button>`:""}
                    <button class="btn-secondary" data-route="/">🏠 Home</button>
                    ${t<a.totaalRaadsels&&this.progressManager.heeftToegang(t+1)?`<button class="btn-secondary" data-route="/raadsel/${t+1}">Volgend Raadsel →</button>`:t===a.totaalRaadsels&&i?'<button class="btn-primary" data-route="/beloning">🏆 Naar Beloning!</button>':""}
                </div>
            </div>
        `}beloningPagina(){const e=this.progressManager.getStatus();if(!e.isVoltooid)return`
                <div class="container">
                    <div class="error-card">
                        <h2>🔒 Beloning Vergrendeld</h2>
                        <p>Los eerst alle raadsels op om je beloning te zien!</p>
                        <p><small>Voortgang: ${e.voltooideRaadsels.length}/${e.totaalRaadsels} raadsels</small></p>
                        <button class="btn-secondary" data-route="/">Terug naar Home</button>
                    </div>
                </div>
            `;const t=new Date(e.startTijd),a=new Date(e.laatsteActiviteit),s=Math.round((a-t)/(1e3*60)),i=Object.values(this.progressManager.getHintStatistieken()).reduce((n,o)=>n+o.length,0);return`
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
                                <span class="stat-nummer">${e.totaalRaadsels}</span>
                                <span class="stat-label">🏆 Raadsels Gemeesterd</span>
                            </div>
                            <div class="stat-item glow">
                                <span class="stat-nummer">${s}</span>
                                <span class="stat-label">⏱️ Minuten Totaal</span>
                            </div>
                            <div class="stat-item glow">
                                <span class="stat-nummer">${i}</span>
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
        `}genereerRaadselLinks(e){let t="";for(let a=1;a<=e.totaalRaadsels;a++){const s=e.voltooideRaadsels.includes(a);this.progressManager.heeftToegang(a)?t+=`
                    <a class="raadsel-link ${s?"opgelost":"beschikbaar"}" data-route="/raadsel/${a}">
                        ${s?"✅":"🔓"} Raadsel ${a}
                    </a>
                `:t+=`
                    <span class="raadsel-link vergrendeld">
                        🔒 Raadsel ${a}
                    </span>
                `}return t}toonHint(e){this.progressManager.registreerHintGebruik(e);const a=this.progressManager.getHintStatistieken(e).length,s=this.riddleEngine.getHints(e);let i=`💡 Hints voor Raadsel ${e}:

`;for(let n=0;n<Math.min(a,s.length);n++)i+=`Hint ${n+1}: ${s[n]}

`;a>s.length&&(i+=`Je hebt alle ${s.length} beschikbare hints al gebruikt.`),alert(i.trim()),location.reload()}controleerAntwoord(e){var i;console.log("controleerAntwoord called with:",e);const t=document.getElementById(`antwoord-${e}`);console.log("Input element:",t);const a=(i=t==null?void 0:t.value)==null?void 0:i.trim();if(console.log("User answer:",a),!a){alert("❌ Voer eerst een antwoord in!");return}console.log("Calling riddleEngine.validateAnswer...");const s=this.riddleEngine.validateAnswer(e,a);if(console.log("Validation result:",s),s.correct)if(console.log("Answer is correct!"),this.progressManager.markeerRaadselOpgelost(e)){alert(`${s.message}

🎉 Raadsel opgelost!`);const n=this.riddleEngine.getTotalRiddles();e<n?setTimeout(()=>{window.history.pushState({},"",`/raadsel/${e+1}`),location.reload()},1500):setTimeout(()=>{window.history.pushState({},"","/beloning"),location.reload()},1500)}else alert("Dit raadsel is al opgelost!");else{let n=s.message;s.hint&&(n+=`

${s.hint}`),alert(n),t.value="",t.focus()}}resetProgress(){confirm("Weet je zeker dat je alle progress wilt resetten?")&&(this.progressManager.resetProgress(),alert("Progress gereset!"),location.reload())}getProgressManager(){return this.progressManager}}console.log("Bruiloft Raadsels App wordt gestart...");document.addEventListener("DOMContentLoaded",()=>{const r=new c,e=new l;window.app=r,window.debugAnswers=()=>r.riddleEngine.getAllAnswers(),e.route("/",()=>{r.renderPagina(r.homePagina())}).route("/raadsel/:id",t=>{r.renderPagina(r.raadselPagina(t))}).route("/beloning",()=>{r.renderPagina(r.beloningPagina())}),e.start(),console.log("App succesvol geïnitialiseerd!"),console.log('Debug: gebruik "app.progressManager.getStatus()" in console voor progress info')});
