const { Router } = require("express");
const { allInfo } = require("../controllers/pokeController.js");
const { Pokemon, Type } = require("../db");
const router = Router();

router.get("/pokemons", async (req, res) => {
  try {
    const { name } = req.query;
    const info = await allInfo();
    console.log("This is name", name);
    if (name) {
      const pokeName = info.filter((el) =>
        el.name.toLowerCase().includes(name.toLowerCase())
      );
      pokeName
        ? res.status(200).json(pokeName)
        : res.status(404).json("NOT FOUND");
    } else {
      res.status(200).json(info);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.get("/pokemons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const info = await allInfo();
    if (id > 40) {
      const pokeInDB = await Pokemon.findOne({ where: { id }, include: Type });
      !pokeInDB
        ? res.status(404).send("Not valid ID")
        : res.status(200).json(pokeInDB);
    } else {
      const pokeId = info.find((element) => `${element.id}` === id);
      pokeId ? res.status(200).json(pokeId) : res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.post("/pokemons", async (req, res) => {
  const { name, HP, attack, defense, speed, height, weight, types } = req.body;
  try {
    const pokeNew = await Pokemon.create({
      name,
      HP,
      attack,
      height,
      weight,
      defense,
      speed,
    });
    const typeDb = await Type.findAll({ where: { name: types } });
    await pokeNew.addType(typeDb);
    console.log(typeDb);
    res.status(201).json(pokeNew);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.get("/:id/delete", async (req, res) => {
  try {
    await Pokemon.destroy({
      where: { id: req.params.id },
    });
    return res.status(204).json({ msg: "Poke-destroyed" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
module.exports = router;
