import { createHash, passwordValidation } from "../src/utils/index.js";
import { expect } from "chai";

describe("bcrypt", () => {
  it("El método createHash debe poder encriptar una contraseña", async () => {
    const password = "123456";
    const hash = await createHash(password);
    expect(hash).to.not.equal(password);
  });
  it("El método passwordValidation debe poder comparar una contraseña con un hash", async () => {
    const password = "123456";
    const hash = await createHash(password);
    const result = await passwordValidation({ password: hash }, password);
    expect(result).to.be.true;
  });
  it("El método passwordValidation debe devolver false si la contraseña hasheada es alterada", async () => {
    const password = "123456";
    const hash = await createHash(password);
    const alteredHash = hash.replace(hash[0], "1");
    const result = await passwordValidation({ password: alteredHash }, hash);
    expect(result).to.be.false;
  });
});
