const Konomi = artifacts.require("Konomi");

module.exports = function (deployer) {
  deployer.deploy(Konomi);
};
