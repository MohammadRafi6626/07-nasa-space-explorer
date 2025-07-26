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

// NASA APOD API key (use DEMO_KEY for demo purposes)
const API_KEY = '3d2BZPI6alsCIMnS22c7CQrsfTPNWMxfsgK5QL7a';

// Function to build the API URL based on user input
function buildApiUrl(startDate, endDate) {
  // Use the APOD API with start_date and end_date parameters
  return `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;
}

// Function to show a loading message
function showLoading() {
  gallery.innerHTML = `<p>Loading space images...</p>`;
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
      // Embed video with title and date
      card.innerHTML = `
        <div class="video-wrapper">
          <iframe src="${item.url}" frameborder="0" allowfullscreen title="${item.title}"></iframe>
        </div>
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
    }
    // Only add card if it has content (image or video)
    if (card.innerHTML.trim() !== '') {
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

// --- Fun Space Facts ---
const spaceFacts = [
  "A day on Venus is longer than a year on Venus!",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "The footprints on the Moon will be there for millions of years.",
  "One million Earths could fit inside the Sun.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Jupiter has 80 known moons!",
  "The hottest planet in our solar system is Venus.",
  "Space is completely silent.",
  "The largest volcano in the solar system is on Mars."
];

// Show a random fun fact above the gallery
function showRandomFact() {
  const factBox = document.getElementById('space-fact');
  if (factBox) {
    const randomIndex = Math.floor(Math.random() * spaceFacts.length);
    factBox.textContent = `Did You Know? ${spaceFacts[randomIndex]}`;
  }
}
window.addEventListener('DOMContentLoaded', showRandomFact);

// --- Modal Logic ---
// Create modal structure and add to body
const modal = document.createElement('div');
modal.id = 'modal';
modal.className = 'modal hidden';
modal.innerHTML = `
  <div class="modal-content">
    <span class="close-btn" tabindex="0">&times;</span>
    <div class="modal-media"></div>
    <h2 class="modal-title"></h2>
    <p class="modal-date"></p>
    <p class="modal-explanation"></p>
  </div>
`;
document.body.appendChild(modal);

const closeModal = () => {
  modal.classList.add('hidden');
  modal.querySelector('.modal-media').innerHTML = '';
  modal.querySelector('.modal-title').textContent = '';
  modal.querySelector('.modal-date').textContent = '';
  modal.querySelector('.modal-explanation').textContent = '';
};
modal.querySelector('.close-btn').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Update displayGallery to support modal and replace placeholder
function displayGallery(items) {
  // Clear the gallery and remove placeholder if present
  gallery.innerHTML = '';
  // Loop through each item and create a card for images or videos
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item';
    card.tabIndex = 0;
    if (item.media_type === 'image') {
      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
    } else if (item.media_type === 'video') {
      card.innerHTML = `
        <div class="video-wrapper">
          <iframe src="${item.url}" frameborder="0" allowfullscreen title="${item.title}"></iframe>
        </div>
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
    }
    // Modal open logic
    card.addEventListener('click', () => {
      if (item.media_type === 'image') {
        modal.querySelector('.modal-media').innerHTML = `<img src="${item.hdurl || item.url}" alt="${item.title}" />`;
      } else if (item.media_type === 'video') {
        modal.querySelector('.modal-media').innerHTML = `<iframe src="${item.url}" frameborder="0" allowfullscreen title="${item.title}"></iframe>`;
      }
      modal.querySelector('.modal-title').textContent = item.title;
      modal.querySelector('.modal-date').textContent = item.date;
      modal.querySelector('.modal-explanation').textContent = item.explanation;
      modal.classList.remove('hidden');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
    if (card.innerHTML.trim() !== '') {
      gallery.appendChild(card);
    }
  });
  if (gallery.innerHTML === '') {
    gallery.innerHTML = '<p>No images or videos found for this date range.</p>';
  }
}
