const { Type } = require("../db");
const { Router } = require("express");
const { typeApi } = require("../controllers/pokeTypeController");
const router = Router();

router.get("/types", async (req, res) => {
  const types = await typeApi();
  let allTypes = await Type.findAll();
  try {
    if (!allTypes.length) {
      await Type.bulkCreate(types);
      res.status(201).json("Createds");
    } else {
      res.status(200).json(allTypes);
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
