import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box')
const countryList = document.querySelector('.country-list')
const countryInfo = document.querySelector('.country-info')



inputEl.addEventListener('input',
    debounce (onInput, DEBOUNCE_DELAY)
);



function onInput() {
    clearMarkup()

    if (inputEl.value.trim() === '') {
        return clearMarkup()
    }
     fetchCountries(inputEl.value.trim())
        .then((countries) => {
             if (countries.length > 10) {
                
               return Notify.info("Too many matches found. Please enter a more specific name.")
            }
            if (countries.length >= 2 && countries.length <= 10) {
                renderCountriesList(countries);
            }
             else {
                renderCountriesInfo(countries);
             }
                   
        })
         .catch(error => { Notify.failure("Oops, there is no country with that name") })

}

function renderCountriesList(countries) {
    const markup = countries.map(
        ({ flags, name }) => 
            `<li class="country-list__item">
             <img class="country-list__img" src="${flags.svg}" alt="flags" width="50" >
              <p class="country-list__name">${name.official}</p>
      </li>`
        ).join('');
        
         countryList.insertAdjacentHTML('beforeend', markup);
      
}

function renderCountriesInfo(countries) {
    const markup = countries.map(
        ({ flags, name, capital, population, languages }) => 

           `<div class="country-info__container">
              <img class="country-img" src="${flags.svg}" alt="" width="40" height="40" >
              <p class="country-name">${name.official}</p>
            </div>
              <p class="country-item"><span class="country-text">Capital:</span>${capital[0]}</p>
              <p class="country-item"><span class="country-text">Population:</span>${population}</p>
              <p class="country-item"><span class="country-text">Languages:</span>${Object.values(languages)}</p>`
                   
        ).join('');
        
         countryInfo.insertAdjacentHTML('beforeend', markup);
      
}

function clearMarkup() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
}
