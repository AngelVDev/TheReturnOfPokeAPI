const { default: axios } = require("axios");
const { Router } = require("express");
const { allInfo, pokeDB } = require("../controllers/pokeController.js");
const { Pokemon, Type } = require("../db");
const router = Router();

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

router.get("/pokemons", async (req, res) => {
  const { name } = req.query;
  const info = await allInfo();
  try {
    if (name) {
      const pokeName = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      );
      const pokeInDB = await Pokemon.findAll({
        where: { name },
        include: Type,
        through: { attributes: [] },
      });
      const pokeUnified = [pokeName.data].concat(pokeInDB);
      const pokeMapped = pokeUnified.map((poke) => {
        return {
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
        };
      });

      pokeMapped.length
        ? res.status(200).send(pokeMapped)
        : res.status(404).send("POKE NOT FOUND");
    } else {
      res.status(200).json(info);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log("ERROR IN QUERY", error);
  }
});
router.get("/pokemons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const info = await allInfo();
    const regex = new RegExp("[a-z]");
    if (regex.test(id) === true) {
      const pokeInDB = await Pokemon.findOne({
        where: { id },
        include: Type,
        through: { attributes: [] },
      });
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
  const { name, HP, attack, defense, speed, height, weight, types, image } =
    req.body;
  try {
    if (name && HP && defense && speed && height && weight && types) {
      const pokeNew = await Pokemon.create({
        name,
        HP,
        attack,
        height,
        weight,
        defense,
        image,
        speed,
      });
      const typeDb = await Type.findAll({ where: { name: types } });
      await pokeNew.addType(typeDb);
      return res.status(201).json(pokeNew);
    }
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});
router.get("/pokemons/:id/delete", async (req, res) => {
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
router.put("/pokemons/:id", async (req, res) => {
  try {
    const { name, HP, attack, defense, speed, height, weight, types, image } =
      req.body;
    const pokeUpdate = await Pokemon.findOne({
      where: { id: req.params.id },
    });

    await pokeUpdate.update({
      name: req.body.name,
    });
    await pokeUpdate.save();
    await pokeUpdate.reload();
    return res.status(200).json(pokeUpdate);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

module.exports = router;
