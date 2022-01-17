
module.exports = {
    testnet: {  // goerli
        nftCardAddress: '0xC814aFD17170d2A8c02C9f0E8B7bA8Bf96aB75Ff', // goerli nft
        leedoCoinAddress: '0xbC66FB9821A757a684364266Fb856513A189dbF7',  // goerli erc20 (LEEDO)
        leedoVaultAddress: '0xBF6CC26C2cA10B59AA68fca6EdAc0773cE306c97', // goerli vault
        maticCoinAddress: '0xCa5DdD47F2f321ae54610d20BD29D1ff6F9bAE97', // matic mumbai coin (mapped with goerli coin)
        maticNFTAddress: '0x2E39443148785c9be0d7343799Ed48672381e056', // matic mumbai nft (mapped with goerli vault)
        raffleAddress: "0xb109173Ab57Dab7F954Ef8F10D87a5bFDB740EEB", //mainnet
        erc20PredicateAddress: "0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34", // goerli, approve --> transfer & lock
        erc721PredicateAddress: "0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b", // goerli, approve --> transfer & lock
        rootChainManagerAddress: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74', // goerli, depostFor callee
        childChainManagerAddress: '0xb5505a6d998549090530911180f38aC5130101c6', // mumbai
        L1ChainID: 5,    // ethereum goerli
        L2ChainID: 80001,   // matic mumbai
        leedoCoinDecimals: 18,
        maticCoinDecimals: 18,
        parentProvider: `https://goerli.infura.io/v3/`,
        maticProvider: `https://rpc-mumbai.maticvigil.com/`,
        leedoFaucetAddress: '0x1C2eB54997aD433D82D41e028eDa71eEcAAd2eE3', // goerli faucet
        leedoBridgeServerAddress: 'http://leedobridge.dekey.app:18881/',
    },
    abi: {
        // ethereum L1
        SquidNFTABI: [
            "function ownerOf(uint256 tokenId) external view returns (address)",
            "function balanceOf(address owner) external view returns (uint256)",
            "function getGenes(uint256 _tokenId) public view returns (uint8[8])",
            "function getConsonants(uint256 _tokenId) public view returns (string[3])",
            "function getConsonantsIndex(uint256 _tokenId) public view returns (uint8[3])",
            "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
            "function tokenURI(uint256 _tokenId) public view returns (string)",
            "function claim() external",
        ],
        LeedoCoinABI: [
            "function approve(address spender, uint256 amount) external returns (bool)",
            "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
            "function transfer(address recipient, uint256 amount) external returns (bool)",
            "function balanceOf(address account) external view returns (uint256)",
            "function totalSupply() external view returns (uint256)",
            "function allowance(address owner, address spender) external view returns (uint256)",
        ],
    },
}
