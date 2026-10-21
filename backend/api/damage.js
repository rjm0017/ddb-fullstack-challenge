import validDamageTypes from "../utils/validDamageTypes.js";

function dealDamage(character, amount, type) {
  if (validDamageTypes.find(type)) {
    // damage calculation logic
    // check for immunity
    // check for resistance
    // check for temp hp
  } else {
    return null; // this return could be improved
  }
}

export { dealDamage };
