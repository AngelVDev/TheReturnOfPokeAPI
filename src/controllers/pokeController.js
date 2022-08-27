const { Pokemon, Type } = require("../db");
const { fetchingData } = require("./service");

const pokeApi = async () => {
  try {
    return await fetchingData();
  } catch (err) {
    console.log(err);
  }
};
pokeApi();
const pokeDB = async () => {
  const service = await Pokemon.findAll({ include: Type });
  return service;
};

const allInfo = async () => {
  const api = await pokeApi();
  const db = await pokeDB();
  const all = api.concat(db);
  return all;
};
module.exports = { allInfo };
