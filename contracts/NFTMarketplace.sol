// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

//INTERNAL IMPORT FROM NFT OPENZEPPLIN Meow
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//Defining our smart contract
contract NFTMarketplace is ERC721URIStorage {
    //DEFINING STATE VARIABLES
    address payable public marketplaceOwner;
    uint256 public listingFeePercent = 1;
    uint256 private currentTokenId;
    uint256 private totalItemsSold;

    struct NFTListing {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
    }

    //mapping to get listing from token ID
    mapping (uint256 => NFTListing) private tokenIdToListing;

    modifier onlyOwner{
        require(msg.sender == marketplaceOwner, "Only the owner can call this function");
        _;
    }
    //this is a constructor will run only once when the contract is deployed 
    //the one deploying the contract will be marketplace owner
    constructor() ERC721("NFTMarketplace", "APNFT"){
        marketplaceOwner = payable(msg.sender);
    }
    
    //defining Helper functions
    //setting listing fee percent
    function updateListingFeePercent(uint256 _listingFeePercent) public onlyOwner{
        listingFeePercent = _listingFeePercent;
    }
    //getting listing fee percent
    function getListingFeePercent() public view returns(uint256) {
        return listingFeePercent;
    }
    //getting token Id
    function getCurrentTokenId() public view returns(uint256) {
        return currentTokenId;
    }
    //getting NFT listing from token Id
    function getNFTListing(uint256 _tokenId) public view returns(NFTListing memory){
        return tokenIdToListing[_tokenId];
    }

    //Definig our Main Functions
    //Creation of Token
    function createToken(string memory _tokenURI, uint256 _price) public returns(uint256){
        require(_price > 0, "Price of token must be greater than zero");

        currentTokenId++;
        uint256 newTokenId = currentTokenId;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        _createNFTListing(newTokenId, _price);

        return newTokenId;
    }

    function _createNFTListing(uint256 _tokenId, uint256 _price) private{
        tokenIdToListing[_tokenId] = NFTListing({
            tokenId: _tokenId,
            owner: payable(msg.sender),
            seller: payable(msg.sender),
            price: _price
        });
    }
    //creating executeSales Function
    function executeSale(uint256 tokenId) public payable{
        NFTListing storage listing = tokenIdToListing[tokenId];
        uint256 price = listing.price;
        address payable seller = listing.seller;
        //Checking the amount seller is sending to approve sales
        require(msg.value == price,"Please send the asking price to complete purchase. Dont Scam others");
        //if amount sent is equal to asking price
        listing.seller = payable(msg.sender);
        totalItemsSold++;

        _transfer(listing.owner, msg.sender, tokenId);

        uint256 listingFee = (price * listingFeePercent) / 100;
        marketplaceOwner.transfer(listingFee);
        seller.transfer(msg.value - listingFee);
    }
    //Function to get all NFTS in market Place
     function getAllListedNFTs() public view returns (NFTListing[] memory){
        uint256 totalNFTCount = currentTokenId;
        NFTListing[] memory listedNFTs = new NFTListing[](totalNFTCount);
        uint256 currentIndex = 0;
        //iterating over all NFTS and putting them into listedNFTs array
        for(uint256 i = 0; i < totalNFTCount; i++){
            uint256 tokenId = i + 1;
            NFTListing storage listing = tokenIdToListing[tokenId];
            listedNFTs[currentIndex] = listing;
            currentIndex += 1;
        }

        return listedNFTs;
    }
    //Returning or listing NFTs of a specific User
    function getMyNFTs() public view returns(NFTListing[] memory) {
        uint256 totalNFTCount = currentTokenId;
        uint256 myNFTCount = 0;
        uint256 currentIndex = 0;
        //for loop to get the count of user NFTs
        for(uint256 i = 0; i < totalNFTCount; i++){
            if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender){
                myNFTCount++;
            }
        }
        //defining an array for the users NFTs
        NFTListing[] memory myNFTs = new NFTListing[](myNFTCount);
        for(uint256 i = 0; i < totalNFTCount; i++){
            if(tokenIdToListing[i+1].owner == msg.sender || tokenIdToListing[i+1].seller == msg.sender){
                uint256 tokenId = i + 1;
                NFTListing storage listing = tokenIdToListing[tokenId];
                myNFTs[currentIndex] = listing;
                currentIndex++;
            }
        }

        return myNFTs;
    }
}
