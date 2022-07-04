const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { getGenres } = require("./controllers/Genres.js");
const {
  getVideogames,
  getOneGame,
  postGame,
} = require("./controllers/Videogames.js");

const router = Router();

router.get("/games", getVideogames);
router.get("/games/:id", getOneGame);
router.post("/game", postGame);

router.get("/genres", getGenres);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

module.exports = router;
