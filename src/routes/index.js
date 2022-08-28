const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pkRoute = require("./pokeRoute");
const pkTypeRoute = require("./pokeTypeRoute");
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/", pkRoute);
router.use("/", pkTypeRoute);

module.exports = router;
