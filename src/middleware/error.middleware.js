export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    if(err.code === "P2002"){
       return res.status(400).json({ error: 'Duplicate field value entered' });
    }

    if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

   // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
}

export const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
};