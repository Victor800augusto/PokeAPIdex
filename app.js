const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=21&offset=0";
let prevUrl = "";
let nextUrl = "";
let isNextLimit;
let isPrevLimit;

const btnNext = document.getElementById("btnNext");
const btnPrevious = document.getElementById("btnPrev");

const container = document.querySelector("#container");

let isLastItem = false;

const init = async () => {
  btnPrevious.setAttribute("disabled", "disabled");
  await fetchPokemon(apiUrl);
  btnNext.addEventListener("click", nextPage);
  btnPrevious.addEventListener("click", previousPage);
};

const fetchPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    getPokemon(data);
  } catch (error) {
    console.log(error);
  }
};

function populatePokemon(namePokemon, imgPokemon, typePokemon, id) {
  // let div = document.createElement("div");
  // div.classList.add("itemPokemon");
  let divPokemon = document.querySelector(`.${namePokemon}`);
  // let divPokemon = document.querySelector(`.itemPokemon:nth-child(${index})`);
  html = `<img src="${imgPokemon}" class="imgPokemon" alt="Imagem do pokemon ${namePokemon}"></img>
  <div class="containerPokemonData">
  <h3>${titleCase(namePokemon)}</h3>
  <div class="containerTypePokemon">
  
  </div>
  </div>`;
  container.append(divPokemon);
  divPokemon.innerHTML = html;

  const pokemonEntry = divPokemon.childNodes[2].childNodes[3];

  const listTypePokemon = typePokemon.map((item) => {
    const { type } = item;
    const { name } = type;
    let span = document.createElement("span");
    span.classList.add(`${name}`);
    span.classList.add("typePokemon");
    span.innerHTML = `${titleCase(name)}`;
    pokemonEntry.append(span);
  });
}

function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

async function getDataPokemon(item) {
  try {
    const response = await fetch(item);
    const itemApi = await response.json();
    const sprites = itemApi.sprites;
    const { front_default: imgPokemon } = sprites;
    const species = itemApi.species;
    const { name: namePokemon } = species;
    const typePokemon = itemApi.types;
    const id = itemApi.id;
    // populatePokemon(namePokemon, imgPokemon, typePokemon, id);
  } catch (error) {
    console.log(error);
  }
}

function preRenderCards(Pokemon) {
  let quantityCards = 0;

  while (quantityCards < Pokemon.length) {
    const namePokemon = Pokemon[quantityCards].name;
    let div = document.createElement("div");
    div.classList.add("itemPokemon");
    div.classList.add(namePokemon);
    container.append(div);
    quantityCards = quantityCards + 1;
  }
}

function filterResults(results) {
  let filteredResults = results.filter((item) => {
    const { url } = item;
    if (url.length < 40) {
      return url;
    }
  });
  return filteredResults;
}

function getPokemon(data) {
  const { results } = data;

  const filteredResults = filterResults(results);
  preRenderCards(filteredResults);

  const listPokemon = filteredResults.map(async (item, index) => {
    const { url } = item;

    if (index + 1 == filteredResults.length) {
      let { next: nextUrl } = data;
      let { previous: prevUrl } = data;
      isNextLimit = await checkPageLimit(nextUrl);
      if (!isNextLimit) {
        nextUrl = "";
        btnNext.setAttribute("disabled", "disabled");
      } else {
        setPrevNext(prevUrl, nextUrl);
      }
    }

    await getDataPokemon(url);
    if (data.previous == null) {
      isPrevLimit = true;
      btnPrevious.setAttribute("disabled", "disabled");
    } else {
      isPrevLimit = false;
      buttonTimer();
    }
  });
}
function clearLastPokemonBatch() {
  container.innerHTML = "";
}

function buttonTimer() {
  setTimeout(() => {
    if (isNextLimit) {
      btnNext.removeAttribute("disabled");
    }
    if (!isPrevLimit) {
      btnPrevious.removeAttribute("disabled");
    }
  }, 600);
}

const nextPage = () => {
  if (nextUrl) {
    btnNext.setAttribute("disabled", "disabled");
    btnPrevious.setAttribute("disabled", "disabled");
    buttonTimer();
    document.documentElement.scrollTop = 0;
    clearLastPokemonBatch();
    fetchPokemon(nextUrl);
  } else {
    return;
  }
};
const previousPage = () => {
  if (prevUrl) {
    btnNext.setAttribute("disabled", "disabled");
    btnPrevious.setAttribute("disabled", "disabled");
    buttonTimer();
    document.documentElement.scrollTop = 0;
    clearLastPokemonBatch();
    fetchPokemon(prevUrl);
  } else {
    return;
  }
};

function setPrevNext(previous, next) {
  nextUrl = next;
  prevUrl = previous;
}

const fetchCheckPokemon = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results[0].url.length < 40) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
async function checkPageLimit(nextUrl) {
  const hasMorePages = await fetchCheckPokemon(nextUrl);
  return hasMorePages;
}

window.addEventListener("load", init());
