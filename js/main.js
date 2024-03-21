function themeHandler() {
	// JavaScript code that is responsible to determine current theme (dark/light) and set class name based on it
	// Also, the current theme value is stored in the localStorage (default: light)
	const themeSwitcher = document.querySelector('.navbar__theme-switcher');
	const themeName = document.querySelector('.navbar__theme-switcher span');
	const themeIcon = document.querySelector('.navbar__theme-switcher img');
	const appRoot = document.querySelector('html');
	const currentTheme = localStorage.getItem('theme') || 'light'; // Default theme value is light

	function setTheme(theme_name) {
		appRoot.setAttribute('data-theme', theme_name);
		themeName.textContent = theme_name === 'light' ? 'dark' : 'light';
		themeIcon.src = theme_name === 'light' ? '/assets/icon-moon.svg' : '/assets/icon-sun.svg';
		themeIcon.setAttribute('alt', theme_name === 'light' ? 'moon' : 'sun');
		// Set the current theme value to the localStorage
		localStorage.setItem('theme', theme_name);
	}

	// Set the current theme
	setTheme(currentTheme);

	// Add event listener to the theme switcher
	themeSwitcher.addEventListener('click', () => {
		const newTheme = appRoot.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
		// Set the new theme
		setTheme(newTheme);
	});
}

function setContent(data) {
	// JavaScript code that is responsible to set the content based on the fetched data
	// Select the elements
	/* Basic info elements */
	const avatar = document.querySelector('.card__avatar');
	const name = document.querySelector('.card__name');
	const username = document.querySelector('.card__username');
	const joined = document.querySelector('.card__joined');
	const bio = document.querySelector('.card__bio');
	/* Stats elements */
	const repos = document.getElementById('stat-repos');
	const reposValue = repos.querySelector('.card__stat-item-value');
	const followers = document.getElementById('stat-followers');
	const followersValue = followers.querySelector('.card__stat-item-value');
	const following = document.getElementById('stat-following');
	const followingValue = following.querySelector('.card__stat-item-value');
	/* Additional info elements */
	const location = document.getElementById('info-location');
	const locationValue = location.querySelector('.card__additional-info-item-value');
	const website = document.getElementById('info-website');
	const websiteValue = website.querySelector('.card__additional-info-item-value');
	const twitter = document.getElementById('info-twitter');
	const twitterValue = twitter.querySelector('.card__additional-info-item-value');
	const company = document.getElementById('info-company');
	const companyValue = company.querySelector('.card__additional-info-item-value');
	/* Set the content based on the fetched data */
	avatar.src = data.avatar_url || '/assets/default-avatar.svg';
	avatar.alt = data.name || 'avatar';
	name.textContent = data.name || '';
	username.textContent = `@${data.login}` || '';
	username.href = data.login ? `https://github.com/${data.login}` : '#';

	// Format the date (e.g. Joined 25 Jan 2015)
	joined.textContent = data.created_at
		? `Joined ${new Date(data.created_at).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
		  })}`
		: '';
	// If bio value is not available, add the class to make it hidden
	bio.textContent = data.bio || 'This profile has no bio';
	bio.classList.toggle('card__bio--disabled', !data.bio);
	// Set the stats value. If the value is not available, set the value to 0
	reposValue.textContent = data.public_repos || 0;
	followersValue.textContent = data.followers || 0;
	followingValue.textContent = data.following || 0;
	// Set the additional info. If the value is not available, add the class to lower the opacity
	locationValue.textContent = data.location || 'Not available';
	location.classList.toggle('card__additional-info-item--disabled', !data.location);
	// If blog value is available, set the href attribute to the value element
	websiteValue.textContent = data.blog
		? data.blog.includes('http')
			? data.blog
			: `https://${data.blog}`
		: 'Not available';
	websiteValue.href = data.blog
		? data.blog.includes('http')
			? data.blog
			: `https://${data.blog}`
		: '#';
	website.classList.toggle('card__additional-info-item--disabled', !data.blog);
	// If twitter value is available, set the href attribute to the value element
	twitterValue.textContent = data.twitter_username ? `@${data.twitter_username}` : 'Not available';
	twitterValue.href = data.twitter_username ? `https://twitter.com/${data.twitter_username}` : '#';
	twitter.classList.toggle('card__additional-info-item--disabled', !data.twitter_username);
	companyValue.textContent = data.company || 'Not available';
	company.classList.toggle('card__additional-info-item--disabled', !data.company);
}

function setLoader(value) {
	// JavaScript code that is responsible to set the loader based on the value (boolean)
	// If the value is true, show the loader
	// If the value is false, hide the loader
	const content = document.querySelector('.content');

	if (value) {
		content.classList.add('content--loading');
	} else {
		content.classList.remove('content--loading');
	}
}

function setError(value) {
	// JavaScript code that is responsible to set the error message based on the value (boolean)
	// If the value is true, show the error message
	// If the value is false, hide the error message
	const content = document.querySelector('.content');

	if (value) {
		content.classList.add('content--error');
	} else {
		content.classList.remove('content--error');
	}
}

async function fetchData(searchValue) {
	// JavaScript code that is responsible to fetch data from the API based on the search value
	// Return the fetched data (response data example: {error: false, data: {}}, {error: true, data: {}})
	const API_ENDPOINT = `https://api.github.com/users/${searchValue}`;
	// Set the error message
	setError(false);
	// Set the loader
	setLoader(true);
	// Fetch data from the API
	const response = await fetch(API_ENDPOINT);
	// Convert the response to JSON
	const data = await response.json();
	// Hide the loader
	setLoader(false);
	// Check if the response is not ok
	if (!response.ok) {
		// Set the error message
		setError(true);
		// Return the error message
		return { error: true, data };
	}
	// Hide the error message
	setError(false);
	// Return the fetched data
	return { error: false, data };
}

function searchHandler() {
	// JavaScript code that is responsible to handle search functionality
	// When the user clicks on the search icon, the search input will be focused
	// When the user clicks on the search button, data will be fetched based on the search input value
	const searchForm = document.querySelector('.search-form');
	const searchIcon = document.querySelector('.search-form__icon');
	const searchInput = document.querySelector('.search-form__input');
	const searchButton = document.querySelector('.search-form__button');

	searchIcon.addEventListener('click', () => {
		searchInput.focus();
	});

	searchInput.addEventListener('input', () => {
		// If the search input value is changed, remove the error class
		searchForm.classList.remove('search-form--error');
	});

	searchButton.addEventListener('click', async (e) => {
		e.preventDefault();
		const searchValue = searchInput.value;
		if (searchValue === '') {
			searchInput.focus();
			return;
		}
		// Fetch data based on the search value
		const data = await fetchData(searchValue);
		// Check if there is an error
		if (data.error) {
			// Show the error message
			searchForm.classList.add('search-form--error');
		} else {
			// Set the content based on the fetched data
			setContent(data.data);
		}
	});
}

window.addEventListener('DOMContentLoaded', () => {
	// Call the themeHandler function
	themeHandler();
	// Call the searchHandler function
	searchHandler();
	// By default, fetch the data based on the username "davidkadaria"
	fetchData('davidkadaria').then((data) => {
		// Set the content based on the fetched data
		setContent(data.data);
	});
});
