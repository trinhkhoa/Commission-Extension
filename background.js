// background.js

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.artistName) {
        chrome.storage.local.get({ profiles: [] }, function (result) {
            const profiles = result.profiles || [];
            const profileExists = profiles.find(profile => profile.url === sender.tab.url);

            if (!profileExists) {
                profiles.push({ url: sender.tab.url, name: message.artistName, isOpen: message.isCommissionOpen });
                chrome.storage.local.set({ profiles: profiles }, function () {
                    console.log(`Saved profile: ${message.artistName}`);
                    
                    // Notify if commissions are open
                    if (message.isCommissionOpen) {
                        chrome.notifications.create({
                            type: 'basic',
                            iconUrl: 'icon128.png',
                            title: 'Commission Open Alert!',
                            message: `Commission open detected for ${message.artistName} (${sender.tab.url})`
                        });
                    }
                });
            }
        });
    }
});

// Set up an alarm to check for updates every hour
chrome.alarms.create('commissionCheck', { periodInMinutes: 60 });


