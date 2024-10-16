// content.js

function scrapeArtistInfo() {
    let artistName = '';
    let isCommissionOpen = false;

    // Check Facebook
    const fbDescription = document.querySelector('span[dir="auto"]');
    if (fbDescription) {
        artistName = fbDescription.textContent.split('!')[0].replace('Hello, I\'m ', '').trim();
        isCommissionOpen = fbDescription.textContent.toLowerCase().includes('my commissions are open');
    }

    // Check X (Twitter)
    const twitterDescription = document.querySelector('[data-testid="UserDescription"]');
    if (twitterDescription) {
        const content = twitterDescription.textContent.toLowerCase();
        artistName = artistName || content.split('/')[0].trim(); // Get username from description if not found
        isCommissionOpen = isCommissionOpen || content.includes('commission open');
    }

    // Send the scraped data back to the background script
    chrome.runtime.sendMessage({
        artistName: artistName,
        isCommissionOpen: isCommissionOpen
    });
}

// Call the scrape function immediately
scrapeArtistInfo();

