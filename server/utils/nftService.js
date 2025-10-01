const { ethers } = require("ethers");
const fetch = require("node-fetch");

// Basic ERC721 ABI (without enumeration since we only get specific tokenId)
const ERC721_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

class NFTService {
  constructor() {
    this.rpcUrl = process.env.NFT_RPC_URL;
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
  }

  async getNFTMetadata(contractAddress, tokenId) {
    try {
      if (!ethers.isAddress(contractAddress)) {
        throw new Error("Invalid contract address");
      }

      if (isNaN(tokenId) || tokenId < 0) {
        throw new Error("Invalid token ID");
      }

      const erc721 = new ethers.Contract(
        contractAddress,
        ERC721_ABI,
        this.provider
      );

      const [name, symbol, owner, tokenURI] = await Promise.all([
        erc721.name(),
        erc721.symbol(),
        erc721.ownerOf(tokenId),
        erc721.tokenURI(tokenId),
      ]);

      const metadataUrl = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        : tokenURI;

      // Fetch metadata JSON from IPFS
      let metadata = {};

      try {
        const response = await fetch(metadataUrl);

        if (response.ok) {
          metadata = await response.json();
        }
      } catch (fetchErr) {
        console.warn("Metadata can't be fetched:", fetchErr.message);
      }

      return {
        contractAddress,
        tokenId: tokenId.toString(),
        contractName: name,
        contractSymbol: symbol,
        owner,
        tokenURI,
        metadata,
      };
    } catch (error) {
      console.error("Failed to get NFT data:", error.message);
      throw error;
    }
  }
}

module.exports = new NFTService();
