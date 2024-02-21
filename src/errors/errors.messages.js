export const ErrorsMessages = {
  BAD_REQUEST: "Bad Request: The request is incorrect or badly formatted",
  UNAUTHORIZED: "Unauthorized: You are not authorized to access this resource",
  FORBIDDEN:
    "Forbidden: You do not have the necessary permissions to access this resource",
  NOT_FOUND: "Not Found: The requested resource was not found'",
  METHOD_NOT_ALLOWED:
    "The server knows about the requested method, but it has been disabled and cannot be used",
  CONFLICT:
    "This response can be sent when a request conflicts with the current state of the server",
  INTERNAL_SERVER_ERROR:
    "Internal Server Error: The server encountered an unexpected condition that prevented it from fulfilling the request",
  BAD_GATEWAY:
    "This error response means that the server, while working as a gateway to obtain a response necessary to handle the request, received an invalid response",
};

export const ErrorsNames = {
  SYNTAX_ERROR:
    "Syntax error that causes an undefined type error or the information is not being returned or syntax error when performing a comparison",
  NOT_PRODUCTS: "There are not products to show",
  PRODUCT_NOT_FOUND:
    "The product with the specified ID was not found in the database",
  REPEAT_PRODUCT: "The product is repeated",
  CODE_ERROR: "Sixtaxis error in the code",
  LOADING_ERROR: "User data exists in the database",
  USER_NOT_FOUND: "The user is not registered in the database",
  USER_ERROR_PASSWORD: "Incorrect password",
  REQUIRED_FIELDS: "All fields are required",
  AUTHENTICATE: "Confirmation is required to obtain the requested response",
  SEND_EMAIL: "Error sending email",
  VERIFIED_ACCOUNT: "The account has already been verified",
  ERROR_EMAIL: "An error occurred while trying to send the message",
  SAME_PASSWORD: "You cannot use the same current password",
  NO_MATCH_PWD: "Passwords do not match",
  ERROR_CLOUDINARY: "Error when uploading images to cloudinary",
  PERMISSION_DENIED: "You don't have permission to delete this product",
  IMAGE_NOT_FOUND: "The requested image was not found",
  NOT_CARTS: "There are not carts to show",
  CART_NOT_FOUND:
    "The cart with the specified ID was not found in the database",
  UNASSIGNED_CART: "the user does not have an assigned cart",
  TOKEN_ERROR: "The query token was not found",
  EXISTING_EMAIL: "The email is already in use",
  FAIL_UPLOAD: "the user has not finished processing their documentatio",
};
