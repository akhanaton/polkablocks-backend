function isHex(h) {
  const a = parseInt(h, 16);
  return a.toString(16) === h;
}

module.exports = { isHex };
