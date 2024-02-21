import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";
import { v4 as uuidv4 } from "uuid";
import { transporter } from "../utils/nodemailer.js";
import { env } from "../utils/config.js";
import { hashData, compareData } from "../utils/config.js";
import { userRepository } from "../services/repository/users.repository.js";

class UsersControllers {
  saveUserDocument = async (req, res, next) => {
    const { status } = req.user;
    const { uid } = req.params;
    const { dni, address, bank } = req.files;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else if (!dni || !address || !bank) {
        CustomError.generateError(
          ErrorsMessages.BAD_REQUEST,
          ErrorsNames.FAIL_UPLOAD,
          401,
        );
      } else {
        const saveUsersDocuments = await userRepository.saveDocuments(uid, {
          documents: [
            {
              name: "dni",
              reference: dni[0].path,
            },
            {
              name: "address",
              reference: address[0].path,
            },
            {
              name: "bank",
              reference: bank[0].path,
            },
          ],
        });

        return res
          .status(201)
          .json({ status: "uploaded documents", payload: saveUsersDocuments });
      }
    } catch (e) {
      next(e);
    }
  };

  userRolePremium = async (req, res, next) => {
    const { status } = req.user;
    const { uid } = req.params;

    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const allUsersDB = await userRepository.findAll();
        if (allUsersDB === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        }
        const idUser = allUsersDB.map((item) => item._id);
        const indexUserId = idUser.findIndex((item) => item.toString() === uid);

        if (indexUserId === -1) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.PRODUCT_NOT_FOUND,
            404,
          );
        }

        const user = await userRepository.findById(uid);

        user.role = "premium";
        await user.save();

        return res.status(200).json({
          status: "success",
          message: "User role updated successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  };

  accountClousureVerified = async (req, res, next) => {
    const { email } = req.user;

    try {
      const user = await userRepository.findByEmail({ email });

      const EXPIRATION_TIME = Date.now() + 3600000; //3600000
      user.tokenExpirationClosure = EXPIRATION_TIME;
      await user.save();

      const emailBody = `
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body>
            <p>Se ha dado el inicio de cierre de su cuenta, para desestimar tal acción, deberá solo iniciar sesión nuevamente dentro del período de 30 días, pasado ese lapso de tiempo la cuenta quedará eliminada de la base de datos de forma permanente.</p>
          </body>
        </html>
      `;
      const mailOptions = {
        from: "crapz0190",
        to: email,
        subject: "Cierre de cuenta",
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
        res.status(200).json({ message: "Verification email sent" });
      });
    } catch (e) {
      next(e);
    }
  };

  registerUser = async (req, res, next) => {
    try {
      const { user } = req;
      res.status(201).json({ status: "Created user", payload: user });
    } catch (e) {
      next(e);
    }
  };

  loginUser = async (req, res, next) => {
    const { user } = req;

    try {
      const userStatus = await userRepository.findByEmail({
        email: user.email,
      });

      if (!userStatus.status) {
        CustomError.generateError(
          ErrorsMessages.UNAUTHORIZED,
          ErrorsNames.AUTHENTICATE,
          401,
        );
      } else {
        res.status(200).json({ status: "Login", payload: user });
      }
    } catch (e) {
      next(e);
    }
  };

  logout = (req, res, next) => {
    const { status } = req.user;
    try {
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        res.cookie("token", "", { expires: new Date(0) });
        return res.status(204).json({ status: "Session ended" });
      }
    } catch (e) {
      next(e);
    }
  };

  verifyAccount = async (req, res, next) => {
    const { email } = req.user;

    try {
      const user = await userRepository.findByEmail({ email });

      const tokenStatus = uuidv4();
      user.tokenStatus = tokenStatus;
      await user.save();

      const activationLink = `${env.URL}:${env.PORT_FRONT}/users/verified-account/${tokenStatus}`;

      const emailBody = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              .button {
                display: inline-block;
                text-decoration: none;
                border: none;
              }
            </style>
          </head>
          <body>
            <p>Haz clic en el siguiente enlace para activar tu cuenta: <a class="button" href="${activationLink}">activate account</a></p>
          </body>
        </html>
      `;
      const mailOptions = {
        from: "crapz0190",
        to: email,
        subject: "Mensaje de activación de cuenta",
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
        res.status(200).json({ message: "Verification email sent" });
      });
    } catch (e) {
      next(e);
    }
  };

  verifiedAccount = async (req, res, next) => {
    const { token } = req.params;

    try {
      const user = await userRepository.findToken({ tokenStatus: token });

      if (!user) {
        CustomError.generateError(
          ErrorsMessages.NOT_FOUND,
          ErrorsNames.TOKEN_ERROR,
          404,
        );
      }

      user.status = true;
      user.tokenStatus = null;
      await user.save();

      res.status(200).json({ message: "Account verified successfully" });
    } catch (e) {
      next(e);
    }
  };

  emailRestorePass = async (req, res, next) => {
    const { email } = req.body;
    const EXPIRATION_TIME = Date.now() + 3600000; // 1 hora de duración

    try {
      const user = await userRepository.findByEmail({ email });
      if (user === null) {
        CustomError.generateError(
          ErrorsMessages.NOT_FOUND,
          ErrorsNames.ERROR_EMAIL,
          400,
        );
      } else {
        if (user.status === false) {
          CustomError.generateError(
            ErrorsMessages.FORBIDDEN,
            ErrorsNames.AUTHENTICATE,
            403,
          );
        } else {
          const resetToken = uuidv4();
          user.resetToken = resetToken;
          user.resetTokenExpiration = EXPIRATION_TIME;
          await user.save();

          const resetLink = `${env.URL}:${env.PORT_FRONT}/users/${user._id}/recover-password/${resetToken}`;
          const emailBody = `
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                .button {
                  display: inline-block;
                  text-decoration: none;
                  border: none;
                }
              </style>
            </head>
            <body>
              <p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a class="button" href="${resetLink}">Reset password</a></p>
            </body>
          </html>
        `;
          const mailOptions = {
            from: "crapz0190",
            to: email,
            subject: "Mensaje de recuperación de contraseña",
            html: emailBody,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              CustomError.generateError(
                ErrorsMessages.BAD_GATEWAY,
                ErrorsNames.ERROR_EMAIL,
                502,
              );
            }
            res.status(201).json({ message: "Password recovery message sent" });
          });
        }
      }
    } catch (e) {
      next(e);
    }
  };

  resetPasswordToken = async (req, res, next) => {
    const { uid, token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    try {
      const users = await userRepository.findAll();

      if (users === undefined) {
        CustomError.generateError(
          ErrorsMessages.BAD_GATEWAY,
          ErrorsNames.SYNTAX_ERROR,
          502,
        );
      } else {
        const idUsers = users.map((item) => item._id);
        const indexUserId = idUsers.findIndex(
          (item) => item.toString() === uid,
        );

        if (indexUserId === -1) {
          CustomError.generateError(
            ErrorsMessages.NOT_FOUND,
            ErrorsNames.USER_NOT_FOUND,
            404,
          );
        } else {
          const user = await userRepository.findToken({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
          });

          if (!user) {
            CustomError.generateError(
              ErrorsMessages.NOT_FOUND,
              ErrorsNames.TOKEN_ERROR,
              404,
            );
          } else {
            if (newPassword === confirmPassword) {
              const verifyPass = await compareData(newPassword, user.password);

              if (!verifyPass) {
                const hashPassword = await hashData(newPassword);

                user.password = hashPassword;
                user.resetToken = null;
                user.resetTokenExpiration = null;
                await user.save();
                return res.status(205).json({ message: "Password updated" });
              } else {
                CustomError.generateError(
                  ErrorsMessages.BAD_REQUEST,
                  ErrorsNames.SAME_PASSWORD,
                  400,
                );
              }
            } else {
              CustomError.generateError(
                ErrorsMessages.BAD_REQUEST,
                ErrorsNames.NO_MATCH_PWD,
                400,
              );
            }
          }
        }
      }
    } catch (e) {
      next(e);
    }
  };

  currentUser = async (req, res, next) => {
    try {
      const { status } = req.user;
      if (status === false) {
        CustomError.generateError(
          ErrorsMessages.FORBIDDEN,
          ErrorsNames.AUTHENTICATE,
          403,
        );
      } else {
        const users = await userRepository.findAll();

        const objUsers = users.map((item) => ({
          id: item._id,
          name: item.first_name,
          surname: item.last_name,
          email: item.email,
          status: item.status,
          role: item.role,
          documents: item.documents,
        }));

        res.json({ status: "All users", payload: objUsers });
      }
    } catch (e) {
      next(e);
    }
  };
}

export const userCtrl = new UsersControllers();
