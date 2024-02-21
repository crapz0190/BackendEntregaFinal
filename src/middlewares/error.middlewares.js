export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.code;
  let errorMessage = err.message;
  let errName = err.name;
  // console.log("statusCode", statusCode);
  // console.log("errorMessage", errorMessage);

  switch (statusCode) {
    case 400:
      return message(statusCode, errorMessage, errName);
    case 401:
      return message(statusCode, errorMessage, errName);
    case 403:
      return message(statusCode, errorMessage, errName);
    case 404:
      return message(statusCode, errorMessage, errName);
    case 409:
      return message(statusCode, errorMessage, errName);
    case 500:
      return message(statusCode, errorMessage, errName);
    case 502:
      return message(statusCode, errorMessage, errName);
  }

  function message(code, messageError, nameError) {
    res.status(code).json({
      error: {
        status: code,
        message: messageError,
        name: nameError,
      },
    });
  }
};
