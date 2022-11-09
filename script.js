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

// Updates the DOM
function updateDOM() {
	resultsArray.forEach((result) => {
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
		addFavorites.textContent = 'Add To Favorites';
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

// Get 10 Images from NASA API
async function getNasaPictures() {
	try {
		const response = await fetch(apiUrl);
		resultsArray = await response.json();
		updateDOM();
	} catch(error) {
		console.log(error);
	}
}

// On Load
getNasaPictures();