import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import UserDTO from "../dto/User.dto.js";

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    logger.info(
      `Registrando el usuario ${first_name} ${last_name} con el mail ${email}`
    );
    if (!first_name || !last_name || !email || !password) {
      logger.debug("register - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });
    }
    const exists = await usersService.getUserByEmail(email);
    if (exists) {
      return res
        .status(400)
        .send({ status: "error", error: "Usuario ya existe" });
    }
    const hashedPassword = await createHash(password);
    const user = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
    };
    let result = await usersService.create(user);
    logger.info(`Usuario creado con ID: ${result._id}`);
    res.status(201).send({ status: "success", payload: result });
  } catch (error) {
    logger.error(`register - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Iniciando sesión con el mail ${email}`);
    if (!email || !password) {
      logger.debug("login - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      logger.warn("login - Usuario no encontrado");
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    }
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      logger.warn("login - Contraseña incorrecta");
      return res
        .status(400)
        .send({ status: "error", error: "Contraseña incorrecta" });
    }
    const userDto = UserDTO.getUserTokenFrom(user);
    const token = jwt.sign(userDto, "tokenSecretJWT", { expiresIn: "1h" });
    const date = Date.now();
    const result = await usersService.update(user._id, {
      last_connection: date,
    });
    logger.info(`Usuario ${user.email} logueado correctamente`);
    res
      .cookie("coderCookie", token, { maxAge: 3600000, httpOnly: true })
      .status(200)
      .send({ status: "success", message: "Usuario logueado correctamente" });
  } catch (error) {
    logger.error(`login - Error: ${error.message}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const current = async (req, res) => {
  const cookie = req.cookies["coderCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) {
    logger.info(`Usuario actual: ${user.email}`);
    return res.status(200).send({ status: "success", payload: user });
  }
};

const unprotectedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logger.debug("unprotectedLogin - Datos incompletos");
      return res
        .status(400)
        .send({ status: "error", error: "Valores incompletos" });
    }
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      logger.warn("unprotectedLogin - El usuario no existe");
      return res
        .status(404)
        .send({ status: "error", error: "El usuario no existe" });
    }
    const isValidPassword = await passwordValidation(user, password);
    if (!isValidPassword) {
      logger.warn("unprotectedLogin - Contraseña incorrecta");
      return res
        .status(400)
        .send({ status: "error", error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(user, "tokenSecretJWT", { expiresIn: "1h" });
    res
      .status(200)
      .cookie("unprotectedCookie", token, { maxAge: 3600000 })
      .send({ status: "success", message: "Login desprotejido" });
  } catch (error) {
    logger.info(`unprotectedLogin - Error: ${error}`);
    res.status(400).send({ status: "error", error: error.message });
  }
};
const unprotectedCurrent = async (req, res) => {
  const cookie = req.cookies["unprotectedCookie"];
  const user = jwt.verify(cookie, "tokenSecretJWT");
  if (user) {
    logger.info(`Usuario actual: ${user.email}`);
    return res.send({ status: "success", payload: user });
  }
};
const logout = async (req, res) => {
  res.clearCookie("coderCookie");
  res.status(200).send({ status: "success", message: "Usuario deslogueado" });
};
export default {
  current,
  logout,
  login,
  register,
  current,
  unprotectedLogin,
  unprotectedCurrent,
};
