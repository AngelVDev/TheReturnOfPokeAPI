const { Router } = require("express");
const apicache = require("apicache");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pkRoute = require("./pokeRoute");
const pkTypeRoute = require("./pokeTypeRoute");
const router = Router();
const cache = apicache.middleware;

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/", cache("10 minutes"), pkRoute);
router.use("/", pkTypeRoute);

module.exports = router;
