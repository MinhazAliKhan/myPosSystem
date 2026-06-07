const errorMiddleware = (err, req, res, next) => {
  const status = err.status >= 400 ? err.status : 500;
  const message = err.message || "Something went wrong";
  const extra = err.extraDetails || [];

  return res.status(status).json({
    success: false,
    status,
    message,
    extra,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};
module.exports = errorMiddleware;