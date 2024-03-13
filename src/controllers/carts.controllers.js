import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";
import { cartRepository } from "../services/repository/carts.repository.js";
import { productRepository } from "../services/repository/products.repository.js";
import { userRepository } from "../services/repository/users.repository.js";
import { ticketRepository } from "../services/repository/tickets.repository.js";
import { nanoid } from "nanoid";

class CartsControllers {
  allCarts = async (req, res, next) => {
    const { status } = req.user;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allCarts = await cartRepository.findAll();
        if (allCarts.length === 0) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_CARTS,
            404,
          );
        } else {
          return res
            .status(200)
            .json({ status: "All carts", payload: allCarts });
        }
      }
    } catch (e) {
      next(e);
    }
  };

  cartById = async (req, res, next) => {
    const { status } = req.user;
    const { cid } = req.params;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allCarts = await cartRepository.findAll();
        if (allCarts === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        } else if (allCarts.length === 0) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_CARTS,
            404,
          );
        }

        const cart = allCarts.map((item) => item._id);
        const indexCartId = cart.findIndex((item) => item.toString() === cid);

        if (indexCartId === -1) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.CART_NOT_FOUND,
            404,
          );
        } else {
          const cartById = await cartRepository.findById(cid);
          return res
            .status(200)
            .json({ status: "Cart found", payload: cartById });
        }
      }
    } catch (e) {
      next(e);
    }
  };

  purchasingProcess = async (req, res, next) => {
    const { cid } = req.params;
    const { status } = req.user;
    const idUser = req.user._id;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allCarts = await cartRepository.findAll();
        if (allCarts === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        } else if (allCarts.length === 0) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_CARTS,
            404,
          );
        } else {
          const cart = allCarts.map((item) => item._id);
          const indexCartId = cart.findIndex((item) => item.toString() === cid);

          if (indexCartId === -1) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.CART_NOT_FOUND,
              404,
            );
          } else {
            function calculateTotalAmount(products) {
              return products.reduce((total, productInCart) => {
                // Verificar si el producto tiene stock suficiente
                if (productInCart.product.stock >= productInCart.quantity) {
                  return (
                    total + productInCart.product.price * productInCart.quantity
                  );
                }
                return total;
              }, 0);
            }

            const cart = await cartRepository.findById(cid);

            if (
              !cart ||
              !cart.user ||
              cart.user.toString() !== idUser.toString()
            ) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.UNASSIGNED_CART,
                502,
              );
            } else {
              const productsToPurchase = cart.products;

              // Verificar el stock y realizar la compra
              const productsNotPurchased = await Promise.all(
                productsToPurchase.map(async (productInCart) => {
                  const product = await productRepository.findById(
                    productInCart.product,
                  );

                  if (!product || product.stock < productInCart.quantity) {
                    return productInCart.product;
                  }

                  // Restar la cantidad del stock
                  product.stock -= productInCart.quantity;
                  await product.save();

                  return null;
                }),
              );

              // Filtrar los productos que no se pudieron comprar
              const failedPurchaseProducts = productsNotPurchased.filter(
                (productId) => productId !== null,
              );

              const userFound = await userRepository.findById({
                _id: cart.user,
              });

              if (!userFound) {
                // Manejar el caso en el que el usuario no se encuentra
                return res.status(404).json({ error: "User not found" });
              }

              // Generar el ticket
              const ticketData = {
                code: nanoid(10),
                amount: calculateTotalAmount(productsToPurchase),
                purchaser: userFound.email,
                idUser: userFound._id,
              };

              const ticket = await ticketRepository.createTicket(ticketData);

              // Actualizar el carrito con los productos no comprados
              cart.products = productsToPurchase.filter((productInCart) =>
                failedPurchaseProducts.includes(productInCart.product),
              );

              await cart.save();

              return res
                .status(200)
                .json({ status: " Purchased products", payload: ticket });
            }
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };

  updateCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;
    const { status } = req.user;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allCarts = await cartRepository.findAll();
        if (allCarts === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        } else if (allCarts.length === 0) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_CARTS,
            404,
          );
        } else {
          const cart = allCarts.map((item) => item._id);
          const indexCartId = cart.findIndex((item) => item.toString() === cid);

          if (indexCartId === -1) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.CART_NOT_FOUND,
              404,
            );
          } else {
            const products = await productRepository.findAll();
            if (products === undefined) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.SYNTAX_ERROR,
                502,
              );
            } else if (products.length === 0) {
              CustomError.generateError(
                ErrorsMessages.NOT_FOUND,
                ErrorsNames.NOT_PRODUCTS,
                404,
              );
            } else {
              const idProducts = products.map((item) => item._id);
              const indexProductId = idProducts.findIndex(
                (item) => item.toString() === pid,
              );

              if (indexProductId === -1) {
                CustomError.generateError(
                  ErrorsMessages.NOT_FOUND,
                  ErrorsNames.PRODUCT_NOT_FOUND,
                  404,
                );
              } else {
                // Carga del producto al carrito
                const updateCart = await cartRepository.updateCart(
                  cid,
                  pid,
                  +quantity,
                  userId,
                );

                if (updateCart === undefined) {
                  CustomError.generateError(
                    ErrorsMessages.BAD_GATEWAY,
                    ErrorsNames.SYNTAX_ERROR,
                    502,
                  );
                }

                return res.status(200).json({
                  status: "Product added to cart",
                  payload: updateCart,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };

  removeProductByCart = async (req, res, next) => {
    const { cid, pid } = req.params;
    const { status } = req.user;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allCarts = await cartRepository.findAll();
        if (allCarts === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        } else if (allCarts.length === 0) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_CARTS,
            404,
          );
        } else {
          const cart = allCarts.map((item) => item._id);
          const indexCartId = cart.findIndex((item) => item.toString() === cid);

          if (indexCartId === -1) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.CART_NOT_FOUND,
              404,
            );
          } else {
            const products = await productRepository.findAll();
            if (products === undefined) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.SYNTAX_ERROR,
                502,
              );
            } else if (products.length === 0) {
              CustomError.generateError(
                ErrorsMessages.NOT_FOUND,
                ErrorsNames.NOT_PRODUCTS,
                404,
              );
            } else {
              const idProducts = products.map((item) => item._id);
              const indexProductId = idProducts.findIndex(
                (item) => item.toString() === pid,
              );

              if (indexProductId === -1) {
                CustomError.generateError(
                  ErrorsMessages.NOT_FOUND,
                  ErrorsNames.PRODUCT_NOT_FOUND,
                  404,
                );
              } else {
                const removeProductByCart =
                  await cartRepository.deleteProductByCart(cid, pid);

                return res.status(200).json({
                  status: "Product removed from cart",
                  payload: removeProductByCart,
                });
              }
            }
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export const cartCtrl = new CartsControllers();
