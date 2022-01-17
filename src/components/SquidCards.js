import React, { useEffect, useState, useContext, useRef } from 'react';
import { ethers } from "ethers";
import config from '../config';
import { EthersContext, contractInfo } from '../ethers/EthersProvider';
import Button from 'react-bootstrap/Button';
import "../App.css";
import "../play.css";
import "../ellen.css";

// //// Contract info
// const currentConfig = config.testnet;
// const contractInfo = {
//     5: {
//         "Network": "Goerli Testnet",
//         "MainCardAddress": currentConfig.nftCardAddress,
//     },
//     0: {
//         "Network": "Undefined",
//         "MainCardAddress": '',
//     },
// };

const ABI = config.abi.SquidNFTABI;

//// Game info
const numberOfCardsPerGame = 1;
const numberOfRoundsPerCard = 4;

//// Helper ftns
function getElem(elemId) {
    return document.getElementById(elemId);
}
// pick a random within [min, max)
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export const SquidCardsContext = React.createContext(null);

export default (props) => {

    const {
        provider, signer,
        account, setAccount,
        networkId, setNetworkId,
        verified,
    } = useContext(EthersContext);

    const [cardBalance, setCardBalance] = useState(0);
    const [nftInstance, setNftInstance] = useState(null);
    const [gameCards, setGameCards] = useState([]);


    useEffect(() => {
        startApp();
    }, []);

    const startApp = async () => {

        try {
            // if (!verified) {
            //     return
            // }

            let nftInst = new ethers.Contract(contractInfo[networkId].MainCardAddress, ABI, provider.current);
            let numCards = (await nftInst.balanceOf(account)).toNumber();
            setCardBalance(numCards);
            setNftInstance(nftInst);

        } catch (error) {
            console.log(error);
        }
    };

    const getYourRandomChoices = async () => {

        if (!verified) {
            alert("Please verify you first!");
            return
        }
        if (cardBalance === 0) {
            alert(`Your account ${account} has no Squid Game cards. Please use another address having cards`);
            return;
        }

        getElem("yourRandomChoices").innerHTML = "waiting ...";

        setGameCards([]);

        let cards = await getRandomCards(numberOfCardsPerGame);

        var htmlStr = `<table class="center" border="1">`
        cards.forEach((card) => {
            htmlStr += `<tr><td>Token ID #${card.tokenID}</td><td><img class="w-16 md:w-32 lg:w-48" src='${card.image}' height="70" /></td><td>${card.rps}</td></tr>`
        });
        htmlStr += `</table>`

        getElem("yourRandomChoices").innerHTML = htmlStr;

        setGameCards([...cards]);
    }

    const getRandomCards = async (numberOfCardsPerGame) => {

        if (cardBalance <= 0) {
            alert("you don't have cards in your account,", account);
            return;
        }

        // const [gameCards, setGameCards] = useState([]);
        let cards = [];

        for (let i = 0; i < numberOfCardsPerGame; i++) {
            let tokenID = await nftInstance.tokenOfOwnerByIndex(account, getRandomInt(0, cardBalance));
            // let c1 = await nftInstance.getConsonantsIndex(tokenID);
            let g1 = await nftInstance.getGenes(tokenID);
            // temporally, use genes only
            let RPScard1 = g1.map((x) => {
                return (x % 3 + 1);
            });
            let tokenInfoBase64 = await nftInstance.tokenURI(tokenID);
            let jsonInfo = JSON.parse(atob(tokenInfoBase64.substring(29)));

            cards.push({ tokenID: tokenID.toNumber(), image: jsonInfo.image, rps: RPScard1 });
        }

        return cards;
    }

    const contextValues = {
        gameCards,
        setGameCards,
    };

    return (cardBalance <= 0) ? <div align="center">you don't have cards in your account, {account}</div> : (
        <>
            <div className="Choices">
                {/* Among {cardBalance} of Squid game cards &nbsp;&nbsp; */}
                <Button id='yourChoicesBtn' onClick={getYourRandomChoices} disabled={!verified} >
                    Get a Random Card
                </Button>
                <div id="yourRandomChoices" align="center"></div>
                <SquidCardsContext.Provider value={contextValues}>{props.children}</SquidCardsContext.Provider>
            </div>

        </>
    );

}