const validate = (schema, source = "body") => async (req, res, next) => {
  try {
    const parsedData = await schema.parseAsync(req[source]);
    req[source] = parsedData;
    next();
  } catch (error) {
    const status = 422;
    const message = "Validation failed";

    // 🔥 IMPORTANT FIX
    const extraDetails =
      error.issues?.map((issue) => ({
        field: issue.path.join("."), // kon field
        message: issue.message,      // ki problem
      })) || [];

    return next({ status, message, extraDetails });
  }
};

module.exports = validate;