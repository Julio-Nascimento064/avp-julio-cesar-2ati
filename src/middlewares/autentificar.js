export function autorizar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : authorization;

  if (token !== process.env.TOKEN) {
    return res.status(401).json({ mensagem: "Token ausente ou inválido" });
  }

  next();
}