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

function logTest(test) {
  console.log(test);
}

async function getDataPokemon(item, listPokemon) {
  try {
    const response = await fetch(item);
    const itemApi = await response.json();
    const sprites = itemApi.sprites;
    const { front_default: imgPokemon } = sprites;
    const namePokemon = itemApi.name;
    // logTest(namePokemon);
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
      // console.log(item);
      let { next: nextUrl } = data;
      let { previous: prevUrl } = data;
      setPrevNext(prevUrl, nextUrl);
      getDataPokemon(url);
    }
  });

  //   container.innerHTML = list.join("");
}

// function populatePokemon(data) {
//   const { results } = data;

//   const list = results.map((item) => {
//     let { url: urlString } = item;

//     if (urlString.length < 40) {
//       let { next: nextUrl } = data;
//       let { previous: prevUrl } = data;
//       setPrevNext(prevUrl, nextUrl);

//       let getImgPokemon = () => {
//         return fetch(urlString)
//           .then((res) => res.json())
//           .then((singlePokemon) => singlePokemon.sprites)
//           .then((spritePokemon) => {
//             ({ front_default: getImgPokemon } = spritePokemon);
//             return getImgPokemon;
//           })
//           .then((getImgPokemon) => {
//             // console.log(imgPokemon);
//             return getImgPokemon;
//           });
//       };
//       // imgPokemon();
//       console.log(getImgPokemon());
//       const img = getImgPokemon();
//       return `<div class="singlePokemon">
//       <h3>${item.name}</h3>
//       <img src="${img}"></img>
//       </div>`;
//       // return `<div class="singlePokemon">
//       // <h3>${item.name}</h3>
//       // <img src="${img}"></img>
//       // </div>`;
//     } else {
//       let nextUrl = "";
//       let { previous: prevUrl } = data;
//       setPrevNext(prevUrl, nextUrl);
//     }
//   });
//   console.log();
//   // const list = results.map((item) => `<h3>${item.name}</h3>`);
//   container.innerHTML = list.join("");
// }

const nextPage = () => {
  console.log(nextUrl);
  if (nextUrl) {
    fetchPokemon(nextUrl);
  } else {
    return;
  }
};
const previousPage = () => {
  console.log(prevUrl);
  if (prevUrl) {
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
