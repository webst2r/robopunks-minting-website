import { useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

//import roboPunksNFT from './RoboPunksNFT.json'
//const roboPunksNFTAddress = "0x58DDE549384b1D136D4000330aCaA553EbE1231D";

import roboPunksNFT from './RoboPunksNFT2.json';
const roboPunksNFTAddress = "0x6Aa382cb820fB10e6227B77E714FC1Ef767Df150";



const MainMint = ({ accounts, setAccounts} ) => {
    const [mintAmount, setMintAmount] = useState(1);
    const isConnected = Boolean(accounts[0]);

    async function handleMint() {
        if(window.ethereum){
            // if the user has the metamask logged-in

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                roboPunksNFTAddress,
                roboPunksNFT.abi,
                signer
            );
            
            try {
                // vamos esperar pela resposta da funcao mint que definimos no nosso contrato
                const response = await contract.mint(BigNumber.from(mintAmount), {
                    value: ethers.utils.parseEther((0.02 * mintAmount).toString()),
                });
                console.log("response: ", response);
            } catch (err) {
                console.log("error handleMint: ", err);
            }
        }
    }


    // Função que vai ser executada quando clicamos no Botão de menos ("-")
    const handleDecrement = () => {
        if(mintAmount <= 1) return; // minimo 1, caso contrario nao fazer nada
        setMintAmount(mintAmount -1);
    }

    // Função que vai ser executada quando clicamos no Botão de menos ("-")
    const handleIncrement = () => {
        if(mintAmount >= 3) return; // maximo 3, caso contrario nao fazer nada
        setMintAmount(mintAmount + 1);
    }


    return (
        <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
            <Box width="520px">
                <div>
                    <Text fontSize="48px" textShadow="0 5px #000000">RoboPunks</Text>
                    <Text
                        fontSize="30px"
                        letterSpacing="-5.5%"
                        fontFamily="VT323"
                        textShadow="0 2px 20px #000000"
                    >
                        It's 2078. Can the RoboPunks NFT save humans from destructive rampant NFT speculation? Mint RoboPunks to find out.
                    </Text>
                </div>
                
                { isConnected ? (
                    <div>
                        <Flex align="center" justify="center">
                            <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px"
                                onClick={handleDecrement}
                            >-</Button>
                            <Input
                                readOnly
                                fontFamily="inherit"
                                width="100px"
                                height="40px"
                                textAlign="center"
                                paddingLeft="19px"
                                marginTop="10px"
                                type="number"
                                value={mintAmount}
                            />
                            
                            <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px"
                                onClick={handleIncrement}
                            >+</Button>
                        </Flex>
                        
                        <Button
                                backgroundColor="#D6517D"
                                borderRadius="5px"
                                boxShadow="0px 2px 2px 1px #0F0F0F"
                                color="white"
                                cursor="pointer"
                                fontFamily="inherit"
                                padding="15px"
                                marginTop="10px"
                                onClick={handleMint}
                            >MINT NOW</Button>

                    </div>
                ) : (
                    <Text
                        marginTop="70px"
                        fontSize="30px"
                        letterSpacing="-5.5%"
                        fontFamily="VT323"
                        textShadow="0 3px #000000"
                        color="#D6517D"
                    >You must be connected to Mint.
                    </Text>
                )}
            </Box>
        </Flex>
    );
};

export default MainMint;