const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
let prevUrl = "";
let nextUrl = "";

const btnNext = document.getElementById("btnNext");
const btnPrevious = document.getElementById("btnPrev");

const container = document.querySelector("#container");

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
  html = `<img src="${imgPokemon}" class="imgPokemon"></img>
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
  console.log(results);
  const listPokemon = results.map((item) => {
    const { url } = item;
    if (url.length < 40) {
      let { next: nextUrl } = data;
      let { previous: prevUrl } = data;
      setPrevNext(prevUrl, nextUrl);
      getDataPokemon(url);
    }
  });
}
function clearLastPokemonBatch() {
  container.innerHTML = "";
}

const nextPage = () => {
  console.log(nextUrl);
  if (nextUrl) {
    clearLastPokemonBatch();
    fetchPokemon(nextUrl);
  } else {
    return;
  }
};
const previousPage = () => {
  console.log(prevUrl);
  if (prevUrl) {
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
