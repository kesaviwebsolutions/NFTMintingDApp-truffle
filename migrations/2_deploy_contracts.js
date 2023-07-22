const MyNFT = artifacts.require("PondNFT");

module.exports = function (deployer) {
  deployer.deploy(PondNFT, "Duck Race Derby Pond", "DRDP", "https://salmon-electric-marmot-594.mypinata.cloud/ipfs/QmasNQLJSF1c2wVA2o5cRhDpQXVX1H9gbsKsnsVnhtiD6e/");
};
