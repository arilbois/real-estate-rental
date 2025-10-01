const nftService = require("../utils/nftService");
const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");

/**
 * GET /api/v1/nft/:contractAddress/:tokenId
 * Get NFT basic info, owner, tokenURI + metadata JSON
 */
exports.getNFTMetadata = asyncErrorHandler(async (req, res, next) => {
  const { contractAddress, tokenId } = req.params;

  try {
    const nftData = await nftService.getNFTMetadata(contractAddress, tokenId);

    res.status(200).json(nftData);
  } catch (error) {
    return next(
      new ErrorHandler(`Failed to process NFT request: ${error.message}`, 500)
    );
  }
});
