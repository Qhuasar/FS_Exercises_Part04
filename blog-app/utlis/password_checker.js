const checkPassword = (pw, next) => {
  try {
    if (!pw) {
      const validationError = new Error('Missing password');
      validationError.name = 'ValidationError';
      throw validationError;
    } else if (pw.length <= 3) {
      const validationError = new Error(
        'Password must be atleast 3 characters long',
      );
      validationError.name = 'ValidationError';
      throw validationError;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { checkPassword };
