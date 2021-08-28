const containerPagination = document.querySelector(".pagination ul");
const container = document.querySelector("#container");

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

let page = 1;
let totalPages;
let totalPokemon;
let allPokemon;
let initial;

const init = async () => {
  initial = true;
  const dataPokemon = await fetchAllPokemon();
  totalPokemon = dataPokemon.pokemon_entries.length;
  allPokemon = dataPokemon.pokemon_entries;
  totalPages = Math.ceil(totalPokemon / 21);
  containerPagination.innerHTML = createPagination(totalPages, page);
  const activePage = document.querySelector(".active");
  getArrayPokemon(parseInt(activePage.textContent), allPokemon);
};

async function fetchAllPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokedex/1");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getArrayPokemon(currentPage, allPokemon) {
  const arrayPokemon = callFetchStandard(currentPage, allPokemon);

  if (initial == false) {
    clearLastPokemonBatch();
  }
  initial = false;
  preRenderCards(arrayPokemon);
  const listPokemon = await orderPokemon(arrayPokemon);
  const sortedPokemon = sort(listPokemon);
  populatePokemon(sortedPokemon);
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function createPagination(totalPages, page) {
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) {
    //Show prev button if current page is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    });getArrayPokemon(${
      page - 1
    },allPokemon);scrollToTop()"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) {
    //if page value is more than 2 then add first page after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1);getArrayPokemon(1,allPokemon);scrollToTop()"><span>1</span></li>`;
    if (page > 3) {
      //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
  }

  // how many pages or li will be shown before the current li
  if (page == totalPages) {
    beforePage = beforePage - 2;
  } else if (page == totalPages - 1) {
    beforePage = beforePage - 1;
  }

  // how many pages or li will be shown after the current li
  if (page == 1) {
    afterPage = afterPage + 2;
  } else if (page == 2) {
    afterPage = afterPage + 1;
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) {
      //if plength is greater than totalPage then continue
      continue;
    }
    if (plength == 0) {
      //if plength is 0 add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) {
      //if page is equal to plength than assign active string in the active variable
      active = "active";
      liTag += `<li class="numb ${active}"><span>${plength}</span></li>`;
    } else {
      //else leave empty to the active variable
      active = "";
      liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength});getArrayPokemon(${plength},allPokemon);scrollToTop()"><span>${plength}</span></li>`;
    }
    // liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength});getArrayPokemon(${plength},allPokemon)"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages});getArrayPokemon(${totalPages},allPokemon);scrollToTop()"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    });getArrayPokemon(${
      page + 1
    },allPokemon);scrollToTop()"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  containerPagination.innerHTML = liTag; //add li tag inside ul tag
  return liTag; //return the li tag
}

function callFetchStandard(currentPage, allPokemon) {
  let firstPokemon = (currentPage - 1) * 21 + 1;
  if (currentPage == 1) {
    return fetchStandardPokemon(currentPage, 21, allPokemon);
  } else if (currentPage == totalPages) {
    return fetchStandardPokemon(
      firstPokemon,
      totalPokemon - firstPokemon + 1,
      allPokemon
    );
  } else {
    return fetchStandardPokemon(firstPokemon, 21, allPokemon);
  }
}

function fetchStandardPokemon(firstPokemon, quantityPokemon, allPokemon) {
  let arrayPokemon = [];
  for (let i = 0; i < quantityPokemon; i++) {
    arrayPokemon.push(allPokemon[firstPokemon + i - 1]);
  }
  return arrayPokemon;
}

function preRenderCards(arrayPokemon) {
  let i = 0;
  while (i < arrayPokemon.length) {
    const id = arrayPokemon[i].pokemon_species.url.split("/")[6];
    let div = document.createElement("div");
    div.classList.add("itemPokemon", "loading");
    div.id = id;
    container.append(div);
    addSkeleton(div);
    i = i + 1;
  }
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

async function orderPokemon(arrayPokemonData) {
  let arrayPokemon = [];
  for (let i = 0; i < arrayPokemonData.length; i++) {
    let id = arrayPokemonData[i].pokemon_species.url.split("/")[6];
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const itemPokemon = await getDataPokemon(url);
    arrayPokemon.push(itemPokemon);
  }
  return arrayPokemon;
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

function sort(array) {
  array.sort((a, b) => {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1;
    }
  });
  return array;
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

function htmlPokemon(namePokemon, imgPokemon, typePokemon, id, divPokemon) {
  html = `<figure class="imgContainer"><img src="${imgPokemon}" class="imgPokemon" alt="Image of the pokemon ${namePokemon}"></img></figure>
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

function removeSkeleton(divPokemon) {
  divPokemon.classList.remove("loading");
}

function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
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

function clearLastPokemonBatch() {
  container.innerHTML = "";
}

window.addEventListener("load", init());
