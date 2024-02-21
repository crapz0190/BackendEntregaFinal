import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { hashData, compareData } from "../utils/config.js";
import { env } from "../utils/config.js";
import { createAccessToken } from "../libs/jwt.js";
import { userRepository } from "../services/repository/users.repository.js";
import { cartRepository } from "../services/repository/carts.repository.js";
import CustomError from "../errors/errors.generator.js";
import { ErrorsMessages, ErrorsNames } from "../errors/errors.messages.js";

// SIGNUP
passport.use(
  "signup",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { res } = req;

      const { first_name, last_name } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return done(null, false, { message: "All fields are required" });
      }

      try {
        const verifyEmail = await userRepository.findByEmail({ email });

        if (verifyEmail === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        } else if (verifyEmail) {
          CustomError.generateError(
            ErrorsMessages.CONFLICT,
            ErrorsNames.LOADING_ERROR,
            400,
          );
        }

        const cart = await cartRepository.createOne();
        if (cart === undefined) {
          CustomError.generateError(
            ErrorsMessages.BAD_GATEWAY,
            ErrorsNames.SYNTAX_ERROR,
            502,
          );
        }

        const hashPassword = await hashData(password);
        const createdUser = await userRepository.createOne({
          ...req.body,
          password: hashPassword,
          cart: cart._id,
          // role: "admin",
        });

        const userDTO = {
          _id: createdUser._id,
          first_name: createdUser.first_name,
          last_name: createdUser.last_name,
          email: createdUser.email,
          status: createdUser.status,
          cart: createdUser.cart,
          role: createdUser.role,
        };

        const token = await createAccessToken({ _id: userDTO._id });
        res.cookie("token", token);

        return done(null, userDTO);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// LOGIN
passport.use(
  "login",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      const { res } = req;

      if (!email || !password) {
        return done(null, false, { message: "All fields are required" });
      }

      try {
        const user = await userRepository.findByEmail({ email });

        if (user && user.tokenExpirationClosure) {
          const tokenUser = await userRepository.findToken({
            tokenExpirationClosure: { $gt: Date.now() },
          });
          if (!tokenUser) {
            await userRepository.deleteOne({ _id: user._id });
            await cartRepository.deleteOne({ _id: user.cart });

            res.redirect("/api/users/login");
          } else {
            user.tokenExpirationClosure = null;
            await user.save();

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
            } else {
              const isMatch = await compareData(password, user.password);

              if (!isMatch) {
                CustomError.generateError(
                  ErrorsMessages.UNAUTHORIZED,
                  ErrorsNames.USER_ERROR_PASSWORD,
                  401,
                );
                return done(null, false, { message: "Incorrect password" });
              }
            }

            // actualizar last_connection al hacer login
            user.last_connection = new Date();
            await user.save();

            const userDTO = {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              status: user.status,
              cart: user.cart,
              role: user.role,
            };

            const token = await createAccessToken({ _id: userDTO._id });
            res.cookie("token", token);

            return done(null, userDTO);
          }
        } else {
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
          } else {
            const isMatch = await compareData(password, user.password);

            if (!isMatch) {
              CustomError.generateError(
                ErrorsMessages.UNAUTHORIZED,
                ErrorsNames.USER_ERROR_PASSWORD,
                401,
              );
              return done(null, false, { message: "Incorrect password" });
            }
          }

          // actualizar last_connection al hacer login
          user.last_connection = new Date();
          await user.save();

          const userDTO = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            status: user.status,
            cart: user.cart,
            role: user.role,
          };

          const token = await createAccessToken({ _id: userDTO._id });
          res.cookie("token", token);

          return done(null, userDTO);
        }
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// -------------- JWT ----------------
const fromCookies = (req) => {
  return req.cookies.token;
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
  secretOrKey: env.TOKEN_SECRET_JWT,
};

passport.use(
  "jwt",
  new JWTStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await userRepository.findById({ _id: jwt_payload._id });

      if (user === undefined) {
        CustomError.generateError(
          ErrorsMessages.BAD_GATEWAY,
          ErrorsNames.SYNTAX_ERROR,
          502,
        );
      }

      const userDTO = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        status: user.status,
        cart: user.cart,
        role: user.role,
      };

      return done(null, userDTO);
    } catch (error) {
      return done(error);
    }
  }),
);

// -------------- GitHub ----------------
passport.use(
  "github",
  new GitHubStrategy(
    {
      passReqToCallback: true,
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_CALLBACK_URL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      const { res } = req;
      try {
        const user = await userRepository.findByEmail({
          email: profile._json.email,
        });

        // // Login
        if (user) {
          if (user.isGithub) {
            const token = await createAccessToken({ id: user._id });
            res.cookie("token", token, { httpOnly: true });
            return done(null, user);
          } else {
            return done(null, false);
          }
        }

        const cart = await cartRepository.createOne();
        Signup;
        const infoUser = {
          first_name: profile._json.name.split(" ")[0],
          last_name: profile._json.name.split(" ")[1],
          email: profile._json.email,
          password: "",
          status: true,
          isGithub: true,
          cart: cart._id,
        };
        const createUser = await userRepository.createOne(infoUser);

        const token = await createAccessToken({ _id: createUser._id });
        res.cookie("token", token, { httpOnly: true });

        done(null, createUser);
      } catch (e) {
        done(e);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById({ id });
    done(null, user);
  } catch (e) {
    done(e);
  }
});
