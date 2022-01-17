// import '../index.css'; // tailwind css import
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
import "../play.css";
import "../ellen.css";

import React, { useEffect, useState, useContext, useRef } from 'react';
import { ethers } from "ethers";
import config from '../config';
import appProp from '../server';
import { EthersContext, contractInfo } from '../ethers/EthersProvider';
import Button from 'react-bootstrap/Button';

import rockImage from '../img/hand-rock.png';
import paperImage from '../img/hand-paper.png';
import scissorsImage from '../img/hand-scissors.png';
import pointImage from '../img/icon-points.png';

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
const pegiWait = 5;

var showCount = 0;

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

// const RPSSign = {
//     1: '\u270A',
//     2: '\u270B',
//     3: '\u270C',
// };

const RPSSign = {
    1: rockImage,
    2: paperImage,
    3: scissorsImage,
};

// const openLeaderBoard = (url, name) => {
//     var options = 'width=500, height=600, top=30, left=30, resizable=no, scrollbars=no, location=no';
//     window.open(url, name, options);
// }

//////////////////// Game room ///////////////////////
const REQ_CONNECT = "REQ_CONNECT";
const WAIT_GAME = "WAIT_GAME";
const START_GAME = "START_GAME";
const REJECT_GAME = "REJECT_GAME";
const MY_CARDS = "TWO_CARDS";
const CPTY_CARDS = "TWO_CARDS";
const REMOVE_CARD = "REMOVE_CARD";
const FINAL_RESULT = "FINAL_RESULT";
const ROCK = 1; //"R"
const PAPER = 2; //"P"
const SCISSORS = 3; //"S"

// return -1 when c1 wins, 0 in draw, 1 when c2 wins 
const RPS = (c1, c2) => {
    if (c1 === c2) {
        return 0;
    }
    if (c1 === ROCK) {
        if (c2 === PAPER) {
            return 1;
        } else {
            return -1;
        }
    }
    if (c1 === PAPER) {
        if (c2 === SCISSORS) {
            return 1;
        } else {
            return -1;
        }
    }
    if (c1 === SCISSORS) {
        if (c2 === ROCK) {
            return 1;
        } else {
            return -1;
        }
    }
}

////////////////////////////////////////////////////////////////////

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
    const [selectedTokenImage, setSelectedTokenImage] = useState(null);
    const [selectedTokenID, setSelectedTokenID] = useState("");
    const [selectedTokenGenes, setSelectedTokenGenes] = useState("");
    const [waiting, setWaiting] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const [cardPrepared, setCardPrepared] = useState(false);

    const [myRPS1Image, setMyRPS1Image] = useState(null);
    const [myRPS2Image, setMyRPS2Image] = useState(null);
    const [cptyRPS1Image, setCptyRPS1Image] = useState(null);
    const [cptyRPS2Image, setCptyRPS2Image] = useState(null);

    useEffect(() => {
        startApp();
    }, []);

    const startApp = async () => {

        try {
            // if (!verified) {
            //     return
            // }

            let nftInst = new ethers.Contract(contractInfo[networkId].MainCardAddress, ABI, provider.current);
            setCardBalance((await nftInst.balanceOf(account)).toNumber());
            setNftInstance(nftInst);

            getElem('consoleimg_r').style.display = "block";
            getElem('consoleimg_g').style.display = "block";
            getElem('tvimg_l').style.display = "block";
            getElem('tvimg_r').style.display = "block";

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

        setBannerMessage('Waiting');
        setWaiting(true);
        setGameCards([]);

        let cards = await getRandomCards(numberOfCardsPerGame);

        var htmlStr = ""
        cards.forEach((card) => {
            setSelectedTokenGenes(card.rps);
            setSelectedTokenImage(card.image);
            setSelectedTokenID(`Token ID ${card.tokenID}`);
        });

        setWaiting(false);
        setGameCards([...cards]);
        setCardPrepared(true);
    }

    const getRandomCards = async (numberOfCardsPerGame) => {

        if (cardBalance <= 0) {
            alert("you don't have cards in your account,", account);
            return;
        }

        let cards = [];

        for (let i = 0; i < numberOfCardsPerGame; i++) {
            let tokenID = await nftInstance.tokenOfOwnerByIndex(account, getRandomInt(0, cardBalance));
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

    ///////////////

    const [showChoiceButtons, setShowChoiceButtons] = useState(false);

    let myRemovedCard = useRef(0);
    let ws = useRef(null);

    const makePairs = () => {
        let numCards = gameCards.length;
        let pairs = [];

        for (let i = 0; i < numCards; i++) {
            let sourceArrary = gameCards[i].rps;
            pairs.push([sourceArrary[0], sourceArrary[1]]);
            pairs.push([sourceArrary[2], sourceArrary[3]]);
            pairs.push([sourceArrary[4], sourceArrary[5]]);
            pairs.push([sourceArrary[6], sourceArrary[7]]);
        }

        console.log("Combat Pairs", pairs);

        return pairs;
    }

    const runGame = async () => {

        setMyRPS1Image(null);
        setMyRPS2Image(null);
        setCptyRPS1Image(null);
        setCptyRPS2Image(null);

        getElem("myPoints").innerHTML = `0 Points`;

        runRPSMinusOne(account, makePairs(), appProp)
    }


    const runRPSMinusOne = (account, pairs, appProp) => {

        const authToken = "DUMMYTOKEN"

        ws.current = new WebSocket(appProp.gameServerURL);

        let response;
        let currentRound = 0;
        let myRPS1, myRPS2;
        let myPoints = 0;

        ws.current.addEventListener('open', function (event) {
            ws.current.send(JSON.stringify({
                cmd: REQ_CONNECT,
                address: account,
                auth_token: authToken,
            }));
        });

        ws.current.addEventListener('message', (e) => {
            let recData = JSON.parse(e.data);

            switch (recData.cmd) {

                case WAIT_GAME:
                    console.log(recData);
                    // show waiting sign
                    setBannerMessage('Waiting');
                    setWaiting(true);
                    break;

                case START_GAME:
                    console.log(recData);

                    myRemovedCard.current = 0;

                    myRPS1 = pairs[currentRound][0];
                    myRPS2 = pairs[currentRound][1];
                    response = {
                        cmd: MY_CARDS,
                        card1: myRPS1,
                        card2: myRPS2,
                    };

                    setWaiting(false);

                    console.log('(first round) MY CARDS', response);
                    ws.current.send(JSON.stringify(response));
                    break;


                case REJECT_GAME:

                    console.log('game is rejected since', recData.message);
                    break;


                case CPTY_CARDS:
                    console.log('CPTY_CARDS', recData);

                    setMyRPS1Image(RPSSign[myRPS1]);
                    setMyRPS2Image(RPSSign[myRPS2]);

                    setCptyRPS1Image(RPSSign[recData.card1]);
                    setCptyRPS2Image(RPSSign[recData.card2]);

                    myRemovedCard.current = 0;

                    setShowChoiceButtons(true);

                    // show countdown
                    var countDown = getElem("countdown");
                    showCount = pegiWait;

                    countDown.style.display = 'block';

                    let counter = setInterval(() => {
                        if (showCount == 0) {
                            countDown.style.display = 'none';
                            clearInterval(counter);
                        }
                        else {
                            countDown.innerText = showCount;
                            showCount -= 1;
                        }
                    }, 1000);

                    // after 3 seconds, if showChoiceButtions == true, run chooseSecond
                    setTimeout(() => {
                        if (myRemovedCard.current === 0) {
                            setShowChoiceButtons(false);
                            showCount = 0;
                            console.log('Automatic Choice is 2');
                            myRemovedCard.current = 2;
                            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 2 }));
                        }

                    }, pegiWait * 1000);

                    break;

                case FINAL_RESULT:
                    console.log("*** Final result", recData);
                    console.log(`currentRound: ${currentRound}, myRemovedCard: ${myRemovedCard.current}`);

                    // check the result
                    //// check your card of 'final result' === your remaining card
                    if (pairs[currentRound][2 - myRemovedCard.current] !== recData.your_choice) {
                        alert(`1. my choice is wrong - mine: ${pairs[currentRound][2 - myRemovedCard.current]} vs server ${recData.your_choice}`);
                        ws.current.close(`1. my choice is wrong - mine: ${pairs[currentRound][2 - myRemovedCard.current]} vs server ${recData.your_choice}`);
                        break;
                    }
                    if (myRemovedCard.current !== recData.your_removed_card_num) {
                        alert(`2. my choice is wrong - mine: ${myRemovedCard.current} vs server ${recData.your_removed_card_num}`);
                        ws.current.close(`2. my choice is wrong - mine: ${myRemovedCard.current} vs server ${recData.your_removed_card_num}`);
                        break;
                    }
                    //// check RPS(you, cpty) === result in 'final result'
                    // return -1 when c1 wins, 0 in draw, 1 when c2 wins 
                    let rpsResult = RPS(recData.cpty_choice, recData.your_choice);
                    if (rpsResult !== recData.result) {
                        alert(`3. RPS result is wrong - RPS: ${rpsResult} vs server ${recData.result}`);
                        ws.current.close(`3. RPS result is wrong - RPS: ${rpsResult} vs server ${recData.result}`);
                        break;
                    }
                    if (rpsResult === 1) { // you win
                        myPoints++;
                        //// your self-calced points === point in 'final result'
                        if (myPoints !== recData.point) {
                            alert(`4. point result is wrong - mine: ${myPoints + 1} vs server ${recData.point}`);
                            ws.current.close(`4. point result is wrong - mine: ${myPoints + 1} vs server ${recData.point}`);
                            break;
                        }
                        setBannerMessage(`You Win ^^`);
                        setWaiting(true);
                        setTimeout(() => {
                            setWaiting(false);
                        }, 1000);

                    } else if (rpsResult === -1) { // you lose
                        setBannerMessage(`You Lose TT`);
                        setWaiting(true);
                        setTimeout(() => {
                            setWaiting(false);
                        }, 1000);

                    } else { // draw
                        setBannerMessage(`Draw --`);
                        setWaiting(true);
                        setTimeout(() => {
                            setWaiting(false);
                        }, 1000);

                    }

                    if (recData.your_removed_card_num === 1) {
                        setMyRPS1Image(null);
                    } else {
                        setMyRPS2Image(null);
                    }

                    if (recData.cpty_removed_card_num === 1) {
                        setCptyRPS1Image(null);
                    } else {
                        setCptyRPS2Image(null);
                    }

                    getElem("myPoints").innerHTML = `${myPoints} Points`;

                    // for the next round
                    currentRound++;
                    console.log(`new round: ${currentRound}`)
                    if (currentRound < numberOfRoundsPerCard * numberOfCardsPerGame) {

                        console.log(`new round started: ${currentRound}`)

                        myRPS1 = pairs[currentRound][0];
                        myRPS2 = pairs[currentRound][1];
                        response = {
                            cmd: MY_CARDS,
                            card1: myRPS1,
                            card2: myRPS2,
                        };

                        console.log('(new round) MY CARDS', response);
                        ws.current.send(JSON.stringify({
                            cmd: MY_CARDS,
                            card1: myRPS1,
                            card2: myRPS2,
                        }));
                    } else {

                        // // show final result!!!!

                        // show countdown
                        // var resultMessageLine = getElem("finalResult");
                        // resultMessageLine.style.display = 'block';
                        // resultMessageLine.innerText = `You've got ${myPoints} points`
                        setBannerMessage(`You've got ${myPoints} points`);
                        setWaiting(true);

                        setTimeout(() => {
                            setMyRPS1Image(null);
                            setMyRPS2Image(null);
                            setCptyRPS1Image(null);
                            setCptyRPS2Image(null);
                            setWaiting(false);
                            // resultMessageLine.style.display = 'none';
                        }, 5000);

                        // server closes connection.
                        // ws.current.close('round ended');
                    }
                    break;

                default:
                    console.log(`abnormal message from server - ${recData}`)
            }
        });

        ws.current.addEventListener('close', (e) => {
            console.log('network is closed');
        });

    }

    const chooseFirst = () => {
        // console.log('choose first', myRemovedCard.current, ws.current);
        if (myRemovedCard.current === 0 && ws.current != null) {
            setShowChoiceButtons(false);
            showCount = 0;
            console.log('MY Choice is 1');
            myRemovedCard.current = 2;

            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 2 }));

        }
    }

    const chooseSecond = () => {
        // console.log('choose second', myRemovedCard.current);
        if (myRemovedCard.current === 0 && ws.current != null) {
            setShowChoiceButtons(false);
            showCount = 0;
            console.log('MY Choice is 2');
            myRemovedCard.current = 1;

            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 1 }));

        }
    }

    return (cardBalance <= 0) ? <div align="center">you don't have cards in your account, {account}</div> : (
        <>
            <div className="box_wrap">
                <div className="Choices">
                    <Button type="button" id='yourChoicesBtn' onClick={getYourRandomChoices} disabled={!verified} >
                        Get a Random Card
                    </Button>
                    <span><img src={selectedTokenImage} width="100pt" alt="" /></span><br />
                    <span>{selectedTokenID}</span>
                </div>

                <div className="ready">
                    <Button id='runGameBtn' onClick={runGame} disabled={!cardPrepared} >
                        Start
                    </Button>
                    {waiting &&
                        <div className="msg_box" id="msg_box_waiting" >
                            <div className="msg_waitiing">
                                <div className="loader"></div>
                                <h3>{bannerMessage}</h3>
                            </div>
                        </div>
                    }
                </div>
            </div >

            <div id="game_warp">
                <span className="backImg"></span>
                <div id="game">

                    <div className="tv">
                        <span className="hand left"><img id="tvimg_l" src={cptyRPS1Image} alt="" /></span>
                        <span className="hand right"><img id="tvimg_r" src={cptyRPS2Image} alt="" /></span>
                    </div>

                    <div className="game_console">
                        <div id="countdown"></div>
                        <button type="button" className="game_console_btn red" id="btn_red" value="0" onClick={chooseFirst}>
                            <img id="consoleimg_r" src={myRPS1Image} alt="" />
                        </button>
                        <button type="button" className="game_console_btn green" id="btn_green" value="0" onClick={chooseSecond}>
                            <img id="consoleimg_g" src={myRPS2Image} alt="" />
                        </button>
                    </div>

                    <div className="msg_box" id="msg_box_result">
                        <div className="msg_result">
                            <div className="loader"></div>
                            <h3>Win</h3>
                        </div>
                    </div>
                    <div className="points">
                        <span className="points_icon"><img src={pointImage} alt="" /></span>
                        <div id="myPoints">0 Point</div>
                    </div>
                </div>
            </div>
        </>
    );
}

