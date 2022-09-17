const axios = require("axios");
function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
function byId(a, b) {
  if (a.id > b.id) {
    return 1;
  }
  if (b.id > a.id) {
    return -1;
  }
  return 0;
}
const fetchingData = async () => {
  const pokeData = [];
  const pokeEndpoint = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );
  const results = pokeEndpoint.data.results;

  for (let i = 0; i < results.length; i++) {
    let secondaryGet = await axios.get(results[i].url);
    let poke = await secondaryGet.data;
    pokeData.push(await poke);
  }

  const pokeMap = pokeData.map((poke) => ({
    id: poke.id,
    name: capitalize(poke.name),
    types: poke.types
      .map((t) => {
        return { name: t.type.name };
      })
      .filter(Boolean),
    image: poke.sprites.other["official-artwork"].front_default,
    HP: poke.stats[0].base_stat,
    attack: poke.stats[1].base_stat,
    defense: poke.stats[2].base_stat,
    speed: poke.stats[5].base_stat,
    weight: poke.weight,
    height: poke.height,
  }));

  return pokeMap;
};

module.exports = { fetchingData, byId };
