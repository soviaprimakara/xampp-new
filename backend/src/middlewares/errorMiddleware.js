// Middleware untuk endpoint yang tidak ditemukan (404)
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
  });
};

// Centralized Error Handler (500 / error format standar)
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Tangani error Mongoose: CastError (ID tidak valid)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Format ID tidak valid: ${err.value}`;
  }

  // Tangani error Mongoose: Duplicate Key (11000)
  if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${duplicatedField} sudah terdaftar, silakan gunakan nilai lain`;
  }

  // Tangani error Mongoose: ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Tangani error JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token autentikasi tidak valid';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token autentikasi telah kedaluwarsa';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };

