// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CharityPeers {
    /*
     * USER
     * TODO: add docstring here
     */
    struct User {
        string name;
        string email;
        string phone;
        uint256[] charityIds;
        uint256[] donationIds;
    }

    mapping(address => User) public users;

    function addUser(
        string memory _name,
        string memory _email,
        string memory _phone
    ) public {
        users[msg.sender] = User(
            _name,
            _email,
            _phone,
            new uint256[](0),
            new uint256[](0)
        );
    }

    function addCharityIdToUser(uint256 _charityId) public {
        users[msg.sender].charityIds.push(_charityId);
    }

    function addDonationIdToUser(uint256 _donationId) public {
        users[msg.sender].donationIds.push(_donationId);
    }

    function getUser(address _address) public view returns (string memory) {
        return users[_address].name;
    }

    function getUserCharityIds(
        address _address
    ) public view returns (uint256[] memory) {
        return users[_address].charityIds;
    }

    /*
     * DONATION
     * TODO: add docstring here
     */
    struct Donation {
        uint256 charityId;
        bytes32 txHash;
        string message;
        uint256 timestamp;
        address userAddress;
    }

    mapping(uint256 => Donation) public donations;

    uint256 public donationCount;

    function addDonation(
        uint256 _charityId,
        bytes32 txHash,
        uint256 amount,
        string memory _message,
        uint256 _timestamp
    ) public {
        donationCount++;
        donations[donationCount] = Donation(
            _charityId,
            txHash,
            _message,
            _timestamp,
            msg.sender
        );
        addDonationIdToUser(donationCount);
        addDonationIdToCharity(_charityId, amount, donationCount);
    }

    /*
     * CHARITY
     * TODO: add docstring here
     */
    struct Charity {
        address owner;
        string name;
        string description;
        string website;
        string photoUrl;
        string email;
        string phone;
        string physicalAddress;
        // stored in wei
        uint256 totalDonationAmount;
        uint256 goalAmount;
        uint256 totalDonationCount;
        uint256[] donationIds;
    }

    mapping(uint256 => Charity) public charities;

    uint256 public charityCount;

    function addCharity(
        address _owner,
        string memory _name,
        string memory _description,
        string memory _website,
        string memory _photoUrl,
        string memory _email,
        string memory _phone,
        string memory _physicalAddress,
        uint256 _totalDonationAmount,
        uint256 _goalAmount,
        uint256 _totalDonationCount
    ) public {
        charityCount++;
        charities[charityCount] = Charity(
            _owner,
            _name,
            _description,
            _website,
            _photoUrl,
            _email,
            _phone,
            _physicalAddress,
            _totalDonationAmount,
            _goalAmount,
            _totalDonationCount,
            new uint256[](0)
        );
        addCharityIdToUser(charityCount);
    }

    function addDonationIdToCharity(
        uint256 _charityId,
        uint256 _donationAmount,
        uint256 _donationId
    ) public {
        charities[_charityId].donationIds.push(_donationId);
        charities[_charityId].totalDonationAmount += _donationAmount;
        charities[_charityId].totalDonationCount++;
    }

    function getDonationIds(
        uint256 _charityId
    ) public view returns (uint256[] memory) {
        return charities[_charityId].donationIds;
    }
}
