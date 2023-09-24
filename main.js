let mainContainer = document.querySelector('.main_container');
const ENDPOINT = 'https://pokeapi.co/api/v2/pokemon';
let nextUrl = '';
let previousUrl = '';

const btnNext = document.querySelector('.btnNext');
const btnPrevious = document.querySelector('.btnPrevious');

const getPokemons = async URL => {
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.next) nextUrl = data.next;
    if (data.previous) previousUrl = data.previous;

    let pokemons = [];

    for (let index = 0; index < data.results.length; index++) {
      const newResponse = await fetch(data.results[index].url);
      const newData = await newResponse.json();
      pokemons.push({
        name: data.results[index].name,
        img: newData.sprites.front_default,
        experience: newData.base_experience,
        height: newData.height,
        abilities: newData.abilities,
      });
    }

    renderPokemons(pokemons);
  } catch (error) {
    console.log(error);
    return [];
  }
};

const renderPokemons = async pokemons => {
  mainContainer.innerHTML = '';
  pokemons.map(pokemon => {
    mainContainer.innerHTML += /*html*/ `
    
    <div class="card_container">
        <h2 class="pokemon_name">${pokemon.name}</h2>
        <img
          src=${pokemon.img}
          class="image"
          alt="img"
        />
        <p><b>ABILITIES</b></p>
        <p class="abilities">${renderAbilities(pokemon.abilities)}</p>
        <p><b>EXPERIENCE</b></p>
        <p class="experince">${pokemon.experience}</p>
        <p><b>HEIGHT</b></p>
        <p class="height">${pokemon.height}</p>
      </div>

    `;
  });
};

const renderAbilities = abilities => {
  let text = '';
  abilities.forEach(element => {
    text += `
    <span>${element.ability.name}</span><br>
  `;
  });
  return text;
};

getPokemons(ENDPOINT);

btnNext.addEventListener('click', () => {
  if (nextUrl !== '') {
    getPokemons(nextUrl);
    mainContainer.innerHTML = 'Loading...';
  }
});

btnPrevious.addEventListener('click', () => {
  if (previousUrl !== '') {
    getPokemons(previousUrl);
    mainContainer.innerHTML = 'Loading...';
  }
});
