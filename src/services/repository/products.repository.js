import { productService } from "../products.service.js";

class ProductRepository {
  constructor(data) {
    this.productRepository = data;
  }

  findAll = () => {
    const products = this.productRepository.findAll();
    return products;
  };

  paginate = (obj) => {
    const products = this.productRepository.paginate(obj);
    return products;
  };

  findById = (pid) => {
    const products = this.productRepository.findById(pid);
    return products;
  };

  createOne = (obj) => {
    const products = this.productRepository.createOne(obj);
    return products;
  };

  updateOne = (pid, obj) => {
    const products = this.productRepository.updateOne(pid, obj);
    return products;
  };

  deleteOne = (pid) => {
    const products = this.productRepository.deleteOne(pid);
    return products;
  };
}

export const productRepository = new ProductRepository(productService);
