/**
 * @param {Number} amount Credits Amount to calculate
 */
module.exports.calculate = amount => {
  if (typeof amount != "number") throw new TypeError(`The param "amount" must be a typeof "Number". Received ${(typeof amount)}`);
  return {
    amount,
    tax: Math.floor(amount - (amount * 0.05))
  };
};
