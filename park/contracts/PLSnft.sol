// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract PLSnft is ERC721URIStorage {
    
    address owner;

    modifier onlyOwner {
        require(msg.sender ==owner);
        _;
    }

     constructor() ERC721("Park Loves Sea NFT", "PLS") {
         owner = msg.sender;
     }


    function mint(address toAddr, uint256 tokenId, string memory tokenURI) public onlyOwner returns (uint256) {
        uint256 newItemId = tokenId;
        _mint(toAddr, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}