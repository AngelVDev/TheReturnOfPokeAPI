const { Pokemon, Type } = require("../db");
const { fetchingData, byId } = require("./service");

const pokeApi = async () => {
  try {
    return await fetchingData();
  } catch (err) {
    console.log(err);
  }
};
const pokeDB = async () => {
  const service = await Pokemon.findAll({
    include: {
      model: Type,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
  return service;
};

const allInfo = async () => {
  const api = await pokeApi();
  const db = await pokeDB();
  const all = api.sort(byId).concat(db);
  return all;
};
module.exports = { allInfo };
