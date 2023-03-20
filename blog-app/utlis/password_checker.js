const checkPassword = (pw, next) => {
  try {
    if (!pw) {
      let validationError = new Error("Missing password");
      validationError.name = "ValidationError";
      throw validationError;
    } else if (pw.length <= 3) {
      let validationError = new Error(
        "Password must be atleast 3 characters long"
      );
      validationError.name = "ValidationError";
      throw validationError;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { checkPassword };
