import supertest from "supertest";
import { expect } from "chai";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { mongoUri } from "./testConfig.js";

// Ruta absoluta
const __filename = fileURLToPath(import.meta.url);
export const __dirname = join(dirname(__filename));

const requester = supertest("http://localhost:8080");

describe("Products endpoints", () => {
  let cookie;

  before(async () => {
    await mongoose.connect(mongoUri);
  });

  after(async () => {
    // Desconectar de la base de datos después de ejecutar todas las pruebas
    await mongoose.disconnect();
  });

  describe("POST /api/users/login", () => {
    const user = {
      email: "test@gmail.com",
      password: "user1234",
    };

    it("should login to the platform and return a cookie", async () => {
      const response = await requester.post("/api/users/login").send(user);
      cookie = {
        name: response.headers["set-cookie"][0].split("=")[0],
        value: response.headers["set-cookie"][0].split("=")[1].split(";")[0],
      };

      expect(response.statusCode).to.be.equal(200);
      expect(cookie.name).to.be.equal("token");
    });
  });

  describe("POST /api/products/add", () => {
    // Limpiar la base de datos antes de cada prueba
    beforeEach(async () => {
      // Verificar si la conexión a la base de datos está establecida
      if (mongoose.connection.readyState !== 1) {
        throw new Error("No connection to the database");
      }

      // Limpiar la colección
      await mongoose.connection.collection("products").deleteMany({});
    });

    it("should create a product and return status and payload. Payload should be an object", async () => {
      const product1 = {
        title: "title-2",
        description: "description-2",
        code: "code-1",
        price: 23445,
        stock: 23,
        category: "category-2",
      };

      const imagePath1 = join(__dirname, "pc-g-1.jpg");
      const imagePath2 = join(__dirname, "pc-g-2.webp");
      // const imagePath3 = join(__dirname, "pc-g-3.webp");

      const response = await requester
        .post("/api/products/add")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .field("title", product1.title)
        .field("description", product1.description)
        .field("code", product1.code)
        .field("price", product1.price)
        .field("stock", product1.stock)
        .field("category", product1.category)
        .attach("thumbnails", imagePath1)
        .attach("thumbnails", imagePath2);
      // .attach("thumbnails", imagePath3);

      expect(response.statusCode).to.be.equal(201);
      expect(response._body).to.have.all.keys("status", "payload");
      expect(response._body.payload).to.be.an("object");
      expect(response._body.payload.status).to.be.equal(true);
    });
  });

  describe("GET /api/products", () => {
    it("should return status and payload. Payload and thumbnails should be an array", async () => {
      const response = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "payload");
      expect(response._body.payload.payload).to.be.an("array");
      expect(response._body.payload.payload[0].thumbnails).to.be.an("array");
    });
  });

  describe("GET /api/products/:pid", () => {
    it("should return status and payload of a product. Payload should be an object and thumbnails should be an array", async () => {
      const product = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      const productObj = product.body.payload.payload[0];

      const response = await requester
        .get(`/api/products/${productObj._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "payload");
      expect(response._body.payload).to.be.an("object");
      expect(response._body.payload.thumbnails).to.be.an("array");
    });
  });

  describe("PUT /api/products/:pid", () => {
    it("should return status and payload of a product. Payload should be an object and thumbnails should be an array", async () => {
      const product1 = {
        title: "title-actualizado",
        description: "description-actualizado",
        code: "code-1",
        price: 23445,
        stock: 23,
        category: "category-actualizado",
      };

      const product = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      const productObj = product.body.payload.payload[0];

      const response = await requester
        .put(`/api/products/${productObj._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(product1);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "payload");
      expect(response._body.payload).to.be.an("object");
      expect(response._body.payload.status).to.be.equal(true);
    });
  });

  describe("PUT /api/products/:pid/add-images", () => {
    it("should return status and payload and the Images must also be updated by incorporating them into existing ones. Payload should be an object and thumbnails should be an array", async () => {
      const productList = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      if (productList.body.payload.payload.length === 0) {
        throw new Error("No products found to update with images");
      }

      const productObj = productList.body.payload.payload[0];

      const imagePath3 = join(__dirname, "pc-g-3.webp");

      const response = await requester
        .put(`/api/products/${productObj._id}/add-images`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .attach("thumbnails", imagePath3);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "payload");
      expect(response._body.payload).to.be.an("object");
      expect(response._body.payload.thumbnails).to.be.an("array");
    });
  });

  describe("DELETE /api/products/:pid/delete-image", () => {
    it("should delete a image and return status and a message", async () => {
      const productList = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      if (productList.body.payload.payload.length === 0) {
        throw new Error("No products found to update with images");
      }

      const productObj = productList.body.payload.payload[0];

      const existingImages = productObj.thumbnails;

      if (existingImages.length === 0) {
        throw new Error("No images found in product's thumbnails");
      }

      // Seleccionar la primera imagen (puedes ajustar esto según tus necesidades)
      const imageUrlToDelete = existingImages[0];

      const response = await requester
        .delete(`/api/products/${productObj._id}/delete-image`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send({ imageUrl: imageUrlToDelete });

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "message");
    });
  });

  describe("DELETE /api/products/:pid", () => {
    it("should delete a product and return status and a message", async () => {
      const product = await requester
        .get("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      const productObj = product.body.payload.payload[0];

      const response = await requester
        .delete(`/api/products/${productObj._id}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      expect(response.statusCode).to.be.equal(200);
      expect(response._body).to.have.all.keys("status", "message");
    });
  });
});
