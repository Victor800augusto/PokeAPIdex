const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=21&offset=0";
//
// const apiTest = "https://pokeapi.co/api/v2/pokedex/1";
// fetchTest(apiTest);
// async function fetchTest(apiTest) {
//   try {
//     const response = await fetch(apiTest);
//     const data = await response.json();
//     console.log(data.pokemon_entries[0].pokemon_species);
//     console.log(data.pokemon_entries.length);
//   } catch (error) {
//     console.log(error);
//   }
// }
//
const typeColors = [
  {
    type: "grass",
    color: "#7bce52",
  },
  {
    type: "poison",
    color: "#b55aa5",
  },
  {
    type: "bug",
    color: "#adbd21",
  },
  {
    type: "dragon",
    color: "#715fc2",
  },
  {
    type: "fairy",
    color: "#f7b5f7",
  },
  {
    type: "fire",
    color: "#f75231",
  },
  {
    type: "ghost",
    color: "#6363b5",
  },
  {
    type: "ground",
    color: "#b59c58",
  },
  {
    type: "normal",
    color: "#7f7b73",
  },
  {
    type: "psychic",
    color: "#ff73a5",
  },
  {
    type: "steel",
    color: "#adadc6",
  },
  {
    type: "dark",
    color: "#63564e",
  },
  {
    type: "electric",
    color: "#ffc631",
  },
  {
    type: "fighting",
    color: "#a55239",
  },
  {
    type: "flying",
    color: "#a0b0f5",
  },
  {
    type: "ice",
    color: "#5acee7",
  },
  {
    type: "rock",
    color: "#bda55a",
  },
  {
    type: "water",
    color: "#399cff",
  },
];
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
    getArrayPokemon(data);
  } catch (error) {
    console.log(error);
  }
};

function gradientTypePokemon(pokemon, typePokemon) {
  let colors = [];
  for (i = 0; i < typePokemon.length; i++) {
    const name = typePokemon[i].type.name;
    pokemon.classList.add(`${name}`);
    let color = typeColors.find((type) => type.type === name);
    colors.push(color.color);
  }
  if (typePokemon.length == 1) {
    pokemon.style.background = `${colors[0]}85`;
  } else {
    pokemon.style.background = `linear-gradient(90deg,${colors[0]}85,${colors[1]}85)`;
  }
}

function listTypePokemon(typePokemon, pokemonEntry) {
  gradientTypePokemon(pokemonEntry.parentElement, typePokemon);
  for (i = 0; i < typePokemon.length; i++) {
    const name = typePokemon[i].type.name;
    let span = document.createElement("span");
    span.classList.add(`${name}`);
    span.classList.add("typePokemon");
    span.innerHTML = `${titleCase(name)}`;

    pokemonEntry.append(span);
  }
}

function htmlPokemon(namePokemon, imgPokemon, typePokemon, id, divPokemon) {
  html = `<img src="${imgPokemon}" class="imgPokemon" alt="Image of the pokemon ${namePokemon}"></img>
   <div class="containerPokemonData">
   <span class="idPokemon">${id}</span>
   <h3>${titleCase(namePokemon)}</h3>
   <div class="containerTypePokemon">

   </div>
   </div>`;
  removeSkeleton(divPokemon);
  container.append(divPokemon);
  divPokemon.innerHTML = html;

  const pokemonEntry = divPokemon.childNodes[2].childNodes[5];
  listTypePokemon(typePokemon, pokemonEntry);
}

function populatePokemon(sortedPokemon) {
  for (let i = 0; i < sortedPokemon.length; i++) {
    const namePokemon = sortedPokemon[i].name;
    const imgPokemon = sortedPokemon[i].img;
    const typePokemon = sortedPokemon[i].type;
    const id = sortedPokemon[i].id;
    let divPokemon = document.getElementById(`${id}`);
    if (divPokemon != null) {
      htmlPokemon(namePokemon, imgPokemon, typePokemon, id, divPokemon);
    }
  }
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
    pokemon = { id: id, name: namePokemon, type: typePokemon, img: imgPokemon };
    return pokemon;
  } catch (error) {
    console.log(error);
  }
}

function removeSkeleton(divPokemon) {
  divPokemon.classList.remove("loading");
}

function addSkeleton(div) {
  let skeletonImgContainer = document.createElement("figure");
  skeletonImgContainer.classList.add("imgContainer", "loading");
  let skeletonImg = document.createElement("img");
  skeletonImg.classList.add("imgPokemon", "loading");
  let skeletonData = document.createElement("div");
  skeletonData.classList.add("containerPokemonData");
  let skeletonSpan = document.createElement("span");
  skeletonSpan.classList.add("idPokemon", "loading");
  let skeletonName = document.createElement("h3");
  skeletonName.classList.add("namePokemon", "loading");
  let skeletonType = document.createElement("div");
  skeletonType.classList.add("containerTypePokemon", "loading");
  div.append(skeletonImgContainer);
  skeletonImgContainer.append(skeletonImg);
  div.append(skeletonData);
  skeletonData.append(skeletonSpan);
  skeletonData.append(skeletonName);
  skeletonData.append(skeletonType);
}

function preRenderCards(Pokemon) {
  let i = 0;

  while (i < Pokemon.length) {
    const id = Pokemon[i].url.split("/")[6];
    let div = document.createElement("div");
    div.classList.add("itemPokemon", "loading");
    div.id = id;
    container.append(div);
    addSkeleton(div);
    i = i + 1;
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

function sortPokemon(arrayPokemon) {
  arrayPokemon.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  });
  return arrayPokemon;
}

async function checkFirstPokemon(data) {
  let { next: nextUrl } = data;
  let { previous: prevUrl } = data;
  isNextLimit = await checkPageLimit(nextUrl);
  if (!isNextLimit) {
    nextUrl = "";
    setPrevNext(prevUrl, nextUrl);
    btnNext.setAttribute("disabled", "disabled");
  } else {
    setPrevNext(prevUrl, nextUrl);
  }
}

function checkPreviousPage(data) {
  if (data.previous == null) {
    isPrevLimit = true;
    btnPrevious.setAttribute("disabled", "disabled");
  } else {
    isPrevLimit = false;
  }
}

async function orderPokemon(filteredResults, data) {
  let arrayPokemon = [];

  for (let i = 0; i < filteredResults.length; i++) {
    let url = filteredResults[i].url;
    const itemPokemon = await getDataPokemon(url);
    checkPreviousPage(data);
    arrayPokemon.push(itemPokemon);
  }
  return arrayPokemon;
}

async function getArrayPokemon(data) {
  const { results } = data;

  const filteredResults = await filterResults(results);
  preRenderCards(filteredResults);
  //
  checkFirstPokemon(data);

  const listPokemon = await orderPokemon(filteredResults, data);

  const sortedPokemon = sortPokemon(listPokemon);
  populatePokemon(sortedPokemon);
  //
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
