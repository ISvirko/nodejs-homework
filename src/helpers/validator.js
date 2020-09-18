exports.validator = function validate(scheme) {
  return (req, res, next) => {
    const validationResult = scheme.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .send({ message: validationResult.error.details[0].message });
    }
    next();
  };
};
