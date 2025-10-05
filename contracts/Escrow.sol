// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CoffeeDirect Escrow Contract
 * @dev Enhanced escrow contract with dispute resolution and auto-refund capabilities
 * @notice This contract handles secure payments between buyers and coffee farmers
 */
contract CoffeeEscrow {
    // Struct to represent an escrow transaction
    struct EscrowTransaction {
        address buyer;
        address farmer;
        address arbiter;
        uint256 amount;
        uint256 deadline;
        bool buyerApproved;
        bool farmerApproved;
        bool disputed;
        bool resolved;
        string coffeeBatchId;
        string description;
        uint256 createdAt;
        uint256 disputeDeadline;
        uint256 autoRefundTime;
    }

    // Events
    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed farmer, uint256 amount);
    event PaymentReleased(uint256 indexed escrowId, address indexed farmer, uint256 amount);
    event PaymentRefunded(uint256 indexed escrowId, address indexed buyer, uint256 amount);
    event DisputeRaised(uint256 indexed escrowId, address indexed disputer, string reason);
    event DisputeResolved(uint256 indexed escrowId, address indexed arbiter, bool farmerWins);
    event AutoRefundExecuted(uint256 indexed escrowId, address indexed buyer);
    event BuyerApproval(uint256 indexed escrowId, address indexed buyer);
    event FarmerApproval(uint256 indexed escrowId, address indexed farmer);

    // State variables
    mapping(uint256 => EscrowTransaction) public escrows;
    uint256 public escrowCount;
    address public owner;
    uint256 public constant AUTO_REFUND_DELAY = 7 days; // Auto-refund after 7 days if no approval
    uint256 public constant DISPUTE_TIMEOUT = 3 days; // Dispute resolution timeout
    uint256 public constant ARBITRATION_FEE_PERCENTAGE = 5; // 5% fee for arbitration

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyParticipant(uint256 _escrowId) {
        require(
            msg.sender == escrows[_escrowId].buyer ||
            msg.sender == escrows[_escrowId].farmer ||
            msg.sender == escrows[_escrowId].arbiter,
            "Only participants can call this function"
        );
        _;
    }

    modifier escrowExists(uint256 _escrowId) {
        require(_escrowId < escrowCount, "Escrow does not exist");
        _;
    }

    modifier notResolved(uint256 _escrowId) {
        require(!escrows[_escrowId].resolved, "Escrow already resolved");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new escrow transaction
     * @param _farmer Address of the coffee farmer
     * @param _arbiter Address of the dispute arbiter
     * @param _coffeeBatchId Unique identifier for the coffee batch
     * @param _description Description of the coffee being purchased
     */
    function createEscrow(
        address _farmer,
        address _arbiter,
        string memory _coffeeBatchId,
        string memory _description
    ) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_farmer != address(0), "Farmer address cannot be zero");
        require(_arbiter != address(0), "Arbiter address cannot be zero");
        require(_farmer != msg.sender, "Buyer cannot be the same as farmer");
        require(_arbiter != msg.sender, "Buyer cannot be the same as arbiter");

        uint256 escrowId = escrowCount;
        
        escrows[escrowId] = EscrowTransaction({
            buyer: msg.sender,
            farmer: _farmer,
            arbiter: _arbiter,
            amount: msg.value,
            deadline: block.timestamp + AUTO_REFUND_DELAY,
            buyerApproved: false,
            farmerApproved: false,
            disputed: false,
            resolved: false,
            coffeeBatchId: _coffeeBatchId,
            description: _description,
            createdAt: block.timestamp,
            disputeDeadline: 0,
            autoRefundTime: block.timestamp + AUTO_REFUND_DELAY
        });

        escrowCount++;

        emit EscrowCreated(escrowId, msg.sender, _farmer, msg.value);
    }

    /**
     * @dev Buyer approves the coffee delivery and releases payment to farmer
     * @param _escrowId ID of the escrow transaction
     */
    function approveDelivery(uint256 _escrowId) external escrowExists(_escrowId) notResolved(_escrowId) {
        require(msg.sender == escrows[_escrowId].buyer, "Only buyer can approve");
        require(!escrows[_escrowId].disputed, "Cannot approve during dispute");

        escrows[_escrowId].buyerApproved = true;
        escrows[_escrowId].resolved = true;

        // Transfer payment to farmer
        payable(escrows[_escrowId].farmer).transfer(escrows[_escrowId].amount);

        emit PaymentReleased(_escrowId, escrows[_escrowId].farmer, escrows[_escrowId].amount);
        emit BuyerApproval(_escrowId, msg.sender);
    }

    /**
     * @dev Farmer acknowledges receipt (optional, for transparency)
     * @param _escrowId ID of the escrow transaction
     */
    function farmerAcknowledge(uint256 _escrowId) external escrowExists(_escrowId) notResolved(_escrowId) {
        require(msg.sender == escrows[_escrowId].farmer, "Only farmer can acknowledge");
        require(!escrows[_escrowId].disputed, "Cannot acknowledge during dispute");

        escrows[_escrowId].farmerApproved = true;
        emit FarmerApproval(_escrowId, msg.sender);
    }

    /**
     * @dev Raise a dispute for the escrow transaction
     * @param _escrowId ID of the escrow transaction
     * @param _reason Reason for the dispute
     */
    function raiseDispute(uint256 _escrowId, string memory _reason) external escrowExists(_escrowId) notResolved(_escrowId) {
        require(
            msg.sender == escrows[_escrowId].buyer || msg.sender == escrows[_escrowId].farmer,
            "Only buyer or farmer can raise dispute"
        );
        require(!escrows[_escrowId].disputed, "Dispute already raised");

        escrows[_escrowId].disputed = true;
        escrows[_escrowId].disputeDeadline = block.timestamp + DISPUTE_TIMEOUT;

        emit DisputeRaised(_escrowId, msg.sender, _reason);
    }

    /**
     * @dev Arbiter resolves a dispute
     * @param _escrowId ID of the escrow transaction
     * @param _farmerWins True if farmer should receive payment, false if buyer should be refunded
     */
    function resolveDispute(uint256 _escrowId, bool _farmerWins) external escrowExists(_escrowId) notResolved(_escrowId) {
        require(msg.sender == escrows[_escrowId].arbiter, "Only arbiter can resolve dispute");
        require(escrows[_escrowId].disputed, "No dispute to resolve");
        require(block.timestamp <= escrows[_escrowId].disputeDeadline, "Dispute deadline passed");

        escrows[_escrowId].resolved = true;

        uint256 arbitrationFee = (escrows[_escrowId].amount * ARBITRATION_FEE_PERCENTAGE) / 100;
        uint256 paymentAmount = escrows[_escrowId].amount - arbitrationFee;

        if (_farmerWins) {
            // Farmer wins - pay farmer minus arbitration fee
            payable(escrows[_escrowId].farmer).transfer(paymentAmount);
            payable(escrows[_escrowId].arbiter).transfer(arbitrationFee);
            emit PaymentReleased(_escrowId, escrows[_escrowId].farmer, paymentAmount);
        } else {
            // Buyer wins - refund buyer minus arbitration fee
            payable(escrows[_escrowId].buyer).transfer(paymentAmount);
            payable(escrows[_escrowId].arbiter).transfer(arbitrationFee);
            emit PaymentRefunded(_escrowId, escrows[_escrowId].buyer, paymentAmount);
        }

        emit DisputeResolved(_escrowId, msg.sender, _farmerWins);
    }

    /**
     * @dev Execute auto-refund if deadline passed without approval
     * @param _escrowId ID of the escrow transaction
     */
    function executeAutoRefund(uint256 _escrowId) external escrowExists(_escrowId) notResolved(_escrowId) {
        require(
            block.timestamp >= escrows[_escrowId].autoRefundTime,
            "Auto-refund time not reached"
        );
        require(!escrows[_escrowId].disputed, "Cannot auto-refund during dispute");

        escrows[_escrowId].resolved = true;

        // Refund buyer
        payable(escrows[_escrowId].buyer).transfer(escrows[_escrowId].amount);

        emit AutoRefundExecuted(_escrowId, escrows[_escrowId].buyer);
        emit PaymentRefunded(_escrowId, escrows[_escrowId].buyer, escrows[_escrowId].amount);
    }

    /**
     * @dev Get escrow transaction details
     * @param _escrowId ID of the escrow transaction
     * @return EscrowTransaction struct
     */
    function getEscrow(uint256 _escrowId) external view escrowExists(_escrowId) returns (EscrowTransaction memory) {
        return escrows[_escrowId];
    }

    /**
     * @dev Check if auto-refund is available for an escrow
     * @param _escrowId ID of the escrow transaction
     * @return bool True if auto-refund is available
     */
    function canAutoRefund(uint256 _escrowId) external view escrowExists(_escrowId) returns (bool) {
        return (
            !escrows[_escrowId].resolved &&
            !escrows[_escrowId].disputed &&
            block.timestamp >= escrows[_escrowId].autoRefundTime
        );
    }

    /**
     * @dev Get time remaining until auto-refund
     * @param _escrowId ID of the escrow transaction
     * @return uint256 Seconds remaining (0 if auto-refund is available)
     */
    function getAutoRefundTimeRemaining(uint256 _escrowId) external view escrowExists(_escrowId) returns (uint256) {
        if (block.timestamp >= escrows[_escrowId].autoRefundTime) {
            return 0;
        }
        return escrows[_escrowId].autoRefundTime - block.timestamp;
    }

    /**
     * @dev Emergency function to withdraw stuck funds (only owner)
     * @param _escrowId ID of the escrow transaction
     */
    function emergencyWithdraw(uint256 _escrowId) external onlyOwner escrowExists(_escrowId) {
        require(escrows[_escrowId].resolved, "Escrow not resolved");
        require(address(this).balance >= escrows[_escrowId].amount, "Insufficient contract balance");

        // This is a safety mechanism for edge cases
        payable(owner).transfer(escrows[_escrowId].amount);
    }

    /**
     * @dev Update contract parameters (only owner)
     * @param _autoRefundDelay New auto-refund delay in seconds
     * @param _disputeTimeout New dispute timeout in seconds
     */
    function updateParameters(
        uint256 _autoRefundDelay,
        uint256 _disputeTimeout
    ) external onlyOwner {
        // Note: In a real implementation, you might want to add validation
        // and emit events for parameter changes
        // AUTO_REFUND_DELAY = _autoRefundDelay;
        // DISPUTE_TIMEOUT = _disputeTimeout;
    }

    /**
     * @dev Get contract statistics
     * @return uint256 Total number of escrows created
     * @return uint256 Total amount in escrow
     * @return uint256 Number of resolved escrows
     */
    function getContractStats() external view returns (uint256, uint256, uint256) {
        uint256 totalAmount = 0;
        uint256 resolvedCount = 0;

        for (uint256 i = 0; i < escrowCount; i++) {
            if (!escrows[i].resolved) {
                totalAmount += escrows[i].amount;
            } else {
                resolvedCount++;
            }
        }

        return (escrowCount, totalAmount, resolvedCount);
    }
}
