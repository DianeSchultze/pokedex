const pokemonGrid = document.querySelector("#pokemonGrid");
const filterGen = document.querySelector("#filterGen");
const resetBtn = document.querySelector("#resetBtn");
const typeFilters = document.querySelector("#typeFilters");
const statusText = document.querySelector("#statusText");
const searchInput = document.querySelector("#searchInput");

const pokemonModal = document.querySelector("#pokemonModal");
const modalBody = document.querySelector("#modalBody");
const modalOverlay = document.querySelector("#modalOverlay");
const closeModalBtn = document.querySelector("#closeModalBtn");

const clickSound = new Audio("assets/sounds/button-click.mp3");

modalBody.addEventListener("click", (e) => {
  e.stopPropagation();
});

function playClickSound() {
  clickSound.pause();
  clickSound.currentTime = 0;
  clickSound.volume = 0.4;
  clickSound.play().catch(() => {});
}

const allTypes = [
  "All",
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy"
];

const generationRanges = {
  1: { start: 1, end: 151 },
  2: { start: 152, end: 251 },
  3: { start: 252, end: 386 },
  4: { start: 387, end: 493 },
  5: { start: 494, end: 649 },
  6: { start: 650, end: 721 },
  7: { start: 722, end: 809 },
  8: { start: 810, end: 905 },
  9: { start: 906, end: 1025 }
};

let allPokemon = [];
let currentType = "All";
let currentGen = "All";
let searchTerm = "";

function formatName(text) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sanitizeFlavorText(text) {
  return text
    .replace(/\f/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createBadges(types) {
  return types
    .map(
      (type) =>
        `<span class="typeBadge" data-type="${type}">${formatName(type)}</span>`
    )
    .join("");
}

function updateActiveType() {
  document.querySelectorAll(".typeBtn").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === currentType);
  });
}

function createTypeButtons() {
  typeFilters.innerHTML = "";

  allTypes.forEach((type) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "typeBtn";
    btn.dataset.type = type;
    btn.textContent = type === "All" ? "All" : formatName(type);

    if (type === currentType) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      playClickSound();
      currentType = type;
      updateActiveType();
      renderPokemon();
    });

    typeFilters.appendChild(btn);
  });
}

function createCard(pokemon) {
  const el = document.createElement("article");
  el.className = "pokemonCard";
  el.tabIndex = 0;

  el.innerHTML = `
    <img src="${pokemon.img}" alt="${pokemon.name}">
    <h3>${pokemon.name}</h3>
    <span class="dexNumber">#${String(pokemon.dex).padStart(4, "0")}</span>
    <div class="typeList">${createBadges(pokemon.types)}</div>
    <p>${pokemon.shortDesc}</p>
  `;

  el.addEventListener("click", () => {
    playClickSound();
    openModal(pokemon);
  });

  el.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playClickSound();
      openModal(pokemon);
    }
  });

  return el;
}

function renderPokemon() {
  pokemonGrid.innerHTML = "";

  const filtered = allPokemon.filter((pokemon) => {
    const matchType =
      currentType === "All" || pokemon.types.includes(currentType);

    const matchSearch =
      searchTerm === "" ||
      pokemon.name.toLowerCase().includes(searchTerm) ||
      String(pokemon.dex).includes(searchTerm);

    return matchType && matchSearch;
  });

  statusText.textContent =
    filtered.length === 0
      ? "No Pokémon found"
      : `${filtered.length} Pokémon`;

  filtered.forEach((pokemon) => {
    pokemonGrid.appendChild(createCard(pokemon));
  });
}

async function fetchPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon ${id}`);
  }

  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  if (!speciesRes.ok) {
    throw new Error(`Failed to fetch species ${id}`);
  }

  const species = await speciesRes.json();

  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );

  return {
    dex: data.id,
    name: formatName(data.name),
    gen: Object.keys(generationRanges).find((gen) => {
      const range = generationRanges[gen];
      return data.id >= range.start && data.id <= range.end;
    }),
    types: data.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name),
    img:
      data.sprites.other["official-artwork"].front_default ||
      data.sprites.front_default ||
      "",
    shortDesc: sanitizeFlavorText(entry?.flavor_text || "No description available."),
    fullDesc: sanitizeFlavorText(entry?.flavor_text || "No description available."),
    height: data.height / 10,
    weight: data.weight / 10,
    baseExperience: data.base_experience ?? "Unknown",
    abilities: data.abilities.map((a) => formatName(a.ability.name)),
    stats: data.stats.map((s) => ({
      name: formatName(s.stat.name),
      value: s.base_stat
    }))
  };
}

async function loadPokemonByGen(gen) {
  try {
    statusText.textContent = "Loading Pokémon...";
    pokemonGrid.innerHTML = "";

    let ids = [];

    if (gen === "All") {
      ids = Array.from({ length: 1025 }, (_, i) => i + 1);
    } else {
      const range = generationRanges[gen];
      ids = Array.from(
        { length: range.end - range.start + 1 },
        (_, i) => range.start + i
      );
    }

    const results = [];
    const batchSize = 25;

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(fetchPokemon));
      results.push(...batchResults);
      statusText.textContent = `Loading Pokémon... ${results.length}/${ids.length}`;
    }

    allPokemon = results;
    renderPokemon();
  } catch (error) {
    console.error(error);
    statusText.textContent = "Failed to load Pokémon.";
  }
}

function openModal(pokemon) {
  modalBody.innerHTML = `
    <div class="modalTop">
      <div class="modalImageWrap">
        <img src="${pokemon.img}" alt="${pokemon.name}" loading="lazy">
      </div>

      <div class="modalInfo">
        <h2>${pokemon.name} #${String(pokemon.dex).padStart(4, "0")}</h2>

        <div class="typeList">
          ${createBadges(pokemon.types)}
        </div>

        <p>${pokemon.fullDesc}</p>

        <div class="infoGrid">
          <div class="infoCard">
            <strong>Generation</strong>
            <span>Gen ${pokemon.gen}</span>
          </div>

          <div class="infoCard">
            <strong>Height</strong>
            <span>${pokemon.height} m</span>
          </div>

          <div class="infoCard">
            <strong>Weight</strong>
            <span>${pokemon.weight} kg</span>
          </div>

          <div class="infoCard">
            <strong>Base Exp</strong>
            <span>${pokemon.baseExperience}</span>
          </div>

          <div class="infoCard" style="grid-column: 1 / -1;">
            <strong>Abilities</strong>
            <span>${pokemon.abilities.join(", ")}</span>
          </div>
        </div>

        <section class="statsSection">
          <h3>Stats</h3>
          <div class="statsList">
            ${pokemon.stats
              .map((stat) => {
                const width = Math.min((stat.value / 255) * 100, 100);
                return `
                  <div class="statRow">
                    <span class="statName">${stat.name}</span>
                    <div class="statBar">
                      <div class="statBarFill" style="width:${width}%"></div>
                    </div>
                    <span class="statValue">${stat.value}</span>
                  </div>
                `;
              })
              .join("")}
          </div>
        </section>
      </div>
    </div>
  `;
  

  pokemonModal.classList.remove("hidden");
  pokemonModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

}

function closeModal() {
  pokemonModal.classList.add("hidden");
  pokemonModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

filterGen.addEventListener("change", (event) => {
  playClickSound();
  currentGen = event.target.value;
  loadPokemonByGen(currentGen);
});

searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.toLowerCase().trim();
  renderPokemon();
});

resetBtn.addEventListener("click", () => {
  playClickSound();
  currentType = "All";
  currentGen = "All";
  searchTerm = "";

  filterGen.value = "All";
  searchInput.value = "";

  updateActiveType();
  loadPokemonByGen("All");
});

modalOverlay.addEventListener("click", () => {
  playClickSound();
  closeModal();
});

closeModalBtn.addEventListener("click", () => {
  playClickSound();
  closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !pokemonModal.classList.contains("hidden")) {
    playClickSound();
    closeModal();
  }
});

createTypeButtons();
loadPokemonByGen("All");