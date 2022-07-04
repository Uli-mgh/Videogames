const allVideogames = require("../services/Videogames.js");
const getVGSearchName = require("../services/searchName.js");
const getVGSearchID = require("../services/searchID.js");

const { Videogame, Genre } = require("../../db.js");

const getVideogames = async (req, res, next) => {
  const { name } = req.query;

  try {
    if (name) {
      const byName = await getVGSearchName(name);

      // Si el nombre pasado por query coincide envio el 200
      byName.length
        ? res.status(200).send(byName)
        : res.status(404).json({ message: "Game not found" });
    } else {
      const getAllGames = await allVideogames();
      res.status(200).send(getAllGames);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getOneGame = async (req, res, next) => {
  const { id } = req.params;

  try {
    const game = await getVGSearchID(id);

    if (game !== null) {
      res.status(200).send(game);
    } else {
      res.status(404).json({ message: "Game ID not found" });
    }
  } catch (error) {
    next(error);
  }
};

const postGame = async (req, res, next) => {
  const { name, description, released, rating, genres, platforms, image } =
    req.body;
  try {
    const modelPost = {
      name,
      description,
      released,
      rating,
      platforms: platforms.join(", , ").split(" ,"),
      image,
    };
    const gnres = await Genre.findAll({
      where: {
        name: genres,
      },
    });

    const vgameCreated = await Videogame.create(modelPost);
    vgameCreated.addGenre(gnres);
    res.send("Videogame created successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = { getVideogames, getOneGame, postGame };
