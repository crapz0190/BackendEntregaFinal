import { productsDAO } from "../dao/products.dao.js";

class ProductService {
  constructor(data) {
    this.productService = data;
  }

  findAll = async () => {
    const products = await this.productService.getAll();
    return products;
  };

  paginate = async (obj) => {
    const products = await this.productService.paginate(obj);
    return products;
  };

  findById = async (pid) => {
    const products = await this.productService.getById(pid);
    return products;
  };

  createOne = async (obj) => {
    const products = await this.productService.createOne(obj);
    return products;
  };

  updateOne = async (pid, obj) => {
    const products = await this.productService.updateOne(pid, obj);
    return products;
  };

  deleteOne = async (pid) => {
    const products = await this.productService.deleteOne(pid);
    return products;
  };
}
export const productService = new ProductService(productsDAO);
