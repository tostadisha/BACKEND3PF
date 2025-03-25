import {
  adoptionsService,
  petsService,
  usersService,
} from "../services/index.js";
import { logger } from "../utils/logger.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();
    if (result.length === 0) {
      logger.warn("getAllAdoptions - No se encontraron adopciones");
      return res
        .status(404)
        .send({ status: "error", error: "No se encontraron adopciones" });
    }
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(`getAllAdoptions - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;
    if (!adoptionId)
      return res
        .status(400)
        .send({ status: "error", error: "ID de adopción no proporcionado" });
    const adoption = await adoptionsService.getBy({ _id: adoptionId });
    if (!adoption)
      return res
        .status(404)
        .send({ status: "error", error: "Adopción no encontrada" });
    res.send({ status: "success", payload: adoption });
  } catch (error) {
    logger.error(`getAdoption - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const user = await usersService.getUserById(uid);
    if (!user)
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    const pet = await petsService.getBy({ _id: pid });
    if (!pet)
      return res
        .status(404)
        .send({ status: "error", error: "Mascota no encontrada" });
    if (pet.adopted) {
      logger.info(`createAdoption - Mascota ${pet._id} ya ha sido adoptado`);
      return res
        .status(400)
        .send({ status: "error", error: "Mascota ya adoptada" });
    }
    // Actualizamos los datos del usuario y la mascota
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });
    await petsService.update(pet._id, { adopted: true, owner: user._id });
    const adoption = await adoptionsService.create({
      owner: user._id,
      pet: pet._id,
    });
    res.status(201).send({
      status: "success",
      message: "Mascota adoptada",
      payload: {
        owner: user._id,
        pet: pet._id,
        adoptionId: adoption._id,
      },
    });
  } catch (error) {
    logger.error(`createAdoption - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const deleteAllAdoptions = async (req, res) => {
  try {
    await adoptionsService.deleteAll();
    res.send({
      status: "success",
      message: "Todas las adopciones han sido borradas",
    });
  } catch (error) {
    logger.error(`deleteAllAdoptions - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption,
  deleteAllAdoptions,
};
