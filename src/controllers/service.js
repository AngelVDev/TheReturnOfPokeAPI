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
  const pokeEndpoint = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
  const fetchPokeUrlFromEndpoint = await pokeEndpoint.data;
  const fetchPokeUrlFromEndpoint2 = await axios.get(
    `${fetchPokeUrlFromEndpoint.next}`
  );
  const pokesUrl = await fetchPokeUrlFromEndpoint.results.map((el) => el.url);
  const pokesUrl2 = await fetchPokeUrlFromEndpoint2.data.results.map(
    (el) => el.url
  );
  for (let i = 0; i < 20; i++) {
    pokeData.push(axios.get(pokesUrl[i]), axios.get(pokesUrl2[i]));
  }
  const allPk = Promise.all(pokeData).then((pk) => {
    let pokeArray = pk.map((poke) => {
      return {
        id: poke.data.id,
        name: capitalize(poke.data.name),
        types: poke.data.types
          .map((t) => {
            return { name: t.type.name };
          })
          .filter(Boolean),
        image: poke.data.sprites.other["official-artwork"].front_default,
        HP: poke.data.stats[0].base_stat,
        attack: poke.data.stats[1].base_stat,
        defense: poke.data.stats[2].base_stat,
        speed: poke.data.stats[5].base_stat,
        weight: poke.data.weight,
        height: poke.data.height,
      };
    });
    return pokeArray;
  });
  return await allPk;
};

module.exports = { fetchingData, byId };
