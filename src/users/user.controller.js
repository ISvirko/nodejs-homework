const CurrentUserModel = require("./user.model");

exports.getCurrentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(201).send({ email, subscription });
  } catch (error) {
    next(error);
  }
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
  try {
    const { subscription } = req.body;

    const options = await CurrentUserModel.schema.path("subscription")
      .enumValues;

    if (!options.find((option) => option === subscription)) {
      return res.status(404).send("Invalid subscription option");
    }

    next();
  } catch (error) {
    next(error);
  }
};
