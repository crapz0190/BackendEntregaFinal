# PROYECTO FINAL BACKEND

![](https://devcamp.es/wp-content/uploads/2022/12/MicrosoftTeams-image-150.png)

![](https://img.shields.io/github/stars/pandao/editor.md.svg) ![](https://img.shields.io/github/forks/pandao/editor.md.svg) ![](https://img.shields.io/github/tag/pandao/editor.md.svg) ![](https://img.shields.io/github/release/pandao/editor.md.svg) ![](https://img.shields.io/github/issues/pandao/editor.md.svg) ![](https://img.shields.io/bower/v/editor.md.svg)

# Versión nodejs
> NodeJS v20.11.0

# Instalar paquetes npm
> npm install o npm i

# Scripts

> Nota: No se utiliza dotenv para variables de entorno, se utiliza la configuración propuesta desde la actualización de nodejs v20.6.0

- [x] **`<Link>`** https://nodejs.org/en/blog/release/v20.6.0

### npm run start:dev
> Corre el proyecto en modo desarrollo

### npm run start:prod
> Corre el proyecto en modo producción

### npm run start:test
> Corre el proyecto en modo test

### npm run test
> Permite realizar las pruebas




# Rutas

## Rutas de productos

> Nota: la carga máxima de imágenes es de 6, por creación de producto o actualización del mismo

+ **`Ruta GET` de visualización de todos los productos**
  - [x] **`<Link>`** http://localhost:8080/api/products

+ **`Ruta GET` de visualización de un producto por su id**
  - [x] **`<Link>`** http://localhost:8080/api/products/:pid

+ **`Ruta POST` para de carga de productos**
  - [x] **`<Link>`** http://localhost:8080/api/products/add

+ **`Ruta PUT` de actualización de un producto por su id**
  - [x] **`<Link>`** http://localhost:8080/api/products/:pid

+ **`Ruta PUT` de actualización de images por id del producto**
  - [x] **`<Link>`** http://localhost:8080/api/products/:pid/add-images

+ **`Ruta DELETE` de eliminación de una imagen por id del producto**
  - [x] **`<Link>`** http://localhost:8080/api/products/:pid/delete-image

+ **`Ruta DELETE` de eliminación de un producto por su id**
  - [x] **`<Link>`** http://localhost:8080/api/products/:pid

## Rutas de usuarios

+ **`Ruta GET` de acceso al dashboard**
  - [x] **`<Link>`** http://localhost:8080/api/users/current

+ **`Ruta POST` para registro de usuario**
  - [x] **`<Link>`** http://localhost:8080/api/users/signup

+ **`Ruta POST` para login de usuario**
  - [x] **`<Link>`** http://localhost:8080/api/users/login

+ **`Ruta POST` para finalizar sesión**
  - [x] **`<Link>`** http://localhost:8080/api/users/logout

+ **`Ruta POST` de verificación de email para validar cuenta con envío de token**
  - [x] **`<Link>`** http://localhost:8080/api/users/verify-account

+ **`Ruta PUT` de recepción de token para validación de cuenta**
  - [x] **`<Link>`** http://localhost:8080/api/users/verified-account/:token

+ **`Ruta POST` de verificación de email para validar cuenta con envío de token para restablecer contraseña**
  - [x] **`<Link>`** http://localhost:8080/api/users/forgot-password

+ **`Ruta PUT` de recepción de token para restablecer la contraseña**
  - [x] **`<Link>`** http://localhost:8080/api/users/reset-password/:token

+ **`Ruta GET` para iniciar sesión o registrarse con GitHub**
  - [x] **`<Link>`** http://localhost:8080/api/users/auth/github

+ **`Ruta GET` para redireccionar al dashboard desde GitHub**
  - [x] **`<Link>`** http://localhost:8080/api/users/callback
