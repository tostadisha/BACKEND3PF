import { usersService } from "../services/index.js";
import __dirname from "../utils/index.js";
import { logger } from "../utils/logger.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    logger.debug(`getAllUsers - Usuarios encontrados: ${users.length}`);
    if (users.length === 0) {
      logger.warn("getAllUsers - No se encontraron usuarios");
      return res
        .status(404)
        .send({ status: "error", error: "No se encontraron usuarios" });
    }
    res.send({ status: "success", payload: users });
  } catch (error) {
    logger.error(`getAllUsers - Error al obtener usuarios: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    logger.debug(`getUser - Params recibidos: ${JSON.stringify(req.params)}`);
    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warn(`getUser - Usuario con ID ${userId} no encontrado`);
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    }
    res.send({ status: "success", payload: user });
  } catch (error) {
    logger.error(
      `getUser - Error al obtener usuario ${req.params.uid}: ${error.message}`
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateBody = req.body;
    const userId = req.params.uid;
    logger.debug(
      `updateUser - Params recibidos: ${JSON.stringify(req.params)}`
    );
    logger.debug(`updateUser - Body recibido: ${JSON.stringify(req.body)}`);
    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warn(`updateUser - Usuario con ID ${userId} no encontrado`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    const result = await usersService.update(userId, updateBody);
    res.send({
      status: "success",
      message: "Usuario actualizado",
      payload: result,
    });
  } catch (error) {
    logger.error(
      `updateUser - Error al obtener usuario ${req.params.uid}: ${error.message}`
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    logger.debug(
      `deleteUser - Params recibidos: ${JSON.stringify(req.params)}`
    );
    const user = await usersService.getUserById(userId);
    if (!user) {
      logger.warn(`deleteUser - Usuario con ID ${userId} no encontrado`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    const result = await usersService.getUserById(userId);
    if (!result) {
      logger.warn(`deleteUser - Usuario con ID ${userId} no encontrado`);
      return res.status(404).send({ status: "error", error: "User not found" });
    }
    await usersService.delete(userId);
    res.send({ status: "success", message: "Usuario borrado" });
  } catch (error) {
    logger.error(
      `deleteUser - Error al obtener usuario ${req.params.uid}: ${error.message}`
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};

const addDocument = async (req, res) => {
  try {
    const userId = req.params.uid;
    const files = req.files;
    if (!files) {
      return res
        .status(400)
        .send({ status: "error", error: "No hay documentos" });
    }
    const documents = files.map((file) => ({
      name: file.originalname,
      reference: `${__dirname}/../public/img/${file.filename}`,
    }));

    const user = await usersService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ status: "error", error: "Usuario no encontrado" });
    }

    const result = await usersService.addDocument(userId, documents);
    if (!result) {
      return res
        .status(400)
        .send({ status: "error", error: "Error al agregar documentos" });
    }
    res.send({ status: "success", payload: result });
  } catch (error) {
    logger.error(`addDocument - Error al agregar documentos: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  addDocument,
};
