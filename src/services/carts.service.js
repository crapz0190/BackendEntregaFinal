import { cartsDAO } from "../dao/carts.dao.js";

class CartService {
  constructor(data) {
    this.cartService = data;
  }

  findAll = async () => {
    const carts = await this.cartService.getAll();
    return carts;
  };

  findById = async (cid) => {
    const carts = await this.cartService.getById(cid);
    return carts;
  };

  createOne = async () => {
    const carts = await this.cartService.createCart();
    return carts;
  };

  updateCart = async (cid, pid, quantity, userId) => {
    const carts = await this.cartService.addProductsByCart(
      cid,
      pid,
      quantity,
      userId,
    );
    return carts;
  };

  deleteOne = async (cid) => {
    const carts = await this.cartService.deleteOne(cid);
    return carts;
  };

  deleteProductByCart = async (cid, pid) => {
    const carts = await this.cartService.deleteProductByCart(cid, pid);
    return carts;
  };
}
export const cartService = new CartService(cartsDAO);
