import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest(`http://localhost:8080`);

describe("Testing adoptme", () => {
  let idUser = null;
  const petMock = {
    name: "Firulais",
    specie: "Dog",
    birthDate: "2020-01-01",
  };
  describe("Testing pets", () => {
    it("Post /api/pets debe crear una mascota", async () => {
      const { statusCode, ok, _body } = await request
        .post("/api/pets")
        .send(petMock);
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("status", "success");
      expect(_body).to.have.property("payload");
      expect(_body.payload).to.have.property("adopted", false);
      idUser = _body.payload._id;
    });
    it("Post /api/pets/withimage debe crear una mascota con imagen", async () => {
      const { statusCode, ok, _body } = await request
        .post("/api/pets/withimage")
        .field("name", petMock.name)
        .field("specie", petMock.specie)
        .field("birthDate", petMock.birthDate)
        .attach("image", "./tests/assets/dog.jpg");
      expect(statusCode).to.equal(201);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("status", "success");
      expect(_body).to.have.property("payload");
      expect(_body.payload).to.have.property("adopted", false);
    });
    it("Post /api/pets crear una mascota sin el campo nombre, el módulo debe responder con un status 400", async () => {
      const { statusCode, ok, _body } = await request.post("/api/pets").send({
        specie: "Dog",
        birthDate: "2020-01-01",
      });
      expect(statusCode).to.equal(400);
      expect(ok).to.equal(false);
      expect(_body).to.have.property("status", "error");
    });
    it("PATCH debe poder actualizar correctamente la mascota", async () => {
      if (!idUser) {
        throw new Error("No se ha creado el usuario");
      }
      const updatePet = {
        name: "pepe",
      };
      const { statusCode, ok, _body } = await request
        .patch(`/api/pets/${idUser}`)
        .send(updatePet);
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("status", "success");
      const {
        statusCode: statusCodeGet,
        ok: okGet,
        _body: _bodyGet,
      } = await request.get(`/api/pets/${idUser}`);
      expect(statusCodeGet).to.be.equal(200);
      expect(okGet).to.be.equal(true);
      expect(_bodyGet.payload).to.be.property("name", "pepe");
    });
    it("DELETE debe poder eliminar correctamente la mascota", async () => {
      if (!idUser) {
        throw new Error("No se ha creado el usuario");
      }
      const { statusCode, ok, _body } = await request.delete(
        `/api/pets/${idUser}`
      );
      expect(statusCode).to.equal(200);
      expect(ok).to.equal(true);
      expect(_body).to.have.property("status", "success");
      const {
        statusCode: statusCodeGet,
        ok: okGet,
        _body: _bodyGet,
      } = await request.get(`/api/pets/${idUser}`);
      expect(statusCodeGet).to.be.equal(404);
      expect(okGet).to.be.equal(false);
    });
  });
});
