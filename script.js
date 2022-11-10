const resultsNavEl = document.getElementsByName('resultsNav');
const favoritesNavEl = document.getElementsByName('favoritesNav');
const imageContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 10;
const apiKey = `DEMO_KEY`;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
	window.scrollTo({ top: 0, behavior: 'instant'});
	if (page === 'results') {
		resultsNav.classList.remove('hidden');
		favoritesNav.classList.add('hidden');
	} else {
		resultsNav.classList.add('hidden');
		favoritesNav.classList.remove('hidden');
	}
	loader.classList.add('hidden');
}

// Creates card for the DOM
function createDOMNodes(page){
	const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
	currentArray.forEach((result) => {
		// Card Container
		const card = document.createElement('div');
		card.classList.add('card');
		// Link
		const link = document.createElement('a');
		link.href = result.hdurl;
		link.title = 'View Full Image';
		link.target = '_blank';
		// Image
		const image = document.createElement('img');
		image.src = result.url;
		image.alt = 'NASA Picture of the Day';
		image.loading = 'lazy';
		image.classList.add('card-img-top');
		// Card Body Container
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		// Card Title
		const title = document.createElement('h5');
		title.classList.add('card-title');
		title.textContent = result.title;
		// Add to Favorites
		const addFavorites = document.createElement('p');
		addFavorites.classList.add('clickable');
		if (page === 'results') {
			addFavorites.textContent = 'Add To Favorites';
			addFavorites.setAttribute('onclick', `saveFavorite('${result.url}')`);
		} else {
			addFavorites.textContent = 'Remove Favorite';
			addFavorites.setAttribute('onclick', `removeFavorite('${result.url}')`);
		}
		// Card Text
		const cardText = document.createElement('p');
		cardText.classList.add('card-text');
		cardText.textContent = result.explanation;
		// Footer Container
		const footer = document.createElement('small');
		footer.classList.add('text-muted');
		// Published Date
		const publishedDate = document.createElement('strong');
		publishedDate.textContent = result.date;
		// Copyright Info
		const copyrightResult = result.copyright === undefined ? '' : result.copyright;
		const copyrightText = document.createElement('span');
		copyrightText.textContent = ` ${copyrightResult}`;
		// Append
		footer.append(publishedDate, copyrightText);
		cardBody.append(title, addFavorites, cardText, footer);
		link.appendChild(image);
		card.append(link, cardBody);
		imageContainer.append(card);
	});
}

// Updates the DOM
function updateDOM(page) {
	// Get Favorites from localStorage
	if (localStorage.getItem('nasaFavorites')) {
		favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
	}
	imageContainer.textContent = '';
	createDOMNodes(page);
	showContent(page);
}

// Get 10 Images from NASA API
async function getNasaPictures() {
	// Show Loader
	loader.classList.remove('hidden');
	try {
		const response = await fetch(apiUrl);
		resultsArray = await response.json();
		updateDOM('results');
	} catch(error) {
		console.log(error);
	}
}

// Add result to Favorites
function saveFavorite(itemUrl) {
	// Loop through Results Array to select Favorite
	resultsArray.forEach((item) => {
		if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
			favorites[itemUrl] = item;
			// Show Save Confirmation for 2 Seconds
			saveConfirmed.hidden = false;
			setTimeout(() => {
				saveConfirmed.hidden = true;
			}, 2000);
			// Set Favorites in localStorage
			localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
		}
	})
}


// Remove item from Favorites
function removeFavorite(itemUrl) {
	if (favorites[itemUrl]) {
		delete favorites[itemUrl];
		// Set Favorites in localStorage
		localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
		updateDOM('favorites');
	}
}

// On Load
getNasaPictures();