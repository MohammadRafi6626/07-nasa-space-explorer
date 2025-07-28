// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to the button and gallery
const getImagesButton = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// Get modal references
const modal = document.getElementById('imageModal');
const modalMedia = document.getElementById('modalMedia');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalClose = document.querySelector('.modal-close');

// Space facts array
const spaceFacts = [
  "A day on Venus is longer than its year! Venus rotates so slowly that one day lasts 243 Earth days, while its year is only 225 Earth days.",
  "The International Space Station travels at 17,500 mph and orbits Earth every 90 minutes.",
  "Saturn's moon Titan has lakes and rivers made of liquid methane and ethane instead of water.",
  "Neutron stars are so dense that a teaspoon of neutron star material would weigh about 6 billion tons on Earth.",
  "The largest volcano in our solar system is Olympus Mons on Mars, which is nearly 14 miles high and 370 miles across.",
  "Jupiter's Great Red Spot is a storm that has been raging for at least 400 years and is larger than Earth.",
  "Astronauts' hearts become more spherical in space due to the lack of gravity.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but don't worry - it won't happen for 4.5 billion years!",
  "One million Earths could fit inside the Sun, but the Sun is just an average-sized star.",
  "Space is completely silent because sound waves need a medium to travel through, and space is a vacuum."
];

// NASA APOD API key (use DEMO_KEY for demo purposes)
const API_KEY = '3d2BZPI6alsCIMnS22c7CQrsfTPNWMxfsgK5QL7a';

// Function to build the API URL based on user input
function buildApiUrl(startDate, endDate) {
  // Use the APOD API with start_date and end_date parameters
  return `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
}

// Function to show a loading message
function showLoading() {
  gallery.innerHTML = `<p style="font-size:1.2rem; text-align:center;">🔄 Loading space photos…</p>`;
}

// Function to create gallery items from API data
function displayGallery(items) {
  // Clear the gallery
  gallery.innerHTML = '';
  // Loop through each item and create a card for images or videos
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    if (item.media_type === 'image') {
      // Show image with title and date
      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
    } else if (item.media_type === 'video') {
      // Check if the video is a YouTube link
      const isYouTube = item.url.includes('youtube.com') || item.url.includes('youtu.be');
      if (isYouTube) {
        // Embed YouTube video
        let embedUrl = item.url;
        // Convert youtu.be short links to embed
        if (item.url.includes('youtu.be')) {
          const videoId = item.url.split('youtu.be/')[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (item.url.includes('watch?v=')) {
          const videoId = item.url.split('watch?v=')[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }
        card.innerHTML = `
          <div class="video-wrapper">
            <iframe src="${embedUrl}" frameborder="0" allowfullscreen title="${item.title}"></iframe>
          </div>
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
      } else {
        // For non-YouTube videos, show a clear link
        card.innerHTML = `
          <div class="video-link">
            <a href="${item.url}" target="_blank" rel="noopener" class="video-btn">▶️ Watch Video</a>
          </div>
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;
      }
    }
    // Only add card if it has content (image or video)
    if (card.innerHTML.trim() !== '') {
      // Add click event listener to open modal
      card.addEventListener('click', () => openModal(item));
      gallery.appendChild(card);
    }
  });
  // If no items found, show a message
  if (gallery.innerHTML === '') {
    gallery.innerHTML = '<p>No images or videos found for this date range.</p>';
  }
}

// Function to fetch images from NASA APOD API
function fetchImages() {
  // Get the selected dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Show loading message
  showLoading();
  // Build the API URL
  const url = buildApiUrl(startDate, endDate);
  // Fetch data from the API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // If data is a single object, put it in an array
      const items = Array.isArray(data) ? data : [data];
      displayGallery(items);
    })
    .catch(error => {
      // Show error message if something goes wrong
      gallery.innerHTML = `<p>Sorry, something went wrong. Please try again later.</p>`;
      console.error(error);
    });
}

// Add event listener to the button
getImagesButton.addEventListener('click', fetchImages);

// Modal functions
function openModal(item) {
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation || 'No description available.';
  
  if (item.media_type === 'image') {
    modalMedia.innerHTML = `<img src="${item.hdurl || item.url}" alt="${item.title}" />`;
  } else if (item.media_type === 'video') {
    modalMedia.innerHTML = `
      <div class="video-wrapper">
        <iframe src="${item.url}" frameborder="0" allowfullscreen title="${item.title}"></iframe>
      </div>
    `;
  }
  
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

// Modal event listeners
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Function to display random space fact
function displayRandomSpaceFact() {
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const factText = document.getElementById('factText');
  factText.textContent = spaceFacts[randomIndex];
}

// Display random space fact on page load
document.addEventListener('DOMContentLoaded', displayRandomSpaceFact);
