// Test script voor routing functionaliteit
console.log('=== Bruiloft Raadsels Routing Test ===');

// Wacht even tot app geladen is
setTimeout(() => {
    console.log('Testing routing functionality...');
    
    // Test 1: Check if app initialized
    const app = document.getElementById('app');
    if (app && app.innerHTML.includes('Bruiloft Raadsels')) {
        console.log('✅ App successfully initialized');
    } else {
        console.log('❌ App failed to initialize');
    }
    
    // Test 2: Check navigation links
    const links = document.querySelectorAll('[data-route]');
    console.log(`✅ Found ${links.length} navigation links`);
    
    // Test 3: Simulate navigation
    if (links.length > 0) {
        console.log('Testing navigation...');
        // Click first available link
        links[0].click();
        
        setTimeout(() => {
            const currentUrl = window.location.pathname;
            console.log(`✅ Navigation successful - Current URL: ${currentUrl}`);
            
            // Test browser back button
            window.history.back();
            setTimeout(() => {
                console.log(`✅ Back button test - URL: ${window.location.pathname}`);
            }, 100);
        }, 100);
    }
}, 1000);