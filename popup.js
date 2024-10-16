// popup.js

document.getElementById('saveProfile').addEventListener('click', function () {
    const url = document.getElementById('profileUrl').value;
    if (url) {
        chrome.storage.local.get({ profiles: [] }, function (result) {
            const profiles = result.profiles || [];
            profiles.push({ url: url });
            chrome.storage.local.set({ profiles: profiles }, function () {
                alert('Profile saved!');
                document.getElementById('profileUrl').value = ''; // Clear input field
                
                // Request scraping for the saved profile
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    // Trigger content script
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    });
                });

                updateProfileList(); // Update the list after saving
            });
        });
    }
});

document.getElementById('showProfiles').addEventListener('click', updateProfileList);

function updateProfileList() {
    chrome.storage.local.get({ profiles: [] }, function (result) {
        const profileList = document.getElementById('profileList');
        profileList.innerHTML = ''; // Clear existing list

        result.profiles.forEach(profile => {
            const listItem = document.createElement('li');
            listItem.textContent = profile.url;

            // Color the artist name based on commission status
            const artistNameSpan = document.createElement('span');
            artistNameSpan.textContent = profile.name || 'Loading...';
            artistNameSpan.style.color = profile.isOpen ? 'green' : 'red'; // Color based on status
            listItem.appendChild(artistNameSpan);

            profileList.appendChild(listItem);
        });
    });
}
