import { productRepository } from "../services/repository/products.repository.js";
import { userRepository } from "../services/repository/users.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs-extra";
import { transporter } from "../utils/nodemailer.js";

class ProductsControllers {
  allProducts = async (req, res, next) => {
    const { status } = req.user;
    const parameters = req.query;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const products = await productRepository.paginate(parameters);

        if (products.payload == 0 || products.payload === null) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.NOT_PRODUCTS,
            404,
          );
        }

        return res
          .status(200)
          .json({ status: "All Products", payload: products });
      }
    } catch (e) {
      next(e);
    }
  };

  productById = async (req, res, next) => {
    const { pid } = req.params;
    const { status } = req.user;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const products = await productRepository.findAll();
        if (products === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        }

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
        }

        const productById = await productRepository.findById(pid);

        return res
          .status(200)
          .json({ status: "Product found", payload: productById });
      }
    } catch (e) {
      next(e);
    }
  };

  addProduct = async (req, res, next) => {
    const { status } = req.user;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const obj = req.body;
        const { _id } = req.user;
        // const filesPath = req.files ? req.files.map((image) => image.path) : [];
        // ------------- manejo de imgs del front -----------
        const filesImgsFront = Object.values(req.files);
        const arrImgs = [].concat(...filesImgsFront);
        const filesPath =
          req.files && arrImgs ? arrImgs.map((image) => image.path) : [];
        // ------------- manejo de imgs del front -----------
        const products = await productRepository.findAll();
        if (products === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        }
        if (products.length === 0) {
          // // Subir las imágenes a Cloudinary
          const cloudinaryUploadPromises = filesPath.map(async (imagePath) => {
            try {
              const result = await cloudinary.uploader.upload(imagePath);
              return result.url;
            } catch (e) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.ERROR_CLOUDINARY,
                502,
              );
            }
          });
          // // Esperar a que todas las imágenes se suban
          const cloudinaryUrls = await Promise.all(cloudinaryUploadPromises);
          const user = await userRepository.findById(_id);
          if (user === undefined) {
            CustomError.generateError(
              ErrorsMessages.BAD_GATEWAY,
              ErrorsNames.SYNTAX_ERROR,
              502,
            );
          } else if (user === null) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.USER_NOT_FOUND,
              404,
            );
          }
          // // // Validación de campos del producto
          function validateProductFields(obj) {
            if (
              obj.title &&
              obj.description &&
              obj.code &&
              obj.price &&
              obj.stock &&
              obj.category
            ) {
              return true;
            }
            return false;
          }
          if (!validateProductFields(obj)) {
            CustomError.generateError(
              ErrorsMessages.BAD_REQUEST,
              ErrorsNames.REQUIRED_FIELDS,
              400,
            );
          } else {
            // // Guarda los nombres de los archivos en el array de imágenes del producto
            obj.thumbnails = cloudinaryUrls;
            // Agrega el ID de usuario y el rol al campo owner
            const userId = user._id;
            const role = user.role;
            obj.owner = [{ idUser: userId, role }];
          }
          const createProduct = await productRepository.createOne(obj);
          const removeImages = filesPath.map(async (imagePath) => {
            return await fs.unlink(imagePath);
          });
          await Promise.all(removeImages);
          return res
            .status(201)
            .json({ status: "Created Product", payload: createProduct });
        } else {
          // // Subir las imágenes a Cloudinary
          const cloudinaryUploadPromises = filesPath.map(async (imagePath) => {
            try {
              const result = await cloudinary.uploader.upload(imagePath);
              return result.url;
            } catch (e) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.ERROR_CLOUDINARY,
                502,
              );
            }
          });
          // // Esperar a que todas las imágenes se suban
          const cloudinaryUrls = await Promise.all(cloudinaryUploadPromises);
          const user = await userRepository.findById(_id);
          if (user === undefined) {
            CustomError.generateError(
              ErrorsMessages.BAD_GATEWAY,
              ErrorsNames.SYNTAX_ERROR,
              502,
            );
          }
          // // // Validación de campos del producto
          function validateProductFields(obj) {
            if (
              obj.title &&
              obj.description &&
              obj.code &&
              obj.price &&
              obj.stock &&
              obj.category
            ) {
              return true;
            }
            return false;
          }
          if (!validateProductFields(obj)) {
            CustomError.generateError(
              ErrorsMessages.BAD_REQUEST,
              ErrorsNames.REQUIRED_FIELDS,
              400,
            );
          } else {
            // // Guarda los nombres de los archivos en el array de imágenes del producto
            obj.thumbnails = cloudinaryUrls;
            // Agrega el ID de usuario y el rol al campo owner
            const userId = user._id;
            const role = user.role;
            obj.owner = [{ idUser: userId, role }];
          }
          const verifyCode = products.findIndex(
            (item) => item.code === obj.code,
          );
          if (verifyCode === -1) {
            const createProduct = await productRepository.createOne(obj);
            const removeImages = filesPath.map(async (imagePath) => {
              return await fs.unlink(imagePath);
            });
            await Promise.all(removeImages);
            return res
              .status(201)
              .json({ status: "Created Product", payload: createProduct });
          } else {
            CustomError.generateError(
              ErrorsMessages.BAD_REQUEST,
              ErrorsNames.REPEAT_PRODUCT,
              400,
            );
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };

  updateProdById = async (req, res, next) => {
    const { pid } = req.params;
    const obj = req.body;
    const userRole = req.user.role;

    const { status } = req.user;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const products = await productRepository.findAll();
        if (products === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        }

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
        }

        // // Validación de campos del producto
        function validateProductFields(obj) {
          if (
            obj.title &&
            obj.description &&
            obj.code &&
            obj.price &&
            obj.stock &&
            obj.category
          ) {
            return true;
          }
          return false;
        }
        if (!validateProductFields(obj)) {
          CustomError.generateError(
            ErrorsMessages.BAD_REQUEST,
            ErrorsNames.REQUIRED_FIELDS,
            400,
          );
        } else {
          const foundProduct = await productRepository.findById(pid);
          const roleOwner = foundProduct.owner.find((item) => item.idUser);

          if (
            userRole === "admin" ||
            (userRole === "premium" && roleOwner.role === "premium")
          ) {
            await productRepository.updateOne(pid, obj);

            const prodById = await productRepository.findById(pid);

            return res
              .status(200)
              .json({ status: "Updated Product", payload: prodById });
          } else if (userRole === "premium" && roleOwner.role === "admin") {
            CustomError.generateError(
              ErrorsMessages.FORBIDDEN,
              ErrorsNames.PERMISSION_DENIED,
              403,
            );
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };

  addImgByProductId = async (req, res, next) => {
    const { status } = req.user;
    const userRole = req.user.role;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const { pid } = req.params;
        // const filesPath = req.files ? req.files.map((image) => image.path) : [];
        // ------------- manejo de imgs del front -----------
        const filesImgsFront = Object.values(req.files);
        const arrFilesImgs = [].concat(...filesImgsFront);
        const filesPath =
          req.files && arrFilesImgs
            ? arrFilesImgs.map((image) => image.path)
            : [];
        // ------------- manejo de imgs del front -----------
        const products = await productRepository.findAll();
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
        }

        const foundProduct = await productRepository.findById(pid);
        const roleOwner = foundProduct.owner.find((item) => item.idUser);

        if (
          userRole === "admin" ||
          (userRole === "premium" && roleOwner.role === "premium")
        ) {
          // Subir las imágenes a Cloudinary
          const cloudinaryUploadPromises = filesPath.map(async (imagePath) => {
            try {
              const result = await cloudinary.uploader.upload(imagePath);
              return result.url;
            } catch (e) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.ERROR_CLOUDINARY,
                502,
              );
            }
          });

          // Esperar a que todas las imágenes se suban
          const cloudinaryUrls = await Promise.all(cloudinaryUploadPromises);

          const productFound = await productRepository.findById(pid);
          const existingImages = productFound.thumbnails || [];

          const allImages = existingImages.concat(cloudinaryUrls);

          await productRepository.updateOne(pid, { thumbnails: allImages });

          const removeImages = filesPath.map(async (imagePath) => {
            return await fs.unlink(imagePath);
          });

          await Promise.all(removeImages);

          const updatedImages = await productRepository.findById(pid);

          return res
            .status(200)
            .json({ status: "Updated Images", payload: updatedImages });
        } else {
          CustomError.generateError(
            ErrorsMessages.FORBIDDEN,
            ErrorsNames.PERMISSION_DENIED,
            403,
          );
        }
      }
    } catch (e) {
      next(e);
    }
  };

  delImgByProductId = async (req, res, next) => {
    const { status } = req.user;
    const { pid } = req.params;
    const userRole = req.user.role;
    const imageUrlToDelete = req.body.imageUrl;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const products = await productRepository.findAll();
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
        }

        const foundProduct = await productRepository.findById(pid);
        const roleOwner = foundProduct.owner.find((item) => item.idUser);

        if (
          userRole === "admin" ||
          (userRole === "premium" && roleOwner.role === "premium")
        ) {
          const existingImages = foundProduct.thumbnails || [];

          // Verificar si la imagen a eliminar existe en las imágenes existentes
          const indexToRemove = existingImages.indexOf(imageUrlToDelete);
          if (indexToRemove === -1) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.IMAGE_NOT_FOUND,
              404,
            );
          }

          // Eliminar la imagen de Cloudinary
          const publicId = cloudinary
            .url(imageUrlToDelete)
            .split("/")
            .pop()
            .split(".")[0];

          await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
          });

          // Eliminar la imagen del array de thumbnails
          existingImages.splice(indexToRemove, 1);

          await productRepository.updateOne(pid, {
            thumbnails: existingImages,
          });
          return res.status(200).json({
            status: "Deleted Image",
            message: "Image successfully deleted",
          });
        } else if (userRole === "premium" && roleOwner.role === "admin") {
          CustomError.generateError(
            ErrorsMessages.FORBIDDEN,
            ErrorsNames.PERMISSION_DENIED,
            403,
          );
        }
      }
    } catch (e) {
      next(e);
    }
  };

  delProdById = async (req, res, next) => {
    const { pid } = req.params;
    const userRole = req.user.role;
    const { status } = req.user;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const products = await productRepository.findAll();
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
        }

        const foundProduct = await productRepository.findById(pid);
        const roleOwner = foundProduct.owner.find((item) => item.idUser);

        if (
          userRole === "admin" ||
          (userRole === "premium" && roleOwner.role === "premium")
        ) {
          const imageUrlsToDelete = foundProduct.thumbnails || [];

          for (const imageUrlToDelete of imageUrlsToDelete) {
            const publicId = cloudinary
              .url(imageUrlToDelete)
              .split("/")
              .pop()
              .split(".")[0];

            await cloudinary.uploader.destroy(publicId, {
              invalidate: true,
            });
          }

          if (
            (userRole === "premium" && roleOwner.role === "premium") ||
            (userRole === "admin" && roleOwner.role === "premium")
          ) {
            const foundUserInfo = await userRepository.findById({
              _id: roleOwner.idUser,
            });

            const emailBody = `
            <html>
                 <head>
                   <meta charset="utf-8">
                 </head>
                 <body>
                  <p>Hola ${foundUserInfo.first_name},</p><br>
                  <p>Se le notifica que se ha eliminado un producto de su lista de productos</p>
                 </body>
               </html>
             `;
            const mailOptions = {
              from: "crapz0190",
              to: foundUserInfo.email,
              subject: "Notificación de eliminación de un producto",
              html: emailBody,
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                CustomError.generateError(
                  ErrorsMessages.INTERNAL_SERVER_ERROR,
                  ErrorsNames.SEND_EMAIL,
                  500,
                );
              }
            });
          }

          await productRepository.deleteOne(pid);

          return res.status(200).json({
            status: "Removed Product",
            message: "The product has been successfully removed",
          });
        } else if (userRole === "premium" && roleOwner.role === "admin") {
          CustomError.generateError(
            ErrorsMessages.FORBIDDEN,
            ErrorsNames.PERMISSION_DENIED,
            403,
          );
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export const productCtrl = new ProductsControllers();
