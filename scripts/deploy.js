const hre = require("hardhat");

async function main() {
  console.log("Deploying VestaDappToken contract...");

  // Get the ContractFactory and Signers here.
  const VestaDappToken = await hre.ethers.getContractFactory("VestaDappToken");
  
  // Deploy the contract
  const token = await VestaDappToken.deploy();
  
  await token.waitForDeployment();
  
  const contractAddress = await token.getAddress();
  
  console.log("VestaDappToken deployed to:", contractAddress);
  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());
  console.log("Total supply:", (await token.totalSupply()).toString());
  
  // Verify the contract on Etherscan (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await token.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });