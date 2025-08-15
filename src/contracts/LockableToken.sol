// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LockableToken is ERC20, Ownable, ReentrancyGuard {
    
    // Struct to store lock information for each user
    struct TokenLock {
        uint256 amount;        // Amount of tokens locked
        uint256 unlockTime;    // Timestamp when tokens can be unlocked
        bool exists;           // Flag to check if lock exists
    }
    
    // Mapping from user address to their token locks
    mapping(address => TokenLock[]) public tokenLocks;
    
    // Events
    event TokensLocked(
        address indexed user, 
        uint256 amount, 
        uint256 unlockTime,
        uint256 lockIndex
    );
    
    event TokensUnlocked(
        address indexed user, 
        uint256 amount,
        uint256 lockIndex
    );
    
    // Constructor - creates initial supply and assigns to deployer
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) ReentrancyGuard() {
        _mint(msg.sender, initialSupply * 10**decimals());
    }
    
    /**
     * @dev Lock tokens for a specific period
     * @param amount Amount of tokens to lock
     * @param lockDuration Duration in seconds to lock tokens
     */
    function lockTokens(uint256 amount, uint256 lockDuration) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(lockDuration > 0, "Lock duration must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Calculate unlock time
        uint256 unlockTime = block.timestamp + lockDuration;
        
        // Transfer tokens from user to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create lock entry
        TokenLock memory newLock = TokenLock({
            amount: amount,
            unlockTime: unlockTime,
            exists: true
        });
        
        tokenLocks[msg.sender].push(newLock);
        
        emit TokensLocked(msg.sender, amount, unlockTime, tokenLocks[msg.sender].length - 1);
    }
    
    /**
     * @dev Unlock tokens after lock period expires
     * @param lockIndex Index of the lock to unlock
     */
    function unlockTokens(uint256 lockIndex) external nonReentrant {
        require(lockIndex < tokenLocks[msg.sender].length, "Invalid lock index");
        
        TokenLock storage lock = tokenLocks[msg.sender][lockIndex];
        require(lock.exists, "Lock does not exist");
        require(block.timestamp >= lock.unlockTime, "Tokens are still locked");
        require(lock.amount > 0, "No tokens to unlock");
        
        uint256 amount = lock.amount;
        
        // Mark lock as used
        lock.amount = 0;
        lock.exists = false;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnlocked(msg.sender, amount, lockIndex);
    }
    
    /**
     * @dev Get the number of locks for a user
     * @param user Address of the user
     * @return Number of locks
     */
    function getLockCount(address user) external view returns (uint256) {
        return tokenLocks[user].length;
    }
    
    /**
     * @dev Get lock information for a specific user and lock index
     * @param user Address of the user
     * @param lockIndex Index of the lock
     * @return amount Amount of locked tokens
     * @return unlockTime Timestamp when tokens can be unlocked
     * @return exists Whether the lock exists/is active
     */
    function getLockInfo(address user, uint256 lockIndex) 
        external 
        view 
        returns (uint256 amount, uint256 unlockTime, bool exists) 
    {
        require(lockIndex < tokenLocks[user].length, "Invalid lock index");
        
        TokenLock storage lock = tokenLocks[user][lockIndex];
        return (lock.amount, lock.unlockTime, lock.exists);
    }
    
    /**
     * @dev Get all active locks for a user
     * @param user Address of the user
     * @return amounts Array of locked amounts
     * @return unlockTimes Array of unlock timestamps
     * @return indexes Array of lock indexes
     */
    function getActiveLocks(address user) 
        external 
        view 
        returns (
            uint256[] memory amounts, 
            uint256[] memory unlockTimes,
            uint256[] memory indexes
        ) 
    {
        uint256 lockCount = tokenLocks[user].length;
        uint256 activeCount = 0;
        
        // Count active locks
        for (uint256 i = 0; i < lockCount; i++) {
            if (tokenLocks[user][i].exists && tokenLocks[user][i].amount > 0) {
                activeCount++;
            }
        }
        
        // Create arrays for active locks
        amounts = new uint256[](activeCount);
        unlockTimes = new uint256[](activeCount);
        indexes = new uint256[](activeCount);
        
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < lockCount; i++) {
            if (tokenLocks[user][i].exists && tokenLocks[user][i].amount > 0) {
                amounts[currentIndex] = tokenLocks[user][i].amount;
                unlockTimes[currentIndex] = tokenLocks[user][i].unlockTime;
                indexes[currentIndex] = i;
                currentIndex++;
            }
        }
    }
    
    /**
     * @dev Get total locked tokens for a user
     * @param user Address of the user
     * @return Total amount of locked tokens
     */
    function getTotalLockedTokens(address user) external view returns (uint256) {
        uint256 totalLocked = 0;
        uint256 lockCount = tokenLocks[user].length;
        
        for (uint256 i = 0; i < lockCount; i++) {
            if (tokenLocks[user][i].exists) {
                totalLocked += tokenLocks[user][i].amount;
            }
        }
        
        return totalLocked;
    }
    
    /**
     * @dev Check if tokens can be unlocked
     * @param user Address of the user
     * @param lockIndex Index of the lock
     * @return Whether tokens can be unlocked
     */
    function canUnlock(address user, uint256 lockIndex) external view returns (bool) {
        if (lockIndex >= tokenLocks[user].length) {
            return false;
        }
        
        TokenLock storage lock = tokenLocks[user][lockIndex];
        return lock.exists && lock.amount > 0 && block.timestamp >= lock.unlockTime;
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Override transfer to prevent transferring locked tokens
     * This ensures users can't transfer more than their available balance
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        uint256 availableBalance = getAvailableBalance(msg.sender);
        require(amount <= availableBalance, "Transfer amount exceeds available balance");
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Override transferFrom to prevent transferring locked tokens
     */
    function transferFrom(address from, address to, uint256 amount) 
        public 
        override 
        returns (bool) 
    {
        uint256 availableBalance = getAvailableBalance(from);
        require(amount <= availableBalance, "Transfer amount exceeds available balance");
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Get available balance (total balance minus locked tokens)
     * @param user Address of the user
     * @return Available balance
     */
    function getAvailableBalance(address user) public view returns (uint256) {
        uint256 totalBalance = balanceOf(user);
        uint256 totalLocked = this.getTotalLockedTokens(user);
        
        if (totalLocked >= totalBalance) {
            return 0;
        }
        
        return totalBalance - totalLocked;
    }
}
