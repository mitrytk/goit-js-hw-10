import '../css/styles.scss';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import '../../node_modules/notiflix/dist/notiflix-3.2.6.min.css';

const refs = {
    searchFeldEl: document.querySelector('input#search-box'),
    foundCountryListEl: document.querySelector('.country-list'),
    countryInfoRl: document.querySelector('.country-info'),
}

const markupList = [];
const DEBOUNCE_DELAY = 300;

refs.searchFeldEl.addEventListener('input', debounce(onSearchFeldSabmit, DEBOUNCE_DELAY));

function onSearchFeldSabmit(e) {
    clearFound ();
    const searchQuery = e.target.value.trim();

    if (searchQuery.length <= 1) {
        return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    }

    fetchCountry(searchQuery);
}

function fetchCountry(name) {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
    fetch(url)
    .then(resources => resources.json())
    .then(date => {
        if (date.length > 10) {
            return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        }
        if (date.length > 2 ) {
            date.map(renderCountryList);
        } else {
            console.log(date);
            date.map(renderCountry);
        }
    })
    .catch(date => {
        return Notiflix.Notify.failure("Oops, there is no country with that name");
    })
}
function renderCountry(el) {
    const languagesArray = [];
    for (const key in el.languages) {
        if (Object.hasOwnProperty.call(el.languages, key)) {
            languagesArray.push(el.languages[key]);
        }
    }
    const languages = languagesArray.join(', ');

    const divEl = document.createElement('div');
    divEl.classList.add('country__item-one');

    const divBox = document.createElement('div');
    divBox.classList.add('country__box')
    divEl.append(divBox);

    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', el.flags.svg);
    divBox.append(imgEl);

    const hEl = document.createElement('h2');
    hEl.textContent = el.name.common;
    hEl.classList.add('country__title');
    hEl.style.fontSize = '30px';
    divBox.append(hEl);

    const pCapitalEl = document.createElement('p');
    const bCapitalEl = document.createElement('b');
    bCapitalEl.textContent = 'Capital: ';
    pCapitalEl.append(bCapitalEl);
    const spanCapitalEl = document.createElement('span');
    spanCapitalEl.textContent = el.capital;
    pCapitalEl.append(spanCapitalEl);
    divEl.append(pCapitalEl);

    const pPopulationEl = document.createElement('p');
    const bPopulationEl = document.createElement('b');
    bPopulationEl.textContent = 'Population: ';
    pPopulationEl.append(bPopulationEl);
    const spanPopulationEl = document.createElement('span');
    spanPopulationEl.textContent = el.population;
    pPopulationEl.append(spanPopulationEl);
    divEl.append(pPopulationEl);

    const pLanguagesEl = document.createElement('p');
    const bLanguagesEl = document.createElement('b');
    bLanguagesEl.textContent = 'Languages: ';
    pLanguagesEl.append(bLanguagesEl);
    const spanLanguagesEl = document.createElement('span');
    spanLanguagesEl.textContent = languages;
    pLanguagesEl.append(spanLanguagesEl);
    divEl.append(pLanguagesEl);

    refs.countryInfoRl.append(divEl);
}
function renderCountryList(el) {
    const liEl = document.createElement('li');
    liEl.classList.add('country__item');

    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', el.flags.svg);
    liEl.append(imgEl);

    const pEl = document.createElement('p');
    pEl.textContent = el.name.common;
    liEl.append(pEl);

    refs.foundCountryListEl.append(liEl);
}
function clearFound () {
    refs.foundCountryListEl.innerHTML = '';
    refs.countryInfoRl.innerHTML = '';
}
