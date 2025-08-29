// Hoofd applicatie entry point
import { Router } from './router.js';
import { App } from './app.js';
import './styles.css';

console.log('Bruiloft Raadsels App wordt gestart...');

// Wacht tot DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    // Initialiseer app en router
    const app = new App();
    const router = new Router();
    
    // Maak app en router beschikbaar voor debugging en navigation
    window.app = app;
    window.router = router;
    
    // Debug functie voor ontwikkeling - toon alle antwoorden
    window.debugAnswers = () => {
        return app.riddleEngine.getAllAnswers();
    };
    
    // Registreer routes
    router
        .route('/', () => {
            app.renderPagina(app.homePagina());
        })
        .route('/raadsel/:id', (riddleId) => {
            app.renderPagina(app.raadselPagina(riddleId));
        })
        .route('/beloning', () => {
            app.renderPagina(app.beloningPagina());
        });
    
    // Start de router
    router.start();
    
    console.log('App succesvol geïnitialiseerd!');
    console.log('Debug: gebruik "app.progressManager.getStatus()" in console voor progress info');
});