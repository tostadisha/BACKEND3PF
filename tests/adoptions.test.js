import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest(`http://localhost:8080`);

describe("Testing adoptions", () => {
  it("Post debe devolver 201 porque creó una adopción", async () => {
    const uid = "67e1d5edf6807ab17966789e";
    const pid = "67e1d5cbf6807ab17966789b";
    await request.patch(`/api/pets/${pid}`).send({ adopted: false });
    await request.put(`/api/users/${uid}`).send({ pets: [] });
    const { statusCode, ok, _body } = await request.post(
      `/api/adoptions/${uid}/${pid}`
    );
    console.log("Testing 1");
    console.log(_body);
    expect(statusCode).to.equal(201);
    expect(ok).to.equal(true);
    expect(_body).to.have.property("status", "success");
  });
  it("GET Debe devolver un status 200", async () => {
    const { statusCode, ok, _body } = await request.get("/api/adoptions");
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
    expect(_body).to.have.property("status", "success");
  });
  it("Delete debe devolver 200 porque eliminó todas las adopciones", async () => {
    const { statusCode, ok, _body } = await request.delete(
      "/api/adoptions/delete"
    );
    expect(statusCode).to.equal(200);
    expect(ok).to.equal(true);
    expect(_body).to.have.property("status", "success");
  });
  it("GET Debe devolver un status 404 cuando no hay adopciones", async () => {
    await request.delete("/api/adoptions/delete");
    const { statusCode, ok, _body } = await request.get("/api/adoptions");
    expect(statusCode).to.equal(404);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
  it("GET /adoptions/:aid debe devolver 200 con un ID valido", async () => {
    const uid = "67e1d5edf6807ab17966789e";
    const pid = "67e1d5cbf6807ab17966789b";
    await request.patch(`/api/pets/${pid}`).send({ adopted: false });
    await request.put(`/api/users/${uid}`).send({ pets: [] });
    const { statusCode, ok, _body } = await request.post(
      `/api/adoptions/${uid}/${pid}`
    );
    const {
      statusCode: statusCode2,
      ok: ok2,
      _body: _body2,
    } = await request.get(`/api/adoptions/${_body.payload.adoptionId}`);
    expect(statusCode2).to.equal(200);
    expect(ok2).to.equal(true);
    expect(_body2).to.have.property("status", "success");
  });
  it("GET /adoptions/:aid debe devolver 404 con un ID válido que no existe", async () => {
    const { statusCode, ok, _body } = await request.get(
      "/api/adoptions/67e1d5edf6807ab17966783e"
    );
    expect(statusCode).to.equal(404);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
  it("GET /adoptions/:aid debe devolver 400 con un ID inválido", async () => {
    const { statusCode, ok, _body } = await request.get("/api/adoptions/123");
    expect(statusCode).to.equal(400);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
  it("POST /adoptions/:uid/:pid debe devolver 404 cuando no encuentre un usuario", async () => {
    const uid = "67e1d5edf6807ab17944489e";
    const pid = "67e1d5cbf6807ab17966789b";
    await request.put(`/api/users/${uid}`).send({ pets: [] });
    const { statusCode, ok, _body } = await request.post(
      `/api/adoptions/${uid}/${pid}`
    );
    expect(statusCode).to.equal(404);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
  it("POST /adoptions/:uid/:pid debe devolver 404 cuando no encuentre una mascota", async () => {
    const uid = "67e1d5edf6807ab17966789e";
    const pid = "67e1d5cbf6807ab17964444b";
    await request.put(`/api/users/${uid}`).send({ pets: [] });
    const { statusCode, ok, _body } = await request.post(
      `/api/adoptions/${uid}/${pid}`
    );
    expect(statusCode).to.equal(404);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
  it("POST /adoptions/:uid/:pid debe devolver 400 cuando la mascota ya fue adoptada", async () => {
    const uid = "67e1d5edf6807ab17966789e";
    const pid = "67e1d5cbf6807ab17966789b";
    await request.patch(`/api/pets/${pid}`).send({ adopted: true });
    await request.put(`/api/users/${uid}`).send({ pets: [] });
    const { statusCode, ok, _body } = await request.post(
      `/api/adoptions/${uid}/${pid}`
    );
    expect(statusCode).to.equal(400);
    expect(ok).to.equal(false);
    expect(_body).to.have.property("status", "error");
  });
});
