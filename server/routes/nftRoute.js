const express = require("express");
const { getNFTMetadata } = require("../controllers/nftController");

const router = express.Router();

router.route("/:contractAddress/:tokenId").get(getNFTMetadata);

module.exports = router;
