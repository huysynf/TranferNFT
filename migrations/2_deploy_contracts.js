const KryptoPerson = artifacts.require("KryptoPerson");

module.exports = function(deployer) {
    deployer.deploy(KryptoPerson);
};
