// const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=21&offset=0";
let prevUrl = "";
let nextUrl = "";

const btnNext = document.getElementById("btnNext");
const btnPrevious = document.getElementById("btnPrev");

const container = document.querySelector("#container");

let isLastItem = false;

const init = async () => {
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

function populatePokemon(namePokemon, imgPokemon) {
  let div = document.createElement("div");
  div.classList.add("itemPokemon");
  html = `<img src="${imgPokemon}" class="imgPokemon" alt="Imagem do pokemon ${namePokemon}"></img>
  <h3>${titleCase(namePokemon)}</h3>`;
  container.append(div);
  div.innerHTML = html;
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
    const namePokemon = itemApi.name;
    populatePokemon(namePokemon, imgPokemon);
  } catch (error) {
    console.log(error);
  }
}

function getPokemon(data) {
  const { results } = data;
  const listPokemon = results.map(async (item, index) => {
    const { url } = item;
    if (url.length < 40) {
      let { next: nextUrl } = data;
      let { previous: prevUrl } = data;
      setPrevNext(prevUrl, nextUrl);
      await getDataPokemon(url);
      if (results.length == index + 1) {
        btnNext.removeAttribute("disabled");
        btnPrevious.removeAttribute("disabled");
      }
    } else {
      let nextUrl = "";
      let { previous: prevUrl } = data;
      setPrevNext(prevUrl, nextUrl);
    }
    if (data.previous == null) {
      btnPrevious.setAttribute("disabled", "disabled");
    }
  });
}
function clearLastPokemonBatch() {
  container.innerHTML = "";
}

const nextPage = () => {
  if (nextUrl) {
    btnNext.setAttribute("disabled", "disabled");
    document.documentElement.scrollTop = 0;
    clearLastPokemonBatch();
    fetchPokemon(nextUrl);
    btnNext;
  } else {
    return;
  }
};
const previousPage = () => {
  if (prevUrl) {
    btnPrevious.setAttribute("disabled", "disabled");
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

window.addEventListener("load", init());
