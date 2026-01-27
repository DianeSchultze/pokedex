const pokemons = [
    {
        dex: "001",
        name: "Bulbasaur",
        type: ["Grass"],
        gen: 1,
        img: "assets/sprites/bulbasaur.png",
        alt: "Bulbasaur sprite from Pokemon Black and White",
        desc: "Bulbasaur is a small, mainly turquoise amphibian Pokemon with red eyes and a green bulb on its back."

    },
    {
        dex: "002",
        name: "Ivysaur",
        type: ["Grass"],
        gen: 1,
        img: "assets/sprites/ivysaur.png",
        alt: "Ivysaur sprite from Pokemon Black and White",
        desc: "Ivysaur is a Grass/Poison type Pokemon introduced in Generation 1.",
    },
    {
        dex: "003",
        name: "Venusaur",
        type: ["Grass"],
        gen: 1,
        img: "assets/sprites/venusaur.png",
        alt: "Venusaur sprite from Pokemon Black and White",
        desc: "Venusaur is a large, quadrupedal Pokemon with a turquoise body."
    },
    {
        dex: "004",
        name: "Charmander",
        type: ["Fire"],
        gen: 1,
        img: "assets/sprites/charmander.png",
        alt: "Charmander sprite from Pokemon Black and White",
        desc: "Charmander is a bipedal, reptilian Pokemon."
    },
    {
        dex: "005",
        name: "Charmeleon",
        type: ["Fire"],
        gen: 1,
        img: "assets/sprites/charmeleon.png",
        alt: "Charmeleon sprite from Pokemon Black and White",
        desc: "Charmeleon is a Fire type Pokemon introduced in Generation 1."    
    },
    {
        dex: "006",
        name: "Charizard",
        type: ["Fire"],
        gen: 1,
        img: "assets/sprites/charizard.png",
        alt: "Charizard sprite from Pokemon Black and White",
        desc: "Charizard is a large dragon-like Pokemon, mainly orange in color."
    },
    {
        dex: "007",
        name: "Squirtle",
        type: ["Water"],
        gen: 1,
        img: "assets/sprites/squirtle.png",
        alt: "Squirtle sprite from Pokemon Black and White",
        desc: "Squirtle is a bipedal, reptilian Pokemon."
    },
    {
        dex: "008",
        name: "Wartortle",
        type: ["Water"],
        gen: 1,
        img: "assets/sprites/wartortle.png",
        alt: "Wartortle sprite from Pokemon Black and White",
        desc: "Wartortle is a Water type Pokemon introduced in Generation 1."
    },
    {
        dex: "009",
        name: "Blastoise",
        type: ["Water"],
        gen: 1,
        img: "assets/sprites/blastoise.png",
        alt: "Blastoise sprite from Pokemon Black and White",
        desc: "Blastoise is a large, bipedal, reptilian Pokemon."
    },
    {
        dex: "025",
        name: "Pikachu",
        type: ["Electric"],
        gen: 1,
        img: "assets/sprites/pikachu.png",
        alt: "Pikachu sprite from Pokemon Black and White",
        desc: "Pikachu is an Electric type Pokemon introduced in Generation 1."
    },
    {
        dex: "026",
        name: "Raichu",
        type: ["Electric"],
        gen: 1,
        img: "assets/sprites/raichu.png",
        alt: "Raichu sprite from Pokemon Black and White",
        desc: "Raichu is an Electric type Pokemon introduced in Generation 1."
    },
    {
        dex: "172",
        name: "Pichu",
        type: ["Electric"],
        gen: 2,
        img: "assets/sprites/pichu.png",
        alt: "Pichu sprite from Pokemon Black and White",
        desc: "Pichu is an Electric type Pokemon introduced in Generation 2."
    },
    {
        dex: "155",
        name: "Cyndaquil",
        type: ["Fire"],
        gen: 2,
        img: "assets/sprites/cyndaquil.png",
        alt: "Cyndaquil sprite from Pokemon Black and White",
        desc: "Cyndaquil is a small, quadrupedal Pokemon with a blue body and a fiery back."
    },
    {
        dex: "152",
        name: "Chikorita",
        type: ["Grass"],
        gen: 2,
        img: "assets/sprites/chikorita.png",
        alt: "Chikorita sprite from Pokemon Black and White",
        desc: "Chikorita is a small, quadrupedal Pokemon with a green body and a large leaf on its head."
    },
    {
        dex: "230",
        name: "Kingdra",
        type: ["Water"],
        gen: 2,
        img: "assets/sprites/kingdra.png",
        alt: "Kingdra sprite from Diamond and Pearl",
        desc: "Kingdra is a Water/Dragon type Pokemon introduced in Generation 2."
    },
    {
        dex: "194",
        name: "Wooper",
        type: ["Water"],
        gen: 2,
        img: "assets/sprites/wooper.png",
        alt: "Wooper sprite from Pokemon Black and White",
        desc: "Wooper is a small, blue, amphibious Pokemon with a cheerful disposition."
    },
    {
        dex: "131",
        name: "Lapras",
        type: ["Water"],
        gen: 1,
        img: "assets/sprites/lapras.png",
        alt: "Lapras sprite from Pokemon Black and White",
        desc: "Lapras is a large, plesiosaur-like Pokemon known for its gentle nature and ability to ferry people across bodies of water."
    }
];

// Sort pokemons by pokedex number automatically
pokemons.sort((a, b) => a.dex - b.dex);


var type = "All";
var gen = "All";


function render() {
  pokemonGrid.innerHTML = ""

  pokemons.forEach(function(pokemon) {
    const matchType = type === "All" || pokemon.type.includes(type) 
    const matchGen = gen === "All" || pokemon.gen.toString() === gen // gen is a string from the select dropdown

    if (matchType && matchGen) { // if both filters match
      const card = document.createElement("article");
        card.innerHTML = `
        <figure>
            <img src="${pokemon.img}" alt="${pokemon.alt}">
          <figcaption>
            <h3>${pokemon.name}</h3>
            <span>#${pokemon.dex}</span>
            <span class="typeBadge" data-type="${pokemon.type[0]}">${pokemon.type[0]}</span>
            <p>${pokemon.desc}</p>
          </figcaption>
        </figure> 
      `;
      pokemonGrid.appendChild(card);
    }
  });
};


filterGen.addEventListener("change", function() {
  gen = this.value; // value from the select dropdown
  render();
});

var typesBtns = document.querySelectorAll(".typeBtn");

typesBtns.forEach(function(button) { // add event listener to each type button
  button.addEventListener("click", function() {
    type = this.dataset.type
    typesBtns.forEach(function(x) {
      x.classList.remove("active")
    })
    this.classList.add("active")
    render();
  })
})


resetBtn.addEventListener("click", function() {
  type = "All";
  gen = "All"; 
  filterGen.value = "All";
  typesBtns.forEach(function(button) {
    button.classList.toggle("active", button.dataset.type === "All");
  });
  render();
});
render();

// button click sound effect
const clickSound = new Audio("assets/sounds/button-click.mp3");

document.querySelectorAll("button, select").forEach(button => {
  button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.volume = 0.4; // set volume to 40%
    clickSound.play(); 
  });
});

