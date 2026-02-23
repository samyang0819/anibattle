const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let app;
let mongod;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_secret";
  process.env.JWT_EXPIRES_IN = "1d";
  process.env.CLIENT_ORIGIN = "http://localhost:5173";

  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  app = require("../src/index"); // uses connectDB in index.js; for test env, we’ll connect manually below
});

beforeEach(async () => {
  // connect to test DB and clear
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) await c.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test("signup then login returns token", async () => {
  const signup = await request(app).post("/api/auth/signup").send({
    username: "michelle",
    email: "m@a.com",
    password: "Pass1234!"
  });
  expect(signup.status).toBe(200);
  expect(signup.body.token).toBeTruthy();

  const login = await request(app).post("/api/auth/login").send({
    email: "m@a.com",
    password: "Pass1234!"
  });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeTruthy();
});
