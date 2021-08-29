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
let allPokemonOrdered;
let initial;
let lastOrder;

const init = async () => {
  initial = true;
  const dataPokemon = await fetchAllPokemon();
  totalPokemon = dataPokemon.pokemon_entries.length;
  allPokemon = dataPokemon.pokemon_entries;
  allPokemonOrdered = allPokemon.map((item) => item);
  totalPages = Math.ceil(totalPokemon / 21);
  containerPagination.innerHTML = createPagination(totalPages, page);
  const activePage = document.querySelector(".active");
  let sortOrder = document.querySelector(".custom-select-options .selected")
    .dataset.value;
  getArrayPokemon(
    parseInt(activePage.textContent),
    allPokemonOrdered,
    sortOrder
  );
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

async function getArrayPokemon(currentPage, allPokemonList, sortOrder) {
  //
  allPokemonOrdered = await sortPokemonBy(sortOrder, allPokemonList);
  //
  const arrayPokemon = callFetchStandard(currentPage, allPokemonOrdered);

  if (initial == false) {
    clearLastPokemonBatch();
  }
  initial = false;
  preRenderCards(arrayPokemon);
  const listPokemon = await orderPokemon(arrayPokemon);
  const sortedPokemon = sortPokemon(listPokemon);
  // const sortedPokemon = sort(listPokemon);
  console.log(sortedPokemon);
  populatePokemon(sortedPokemon);
}

function sortPokemonBy(sortOrder, allPokemonList) {
  // let allPokemonOrdered = allPokemon.map((item) => item);
  if (sortOrder == "lowestFirst") {
    lastOrder = "lowestFirst";
    createPagination(totalPages, 1);
    return allPokemonList;
  }
  if (sortOrder == "highestFirst") {
    lastOrder = "highestFirst";
    createPagination(totalPages, 1);
    let allPokemonOrdered = allPokemon.map((item) => item);
    return allPokemonOrdered.reverse();
  }
  if (sortOrder == "alphabetAZ") {
    lastOrder = "alphabetAZ";
    createPagination(totalPages, 1);
    let allPokemonOrdered = allPokemon.map((item) => item);
    allPokemonOrdered = sortByName(allPokemonOrdered);
    return allPokemonOrdered;
  }
  if (sortOrder == "alphabetZA") {
    lastOrder = "alphabetZA";
    createPagination(totalPages, 1);
    let allPokemonOrdered = allPokemon.map((item) => item);
    allPokemonOrdered = sortByName(allPokemonOrdered);
    return allPokemonOrdered.reverse();
  }
  if (sortOrder == undefined) {
    return allPokemonList;
  }
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
    },allPokemonOrdered);scrollToTop()"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) {
    //if page value is more than 2 then add first page after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1);getArrayPokemon(1,allPokemonOrdered);scrollToTop()"><span>1</span></li>`;
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
      liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength});getArrayPokemon(${plength},allPokemonOrdered);scrollToTop()"><span>${plength}</span></li>`;
    }
    // liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength});getArrayPokemon(${plength},allPokemon)"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages});getArrayPokemon(${totalPages},allPokemonOrdered);scrollToTop()"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    });getArrayPokemon(${
      page + 1
    },allPokemonOrdered);scrollToTop()"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  containerPagination.innerHTML = liTag; //add li tag inside ul tag
  return liTag; //return the li tag
}

function callFetchStandard(currentPage, allPokemonOrdered) {
  let firstPokemon = (currentPage - 1) * 21 + 1;
  if (currentPage == 1) {
    return fetchStandardPokemon(currentPage, 21, allPokemonOrdered);
  } else if (currentPage == totalPages) {
    return fetchStandardPokemon(
      firstPokemon,
      totalPokemon - firstPokemon + 1,
      allPokemonOrdered
    );
  } else {
    return fetchStandardPokemon(firstPokemon, 21, allPokemonOrdered);
  }
}

function fetchStandardPokemon(
  firstPokemon,
  quantityPokemon,
  allPokemonOrdered
) {
  let arrayPokemon = [];
  for (let i = 0; i < quantityPokemon; i++) {
    arrayPokemon.push(allPokemonOrdered[firstPokemon + i - 1]);
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

function sortPokemon(listPokemon) {
  if (lastOrder == "lowestFirst") {
    return sort(listPokemon);
  }
  if (lastOrder == "highestFirst") {
    return sort(listPokemon).reverse();
  }
  if (lastOrder == "alphabetAZ") {
    return sortListByName(listPokemon);
  }
  if (lastOrder == "alphabetZA") {
    return sortListByName(listPokemon).reverse();
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

function sortByName(array) {
  array.sort((a, b) =>
    a.pokemon_species.name.localeCompare(b.pokemon_species.name)
  );
  return array;
}
function sortListByName(array) {
  array.sort((a, b) => a.name.localeCompare(b.name));
  return array;
}
// function reverseSort(array) {
//   array.sort((a, b) => {
//     if (a.id < b.id) {
//       return 1;
//     } else {
//       return -1;
//     }
//   });
//   return array;
// }

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
//
const selectElements = document.querySelectorAll("[data-custom]");

class Select {
  constructor(element) {
    this.element = element;
    this.options = getFormattedOptions(element.querySelectorAll("option"));
    this.customElement = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.optionsCustomElement = document.createElement("ul");
    setupCustomElement(this);
    element.style.display = "none";
    element.after(this.customElement);
  }

  get selectedOption() {
    return this.options.find((option) => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  selectValue(value) {
    const newSelectedOption = this.options.find((option) => {
      return option.value === value;
    });
    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.labelElement.innerText = newSelectedOption.label;
    this.optionsCustomElement
      .querySelector(`[data-value="${prevSelectedOption.value}"]`)
      .classList.remove("selected");
    const newCustomElement = this.optionsCustomElement.querySelector(
      `[data-value="${newSelectedOption.value}"]`
    );
    newCustomElement.classList.add("selected");
    // console.log(newCustomElement.dataset.value);
    //
    getArrayPokemon((page = 1), allPokemon, newCustomElement.dataset.value);
    //
    newCustomElement.scrollIntoView({ block: "nearest" });
  }
}
selectElements.forEach((selectElement) => {
  new Select(selectElement);
});
function setupCustomElement(select) {
  select.customElement.classList.add("custom-select-container");
  select.customElement.tabIndex = 0;

  select.labelElement.classList.add("custom-select-value");
  select.labelElement.innerText = select.selectedOption.label;
  select.customElement.append(select.labelElement);

  select.optionsCustomElement.classList.add("custom-select-options");
  select.options.forEach((option) => {
    const optionElement = document.createElement("li");
    optionElement.classList.add("custom-select-option");
    optionElement.classList.toggle("selected", option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;
    optionElement.addEventListener("click", () => {
      select.selectValue(option.value);
      select.optionsCustomElement.classList.remove("show");
    });
    select.optionsCustomElement.append(optionElement);
  });
  select.customElement.append(select.optionsCustomElement);

  select.labelElement.addEventListener("click", () => {
    select.optionsCustomElement.classList.toggle("show");
  });

  select.customElement.addEventListener("blur", () => {
    select.optionsCustomElement.classList.remove("show");
  });

  select.customElement.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Space":
        select.optionsCustomElement.classList.toggle("show");
        break;
      case "ArrowUp": {
        const prevOption = select.options[select.selectedOptionIndex - 1];
        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;
      }
      case "ArrowDown": {
        const nextOption = select.options[select.selectedOptionIndex + 1];
        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;
      }
      case "Enter":
      case "Escape":
        select.optionsCustomElement.classList.remove("show");
        break;
    }
  });
}

function getFormattedOptions(optionElements) {
  return [...optionElements].map((optionElement) => {
    return {
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement,
    };
  });
}

//
window.addEventListener("load", init());
