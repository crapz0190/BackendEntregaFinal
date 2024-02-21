import { cartsModel } from "../models/carts.model.js";
import BasicDAO from "./basic.dao.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";

class CartsDAO extends BasicDAO {
  constructor() {
    super(cartsModel, ["products.product"]);
  }

  async createCart() {
    try {
      const newCart = { products: [] };
      const createCart = await cartsModel.create(newCart);
      return createCart;
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }

  async addProductsByCart(cid, pid, quantity, userId) {
    try {
      const cart = await cartsModel.findById(cid);

      if (!cart.user) {
        cart.user = userId;
      }

      const foundIndex = cart.products.findIndex((item) =>
        item.product.equals(pid),
      );
      if (foundIndex === -1) {
        cart.products.push({ product: pid, quantity: quantity });
      } else {
        cart.products[foundIndex].quantity = quantity;
      }
      return cart.save();
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }

  async deleteProductByCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const foundIndex = cart.products.findIndex((item) =>
        item.product.equals(pid),
      );
      if (foundIndex !== -1) {
        cart.products.splice(foundIndex, 1);
        await cart.save();
      } else {
        console.error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      CustomError.generateError(
        ErrorsMessages.INTERNAL_SERVER_ERROR,
        ErrorsNames.CODE_ERROR,
        500,
      );
    }
  }
}

export const cartsDAO = new CartsDAO();
