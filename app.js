const containerPagination = document.querySelector(".pagination ul");
let page = 1;
let totalPages;
let totalPokemon;
let allPokemon;

const init = async () => {
  //
  const dataPokemon = await fetchAllPokemon();
  totalPokemon = dataPokemon.pokemon_entries.length;
  allPokemon = dataPokemon.pokemon_entries;
  //
  totalPages = Math.ceil(totalPokemon / 21);
  containerPagination.innerHTML = createPagination(totalPages, page);
  const activePage = document.querySelector(".active");
  callFetchStandard(parseInt(activePage.textContent), allPokemon);
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

function createPagination(totalPages, page) {
  let liTag = "";
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) {
    //Show prev button if current page is greater than 1
    liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${
      page - 1
    });fetchStandardPokemon(${
      page - 1
    },allPokemon)"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) {
    //if page value is more than 2 then add first page after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1);callFetchStandard(1,allPokemon)"><span>1</span></li>`;
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
    } else {
      //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength});callFetchStandard(${plength},allPokemon)"><span>${plength}</span></li>`;
  }

  if (page < totalPages - 1) {
    //if page value is less than totalPage value -1 then show the last li or page
    if (page < totalPages - 2) {
      //if page value is less than totalPage value -2 then add this (...) before the last li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages});callFetchStandard(${totalPages},allPokemon)"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    //show the next button if the page value is less than totalPage
    liTag += `<li class="btn next" onclick="createPagination(totalPages, ${
      page + 1
    });callFetchStandard(${
      page + 1
    },allPokemon)"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  containerPagination.innerHTML = liTag; //add li tag inside ul tag
  return liTag; //return the li tag
}

function callFetchStandard(currentPage, allPokemon) {
  let firstPokemon = (currentPage - 1) * 21 + 1;
  if (currentPage == 1) {
    fetchStandardPokemon(currentPage, 21, allPokemon);
  } else if (currentPage == totalPages) {
    fetchStandardPokemon(
      firstPokemon,
      totalPokemon - firstPokemon + 1,
      allPokemon
    );
  } else {
    fetchStandardPokemon(firstPokemon, 21, allPokemon);
  }
}

async function fetchStandardPokemon(firstPokemon, quantityPokemon, allPokemon) {
  let arrayPokemon = [];
  try {
    for (let i = 0; i < quantityPokemon; i++) {
      arrayPokemon.push(allPokemon[firstPokemon + i - 1]);
    }
    console.log(arrayPokemon);
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("load", init());
