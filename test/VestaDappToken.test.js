const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VestaDappToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const VestaDappToken = await ethers.getContractFactory("VestaDappToken");
    token = await VestaDappToken.deploy();
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Should have correct token details", async function () {
      expect(await token.name()).to.equal("Vesta Dapp Token");
      expect(await token.symbol()).to.equal("VDT");
      expect(await token.decimals()).to.equal(18);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 1000);
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(1000);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds available balance");
    });
  });

  describe("Token Locking", function () {
    beforeEach(async function () {
      // Transfer some tokens to addr1 for testing
      await token.transfer(addr1.address, 10000);
    });

    it("Should lock tokens successfully", async function () {
      const lockAmount = 1000;
      const lockDuration = 3600; // 1 hour

      await token.connect(addr1).lockTokens(lockAmount, lockDuration);

      const lockedBalance = await token.getLockedBalance(addr1.address);
      expect(lockedBalance).to.equal(lockAmount);

      const availableBalance = await token.getAvailableBalance(addr1.address);
      expect(availableBalance).to.equal(9000);
    });

    it("Should prevent transfer of locked tokens", async function () {
      const lockAmount = 5000;
      const lockDuration = 3600;

      await token.connect(addr1).lockTokens(lockAmount, lockDuration);

      // Should fail to transfer more than available balance
      await expect(
        token.connect(addr1).transfer(addr2.address, 6000)
      ).to.be.revertedWith("ERC20: transfer amount exceeds available balance");
    });

    it("Should unlock tokens after lock period", async function () {
      const lockAmount = 1000;
      const lockDuration = 1; // 1 second

      await token.connect(addr1).lockTokens(lockAmount, lockDuration);

      // Wait for lock period to pass
      await new Promise(resolve => setTimeout(resolve, 1100));

      await token.connect(addr1).unlockTokens(0);

      const lockedBalance = await token.getLockedBalance(addr1.address);
      expect(lockedBalance).to.equal(0);
    });

    it("Should fail to unlock tokens before lock period", async function () {
      const lockAmount = 1000;
      const lockDuration = 3600; // 1 hour

      await token.connect(addr1).lockTokens(lockAmount, lockDuration);

      await expect(
        token.connect(addr1).unlockTokens(0)
      ).to.be.revertedWith("Tokens are still locked");
    });

    it("Should get correct lock info", async function () {
      const lockAmount = 1000;
      const lockDuration = 3600;

      await token.connect(addr1).lockTokens(lockAmount, lockDuration);

      const [amount, unlockTime, exists] = await token.getLockInfo(addr1.address, 0);
      expect(amount).to.equal(lockAmount);
      expect(exists).to.be.true;
    });
  });

  describe("Multiple Locks", function () {
    beforeEach(async function () {
      await token.transfer(addr1.address, 10000);
    });

    it("Should handle multiple locks", async function () {
      await token.connect(addr1).lockTokens(1000, 3600);
      await token.connect(addr1).lockTokens(2000, 7200);

      const lockCount = await token.getLockCount(addr1.address);
      expect(lockCount).to.equal(2);

      const lockedBalance = await token.getLockedBalance(addr1.address);
      expect(lockedBalance).to.equal(3000);
    });
  });
});