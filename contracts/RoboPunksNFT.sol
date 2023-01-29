// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol'; // contrato para o Mint, para nao termos de reescrever tudo
import '@openzeppelin/contracts/access/Ownable.sol'; // definir funcoes que apenas o Owner pode usar

contract RoboPunksNFT is ERC721, Ownable { // herança (subclasse de...)
    using Strings for uint256;
    // Storage variables (podem custar muito ETH, cuidado!)
    uint256 public mintPrice;           
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    bool public isPublicMintEnabled;
    string internal baseTokenUri;
    address payable public withdrawWallet; // endereço pa fazer withdraw do dinheiro que está neste contrato
    mapping(address => uint256) public walletMints;

    // 'RoboPunks': nome do contrato; 'RP': abreviatura
    constructor() payable ERC721('RoboPunks', 'RP') {
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
        // set withdraw wallet address
    }

    
    function setIsPublicMintEnabled(bool enabled_) external onlyOwner {
        isPublicMintEnabled = enabled_;        // true or false
    }

    // O base URI vai ser o caminho para aceder o ficheiro .json que contém os metadados
    // exemplo (base URI): https://opensea/images
    function setBaseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri = baseTokenUri_;
        
        // vai ser algo do tipo:
        // ipfs://QmPJsJHYHsgSgJxd/
        // importante colocar a barra (`/`)no final

        // depois temos que chamar esta funcao no javascript para definir o baseURI (antes de fazer deploy!!!)
    }

    // tokenURI é uma funcao que já existe definida no ERC721 que foi importado. 
    // mas como estamos a definir o nosso proprio URI, temos de dar override nessa função pré-definida.

    // O marketplace (ex: Opensea) chama esta função, passando o tokenId do NFT, à espera que esta função lhe retorne os metadados/imagem do NFT.
    // Ou seja esta funcao permite que a nossa img seja mostrada no OpenSea
    function tokenURI(uint256 tokenId_) public view override returns(string memory) {
        require(_exists(tokenId_), 'Token does not exist!');
        
        // return string(abi.encodePacked(baseTokenUri, Strings.toString(tokenId_), ".json")); 
        return bytes(baseTokenUri).length > 0 ? string(abi.encodePacked(baseTokenUri, tokenId_.toString(), ".json")) : "";

        // Fica tipo: <baseTokenUri>/<tokenId>.json
        // Exemplo: ipfs://QmPJsJHYHsgSgJxd/1.json              // 1.json é o ficheiro de metadados do NFT com (Id: 1)
    }

    function withdraw() external onlyOwner {
        // Sacar fundos deste contrato para uma wallet que quisermos:
        // Invocamos a wallet para a qual queremos dar withdraw
        // Passamos o endereço deste contrato
        // .balance()
        (bool success, ) = withdrawWallet.call{ value: address(this).balance }('');
        require(success, 'Withdraw failed');
    }

    // funcoes payable requerem transferencias de ETHER
    function mint(uint256 quantity_) public payable {
        require(isPublicMintEnabled, 'mint not enabled');
        require(msg.value == quantity_ * mintPrice, 'wrong mint value');
        require(totalSupply + quantity_ <= maxSupply, 'sold out');
        require(walletMints[msg.sender] + quantity_ <= maxPerWallet, 'exceeded max wallet mints');

        for(uint256 i = 0; i < quantity_; i++){
            uint256 newTokenId = totalSupply +1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId); // mintar o token para o endereço "msg.sender" (quem invocou o mint)
        }
    }
}