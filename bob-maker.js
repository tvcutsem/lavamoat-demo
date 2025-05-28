// load the right module under /bob based on the attack type

function selectAttackModule(attack) {
  switch (attack) {
    case "proto-poisoning":
      return "./bob/bob-proto-poisoning.js";
    case "api-poisoning":
      return "./bob/bob-api-poisoning.js";
    case "leak-mutable-state":
      return "./bob/bob-leak-mutable-state.js";
    case "excess-authority":
      return "./bob/bob-excess-authority.js";
    default:
      return "./bob/bob-no-attack.js";
  }
}

module.exports = function setup(attack) {
  return require(selectAttackModule(attack));
}