const cardContainer = document.getElementById("cardcontainer");
const apiUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";
let lastPokemon = 0
let search = false

function makeCard(id, cardImg, pokemon, types) 
{
    document.body.style.overflow = "scroll"
    const cardEl = document.createElement('div');
    cardEl.classList.add('card');
    id = (id + 1).toString();
    let finalId = "";

    for(let i = 0; i < (4 - id.length); i++)
    {
        finalId += "0";
    }
    finalId += id

    cardEl.innerHTML = `
        <div class="image-container">
            <img class="card-image" src=${cardImg}>
        </div>
        <p class="number"><img class="pokeball" src="favicon.svg" style="height: 0.8rem"> #${finalId}</p>
            <div class="card-info">
            <h3 class="poke-name">${pokemon}</p>
            <div class="poke-types">
                ${formatTypes(types)}
            </div>
        </div>
    `;
    cardContainer.appendChild(cardEl);;

}

function clearCards()
{
    lastPokemon = 0
    cardContainer.innerHTML = ""
    document.body.style.overflow = "hidden"
}

async function formatData() {
    try {
        pokemen = await fetchData();
        let pokemonList = [];

        for (let i = 0; i < pokemen.length; i++) {
            pokedata = await fetchPokemon(pokemen[i].url);
            let pokename = capitalize(pokemen[i].name);
            let sprite = pokedata.sprites.other.dream_world.front_default;
            let types = pokedata.types.map(t => t.type.name);
            pokemonList.push({ id: i, name: pokename, sprite, types });
        }

        clearCards();

        const sortOrder = document.getElementById('sort-order').value;
        const searchCriteria = document.getElementById('search-criteria').value;

        pokemonList.sort((a, b) => {
            if (searchCriteria === 'id') {
                return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
            } else if (searchCriteria === 'name') {
                return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else if (searchCriteria === 'type') {
                return sortOrder === 'asc' ? a.types[0].localeCompare(b.types[0]) : b.types[0].localeCompare(a.types[0]);
            }
        });

        for (let pokemon of pokemonList) {
            if (testPokemon(pokemon.id, pokemon.name, pokemon.types)) {
                makeCard(pokemon.id, pokemon.sprite, pokemon.name, pokemon.types);
            }
        }
        document.getElementById("loadspinner").classList.add("invisible")

    } catch(error) {
        console.error("Error in data formatting: ", error);
    }
}

function testPokemon(id, name, types) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchCriteria = document.getElementById('search-criteria').value;
    
    if (searchTerm === '') return true;
    if ((id + 1).toString().includes(searchTerm)) return true;
    if (name.toLowerCase().includes(searchTerm)) return true;
    if (types.some(type => type.toLowerCase().includes(searchTerm))) return true;
    
    return false;
}

function capitalize(str)
{
    str = str[0].toUpperCase().concat(str.slice(1,(str.length)));
    return str
}

async function fetchData()
{
    try
    {
        const response = await fetch(apiUrl);
        if (!response.ok)
        {
            throw new Error("Network response was not ok")
        }
        const data = await response.json();
        return data.results;
    } catch(error)
    {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
}

async function fetchPokemon(url)
{
    document.getElementById("loadspinner").classList.remove("invisible")
    try
    {
        const response = await fetch(url);
        if (!response.ok)
        {
            throw new Error("Network response was not ok")
        }
        const pokedata = await response.json();
        return pokedata;
    } catch(error)
    {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
}

function formatTypes(types)
{
    divs = ""
    for(let i = 0; i < types.length; i++)
    {
        let type = types[i];
        divs += `<div class="typediv ${type}">${capitalize(type)}</div>`
        
    }
    return divs
}


formatData()
document.getElementById('search-input').addEventListener('input', debounce(formatData, 100));
document.getElementById('search-criteria').addEventListener('change', formatData);
document.getElementById('sort-order').addEventListener('change', formatData);

function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}