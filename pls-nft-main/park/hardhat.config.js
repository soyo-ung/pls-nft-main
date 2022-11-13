require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
      development: {
        url: "http://localhost:8545",
        chainId: 1337
    },
    rinkeby:{
      url:"https://eth-rinkeby.alchemyapi.io/v2/a1Z09WdnuwQ_prTm6URLWLCRZkkGaBZq",
      accounts: ["977d7569b53ce206cb2d709d87e7d48dec4a9722c90f45b3b0e7762399da9ca6"]
    }
    },
    namedAccounts: {
      deployer: {
       development: 0,
       rinkeby: "0xf72915BDe0eFf604F38df1D8246aDBe4c3Aa29f4"
      }
    },
    etherscan: {
      apiKey: "D241KJBARHIIKC9XKTM7AAV2NJVXMEJ3F3"
    },
};
