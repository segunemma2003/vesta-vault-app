// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract VestaDappToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Token locking functionality
    struct TokenLock {
        uint256 amount;
        uint256 unlockTime;
        bool exists;
    }
    
    mapping(address => TokenLock[]) private _locks;
    mapping(address => uint256) private _totalLocked;

    uint256 private _totalSupply;
    string public name;
    string public symbol;
    uint8 public decimals;
    address public owner;

    event TokensLocked(address indexed user, uint256 amount, uint256 unlockTime, uint256 lockIndex);
    event TokensUnlocked(address indexed user, uint256 amount, uint256 lockIndex);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        name = "Vesta Dapp Token";
        symbol = "VDT";
        decimals = 18;
        owner = msg.sender;
        _totalSupply = 1000000 * 10**decimals; // 1 million tokens
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        address from = msg.sender;
        _transfer(from, to, amount);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        address tokenOwner = msg.sender;
        _approve(tokenOwner, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = _balances[from];
        uint256 availableBalance = fromBalance - _totalLocked[from];
        require(availableBalance >= amount, "ERC20: transfer amount exceeds available balance");
        
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }

        emit Transfer(from, to, amount);
    }

    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
    }

    function _spendAllowance(address tokenOwner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(tokenOwner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(tokenOwner, spender, currentAllowance - amount);
            }
        }
    }

    // Token locking functions
    function lockTokens(uint256 amount, uint256 lockDurationInSeconds) external returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(lockDurationInSeconds > 0, "Lock duration must be greater than 0");
        
        uint256 availableBalance = _balances[msg.sender] - _totalLocked[msg.sender];
        require(availableBalance >= amount, "Insufficient available balance");

        uint256 unlockTime = block.timestamp + lockDurationInSeconds;
        
        _locks[msg.sender].push(TokenLock({
            amount: amount,
            unlockTime: unlockTime,
            exists: true
        }));

        _totalLocked[msg.sender] += amount;
        
        uint256 lockIndex = _locks[msg.sender].length - 1;
        emit TokensLocked(msg.sender, amount, unlockTime, lockIndex);
        
        return lockIndex;
    }

    function unlockTokens(uint256 lockIndex) external {
        require(lockIndex < _locks[msg.sender].length, "Invalid lock index");
        
        TokenLock storage lock = _locks[msg.sender][lockIndex];
        require(lock.exists, "Lock does not exist");
        require(block.timestamp >= lock.unlockTime, "Tokens are still locked");

        uint256 amount = lock.amount;
        _totalLocked[msg.sender] -= amount;
        
        lock.exists = false;
        lock.amount = 0;

        emit TokensUnlocked(msg.sender, amount, lockIndex);
    }

    function getLockedBalance(address account) external view returns (uint256) {
        return _totalLocked[account];
    }

    function getAvailableBalance(address account) external view returns (uint256) {
        return _balances[account] - _totalLocked[account];
    }

    function getLockInfo(address account, uint256 lockIndex) external view returns (uint256 amount, uint256 unlockTime, bool exists) {
        require(lockIndex < _locks[account].length, "Invalid lock index");
        
        TokenLock storage lock = _locks[account][lockIndex];
        return (lock.amount, lock.unlockTime, lock.exists);
    }

    function getLockCount(address account) external view returns (uint256) {
        return _locks[account].length;
    }

    function getAllLocks(address account) external view returns (uint256[] memory amounts, uint256[] memory unlockTimes, bool[] memory exists) {
        uint256 length = _locks[account].length;
        amounts = new uint256[](length);
        unlockTimes = new uint256[](length);
        exists = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            TokenLock storage lock = _locks[account][i];
            amounts[i] = lock.amount;
            unlockTimes[i] = lock.unlockTime;
            exists[i] = lock.exists;
        }
    }

    // Mint function (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ERC20: mint to the zero address");

        _totalSupply += amount;
        unchecked {
            _balances[to] += amount;
        }
        emit Transfer(address(0), to, amount);
    }
}