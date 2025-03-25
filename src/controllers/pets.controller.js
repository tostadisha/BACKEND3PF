import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { logger } from "../utils/logger.js";

const getAllPets = async (req, res) => {
  try {
    const pets = await petsService.getAll();
    logger.debug(`getAllPets - Mascotas encontradas: ${pets.length}`);
    if (pets.length === 0) {
      logger.warn("getAllPets - No se han encontrado mascotas");
      return res
        .status(404)
        .send({ status: "error", error: "No hay mascotas" });
    }
    res.status(200).send({ status: "success", payload: pets });
  } catch (error) {
    logger.error(`getAllPets - Error al obtener mascotas: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const getPetById = async (req, res) => {
  try {
    const petId = req.params.pid;
    logger.debug(
      `getPetById - Params recibidos: ${JSON.stringify(req.params)}`
    );
    const pet = await petsService.getBy(petId);
    if (!pet) {
      logger.warn(`getPetById - Mascota con ID ${petId} no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    res.status(200).send({ status: "success", payload: pet });
  } catch (error) {
    logger.error(`getPetById - Error al obtener mascota: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const createPet = async (req, res) => {
  try {
    const { name, specie, birthDate } = req.body;
    logger.info(`Creando mascota ${name}`);
    if (!name || !specie || !birthDate) {
      logger.debug("createPet - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }
    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    let exist = await petsService.getByKey("name", pet.name);
    if (exist) {
      logger.warn(`createPet - Mascota con nombre ${pet.name} ya existe`);
      return res
        .status(400)
        .send({ status: "error", error: "Mascota ya existe" });
    }
    const result = await petsService.create(pet);
    logger.info(`Mascota creada con ID: ${result._id}`);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(`createPet - Error al crear mascota: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const petUpdateBody = req.body;
    const petId = req.params.pid;
    logger.debug(`updatePet - Params recibidos: ${JSON.stringify(req.params)}`);
    logger.debug(`updatePet - Body recibido: ${JSON.stringify(req.body)}`);
    if (!petUpdateBody || !petId) {
      logger.debug("updatePet - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }
    const pet = await petsService.getBy(petId);
    if (!pet) {
      logger.warn(`updatePet - Mascota con ID ${petId} no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    const result = await petsService.update(petId, petUpdateBody);
    res.status(200).send({
      status: "success",
      message: "Mascota actualizada",
      payload: result,
    });
  } catch (error) {
    logger.error(`updatePet - Error al actualizar mascota: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const petId = req.params.pid;
    logger.debug(`deletePet - Params recibidos: ${JSON.stringify(req.params)}`);
    const pet = await petsService.getBy(petId);
    if (!pet) {
      logger.warn(`deletePet - Mascota con ID ${petId} no encontrada`);
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    }
    const result = await petsService.delete(petId);
    res.send({
      status: "success",
      message: "Mascota borrada",
      payload: result,
    });
  } catch (error) {
    logger.error(`deletePet - Error al eliminar mascota: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const createPetWithImage = async (req, res) => {
  try {
    const file = req.file;
    const { name, specie, birthDate } = req.body;
    logger.info(`Creando mascota ${name} con imagen...`);
    console.log("Los campos que me llegan son:");
    console.log(name, specie, birthDate);
    if (!name || !specie || !birthDate) {
      logger.debug("createPetWithImage - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }

    if (!file) {
      logger.warn("createPetWithImage - No se recibió ninguna imagen");
      return res
        .status(400)
        .send({ status: "error", error: "No se recibió ninguna imagen" });
    }
    const pet = PetDTO.getPetInputFrom({
      name,
      specie,
      birthDate,
      image: `${__dirname}/../public/img/${file.filename}`,
    });
    logger.info(`Mascota: ${JSON.stringify(pet)}`);
    let exist = await petsService.getByKey("name", pet.name);
    if (exist) {
      logger.warn(`createPet - Mascota con nombre ${pet.name} ya existe`);
      return res
        .status(400)
        .send({ status: "error", error: "Mascota ya existe" });
    }
    const result = await petsService.create(pet);
    logger.info(`Mascota creada con ID: ${result._id}`);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(
      `createPetWithImage - Error al crear mascota: ${error.message}`
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};
export default {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getPetById,
  createPetWithImage,
};
