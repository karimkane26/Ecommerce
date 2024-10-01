const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);  // Passe l'erreur au middleware suivant sans envoyer de réponse ici
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);  // Si les en-têtes sont déjà envoyés, passe au prochain middleware
  }

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Check for Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? 'cool' : err.stack,
  });
};

export {notFound,errorHandler};