const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://us-central1-escuelajs-api.cloudfunctions.net/characters";
let count = 0;

const initialData = () => {
  count = 0;
  localStorage.clear();
  intersectionObserver.observe($observe);
};

const buildElement = (tag, name, data) => {
  let newItem = document.createElement(tag);
  tag === "a" ? (newItem.href = name) : newItem.classList.add(name);
  newItem.innerHTML = data;
  $app.appendChild(newItem);
};

const endData = () => {
  intersectionObserver.unobserve($observe);

  buildElement("p", "Message", "Ya no hay más personajes...");
  buildElement("a", "#init", "Volver al inicio");
};

const getData = async api => {
  try {
    const response = await fetch(api);
    const data = await response.json();

    localStorage.setItem("next_fetch", data.info.next || "end");

    const characters = data.results;
    let output = characters
      .map(character => {
        return `
            <article class="Card">
              <img src="${character.image}" 
              onerror="this.src='image-default.png'" alt="image"
              />
              <h2>(${++count}) ${character.name}
                <span>${character.species}</span>
              </h2>
            </article>
            `;
      })
      .join("");

    buildElement("section", "Items", output);
  } catch (error) {
    console.log("Error: ", error);
  }
};

const loadData = () => {
  let url_next = localStorage.getItem("next_fetch");

  if (url_next === "end") return endData();

  getData(url_next || API);
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

window.onload = initialData();
