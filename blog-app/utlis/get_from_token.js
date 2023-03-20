const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("bearer ")) {
    return authorization.replace("bearer ", "");
  }
  return null;
};

module.exports = { getTokenFrom };
