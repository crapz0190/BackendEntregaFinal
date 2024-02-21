import { cartService } from "../carts.service.js";

class CartRepository {
  constructor(data) {
    this.cartRepository = data;
  }

  findAll = () => {
    const carts = this.cartRepository.findAll();
    return carts;
  };

  findById = (cid) => {
    const carts = this.cartRepository.findById(cid);
    return carts;
  };

  createOne = () => {
    const carts = this.cartRepository.createOne();
    return carts;
  };

  updateCart = (cid, pid, quantity, userId) => {
    const carts = this.cartRepository.updateCart(cid, pid, quantity, userId);
    return carts;
  };

  deleteOne = (cid) => {
    const carts = this.cartRepository.deleteOne(cid);
    return carts;
  };

  deleteProductByCart = (cid, pid) => {
    const carts = this.cartRepository.deleteProductByCart(cid, pid);
    return carts;
  };
}

export const cartRepository = new CartRepository(cartService);
