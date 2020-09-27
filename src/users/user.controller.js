const CurrentUserModel = require("./user.model");

exports.getCurrentUser = (req, res, next) => {
  const { email, subscription } = req.user;

  res.status(201).send({ email, subscription });
};

exports.updateSubscription = async (req, res, next) => {
  try {
    const { email } = req.user;

    const updatedUserSubsc = await CurrentUserModel.findOneAndUpdate(
      { email },
      req.body,
      { new: true }
    );

    return res.status(200).send(updatedUserSubsc);
  } catch (error) {
    next(error);
  }
};

exports.checkSubscriptionOption = async (req, res, next) => {
  const { subscription } = req.body;

  const options = CurrentUserModel.schema.path("subscription").enumValues;

  if (!options.find((option) => option === subscription)) {
    return res.status(404).send("Invalid subscription option");
  }

  next();
};
