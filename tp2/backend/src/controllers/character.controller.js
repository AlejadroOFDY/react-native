import { CharacterModel } from "../models/character.model.js";

// Treer de la API
export const importCharacter = async (req, res) => {
  try {
    let currentPage = 1;
    let totalPages = 1;
    let totalImported = 0;
    // let allCharacters = [];

    while (currentPage <= totalPages) {
      const response = await fetch(
        `https://dragonball-api.com/api/characters?page=${currentPage}&limit=10`,
      );
      const data = await response.json();

      const characters = data.items || [];
      totalPages = data.meta?.totalPages || 1;

      for (const character of characters) {
        await CharacterModel.create({
          name: character.name,
          ki: character.ki,
          maxKi: character.maxKi,
          race: character.race,
          description: character.description,
          image: character.image,
          affiliation: character.affiliation,
        });

        // allCharacters.push(character);
        totalImported++;
      }

      currentPage++;
    }
    res.status(201).json({
      // allCharacters,
      message: "Personajes importados",
      total: totalImported,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

// Create
export const createCharacter = async (req, res) => {
  const { name, ki, maxKi, race, description, affiliation, image } = req.body;

  try {
    const newCharacter = await CharacterModel.create({
      name,
      ki,
      maxKi,
      race,
      description,
      image,
      affiliation,
    });
    res.status(200).json(newCharacter);
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

// All
export const getAllCharacters = async (req, res) => {
  try {
    const characters = await CharacterModel.findAll();

    res.status(201).json(characters);
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

// id
export const getCharacterById = async (req, res) => {
  const { id } = req.params;
  try {
    const character = await CharacterModel.findByPk(id);

    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

// Update
export const updateCharacter = async (req, res) => {
  const { id } = req.params;
  const { name, ki, maxKi, race, description, affiliation, image } = req.body;

  try {
    const character = await CharacterModel.findByPk(id);
    character.update({
      name,
      ki,
      maxKi,
      race,
      description,
      affiliation,
      image,
    });
    res.status(201).json({ message: "Personaje actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

// Delete
export const deleteCharacter = async (req, res) => {
  const { id } = req.params;

  try {
    const character = await CharacterModel.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    await character.destroy();
    res.status(200).json({ message: "Personaje eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};

export const deleteAllCharacters = async (req, res) => {
  try {
    await CharacterModel.destroy({ where: {} });

    res.status(201).json({ message: "Personajes Eliminados" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del Servidor" });
  }
};
