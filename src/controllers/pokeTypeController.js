const axios = require("axios");
const { Pokemon, Type } = require("../db");

const typeApi = async () => {
  const urlApi = await axios.get("https://pokeapi.co/api/v2/type");
  const apiResults = urlApi.data.results;
  const typeData = [];

  for (let i = 0; i < apiResults.length; i++) {
    const secGet = await axios.get(apiResults[i].url);
    const typen = secGet.data;
    typeData.push({
      id: typen.id,
      name: typen.name,
    });
  }
  return typeData;
};
module.exports = { typeApi };
