const hre = require("hardhat");

async function main() {
  console.log("Deploying LockableToken contract...");

  // Get the ContractFactory and Signers here.
  const LockableToken = await hre.ethers.getContractFactory("LockableToken");
  
  // Deploy the contract with constructor parameters
  const tokenName = "Vesta Token";
  const tokenSymbol = "VESTA";
  const initialSupply = 1000000; // 1 million tokens
  
  const token = await LockableToken.deploy(tokenName, tokenSymbol, initialSupply);
  
  await token.waitForDeployment();
  
  const contractAddress = await token.getAddress();
  
  console.log("LockableToken deployed to:", contractAddress);
  console.log("Token name:", await token.name());
  console.log("Token symbol:", await token.symbol());
  console.log("Total supply:", (await token.totalSupply()).toString());
  console.log("Initial supply (with decimals):", (initialSupply * 10**18).toString());
  
  // Verify the contract on Etherscan (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await token.deploymentTransaction().wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [tokenName, tokenSymbol, initialSupply],
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