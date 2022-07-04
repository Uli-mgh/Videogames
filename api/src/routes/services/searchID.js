const axios = require("axios");
const { Videogame, Genre } = require("../../db.js");

require("dotenv").config();
const { API_KEY } = process.env;

const searchIdApi = async (id) => {
  try {
    const api = await axios.get(
      `https://api.rawg.io/api/games/${id}?key=${API_KEY}`
    );

    return {
      id: api.data.id,
      name: api.data.name,
      description: api.data.description_raw,
      image: api.data.background_image,
      released: api.data.released,
      rating: api.data.rating,
      platforms: api.data.platforms
        .map((p) => p.platform.name)
        .join(", ")
        .trim(),
      genres: api.data.genres
        .map((e) => e.name)
        .join(", ")
        .trim(),
    };
  } catch (error) {
    console.log(error);
  }
};

const searchDb = async (id) => {
  try {
    const dbData = await Videogame.findOne({
      where: {
        id: id,
      },
      include: {
        model: Genre,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    });

    const format = {
      id: dbData.id,
      name: dbData.name,
      genres: dbData.genres
        .map((e) => e.name)
        .join(", ")
        .trim(),
      image: dbData.image,
      rating: dbData.rating,
      released: dbData.released,
      description: dbData.description,
      platforms: dbData.platforms,
      createdInDb: dbData.createdInDb,
    };

    console.log("DB GAMES", dbData);

    return format;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getVGSearchID = async (id) => {
  if (isNaN(id)) {
    const dbGame = await searchDb(id);
    return dbGame;
  } else {
    const apiGame = await searchIdApi(id);
    return apiGame;
  }
};

module.exports = getVGSearchID;
