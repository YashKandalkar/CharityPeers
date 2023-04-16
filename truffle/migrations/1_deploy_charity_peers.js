const CharityPeers = artifacts.require("CharityPeers");

module.exports = function (deployer) {
  deployer.deploy(CharityPeers);
};
