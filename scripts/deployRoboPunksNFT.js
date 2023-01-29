const hre = require("hardhat");

async function main() {

  const RoboPunksNFT = await hre.ethers.getContractFactory("RoboPunksNFT");
  const roboPunksNFT = await RoboPunksNFT.deploy();

  await roboPunksNFT.deployed();

  //await roboPunksNFT.setBaseTokenUri("ipfs://QmcKJPczz8mavF7UKzvdwKS9nsHkXntmv85qQhYCw5aMmx/");
  // ou posso simplesmente editar esse campo no site do contrato no etherscan
  // ou no REMIX
  
  console.log("RoboPunksNFT deployed to:", roboPunksNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
