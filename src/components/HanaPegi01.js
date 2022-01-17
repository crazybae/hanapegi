import '../index.css'; // tailwind css import
import 'bootstrap/dist/css/bootstrap.min.css';
import "../App.css";
import { SquidCardsContext } from './SquidCards';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { ethers } from "ethers";
import config from '../config';
import { EthersContext, contractInfo } from '../ethers/EthersProvider';
import Button from 'react-bootstrap/Button';


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

const RPSSign = {
    1: '\u270A',
    2: '\u270B',
    3: '\u270C',
};

//////////////////// Game room ///////////////////////
const REQ_CONNECT = "REQ_CONNECT";
const WAIT_GAME = "WAIT_GAME";
const START_GAME = "START_GAME";
const MY_CARDS = "TWO_CARDS";
const CPTY_CARDS = "TWO_CARDS";
const REMOVE_CARD = "REMOVE_CARD";
const FINAL_RESULT = "FINAL_RESULT";
const ROCK = 1; //"R"
const PAPER = 2; //"P"
const SCISSORS = 3; //"S"

// gameserver network
var appPropLocal = {
    gameServerURL: "ws://localhost:12321/rps",
    useTLS: false,
    skipInsecureTLS: true,
}

var appAWSTestEnv = {
    gameServerURL: "ws://54.180.163.232:12321/rps",
    useTLS: false,
    skipInsecureTLS: true,
}

const appProp = appPropLocal

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

        // getElem("yourRandomChoices").innerHTML = "waiting ...";

        setGameCards([]);

        let cards = await getRandomCards(numberOfCardsPerGame);

        var htmlStr = ""
        cards.forEach((card) => {
            setSelectedTokenGenes(card.rps);
            setSelectedTokenImage(card.image);
            setSelectedTokenID(`Token ID ${card.tokenID}`);
        });

        console.log("selected~~~~~");

        // getElem("yourRandomChoices").innerHTML = htmlStr;

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

    ///////////////

    const [showChoiceButtons, setShowChoiceButtons] = useState(false);
    // const [myPoints, setMyPoints] = useState(0);

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

        getElem("rpsMinusOneGameStatus").innerHTML = ""
        getElem("myRPS1").innerHTML = ""
        getElem("myRPS2").innerHTML = ""
        getElem("cptyRPS1").innerHTML = ""
        getElem("cptyRPS2").innerHTML = ""
        getElem("roundResult").innerHTML = ""
        // getElem("cptyRPSFinal").innerHTML = ""
        getElem("rpsMinusOneResult").innerHTML = ""
        getElem("myPoints").innerHTML = `<b>Points: 0</b>`;
        getElem("roundMessage").innerHTML = ""

        // setMyPoints(0);

        runRPSMinusOne(account, makePairs(), appProp)
    }


    const runRPSMinusOne = (account, pairs, appProp) => {

        const authToken = "DUMMYTOKEN"
        // ws.current = new WebSocket(appProp.gameServerURL, authToken);
        ws.current = new WebSocket(appProp.gameServerURL);

        let response;
        let currentRound = 0;  // [0, numberOfRoundsPerCard*numberOfCardsPerGame)
        let myRPS1, myRPS2;
        let myPoints = 0;
        // let choiceTime = false;

        ws.current.addEventListener('open', function (event) {
            // let response = { cmd: REQ_CONNECT, address: account, auth_token: authToken };
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
                    getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>Waiting ...</b</p>`;
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
                    getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>Started!</b</p>`;
                    console.log('(first round) MY CARDS', response);
                    ws.current.send(JSON.stringify(response));
                    break;

                case CPTY_CARDS:
                    console.log('CPTY_CARDS', recData);

                    getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>가위바위보!</b></p>`;
                    getElem("myRPS1").innerHTML = `${RPSSign[myRPS1]}`
                    getElem("myRPS2").innerHTML = `${RPSSign[myRPS2]}`
                    // cptyRPS1 = recData.card1;
                    // cptyRPS2 = recData.card2;
                    getElem("cptyRPS1").innerHTML = `${RPSSign[recData.card1]}`
                    getElem("cptyRPS2").innerHTML = `${RPSSign[recData.card2]}`

                    myRemovedCard.current = 0;

                    setShowChoiceButtons(true);

                    // to-do: if a user does not choose pegi within 3 seconds, do an automatic selection
                    //
                    // show 3 - 2 - 1
                    // 
                    // after 3 seconds, if showChoiceButtions == true, run chooseSecond
                    setTimeout(() => {
                        if (myRemovedCard.current === 0) {
                            setShowChoiceButtons(false);
                            console.log('Automatic Choice is 2');
                            myRemovedCard.current = 2;
                            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 2 }));
                        }

                    }, 4000);

                    break;

                case FINAL_RESULT:
                    console.log("*** Final result", recData);

                    console.log(`currentRound: ${currentRound}, myRemovedCard: ${myRemovedCard.current}`);

                    // check the result
                    //// check your card of 'final result' === your remaining card
                    if (pairs[currentRound][2 - myRemovedCard.current] !== recData.your_choice) {
                        alert(`1. my choice is wrong - mine: ${pairs[currentRound][2 - myRemovedCard.current]} vs server ${recData.your_choice}`)
                        // to-do: network close
                        break;
                    }
                    if (myRemovedCard.current !== recData.your_removed_card_num) {
                        alert(`2. my choice is wrong - mine: ${myRemovedCard.current} vs server ${recData.your_removed_card_num}`)
                        // to-do: network close
                        break;
                    }
                    //// check RPS(you, cpty) === result in 'final result'
                    let rpsResult = RPS(recData.cpty_choice, recData.your_choice);
                    if (rpsResult !== recData.result) {
                        alert(`3. RPS result is wrong - RPS: ${rpsResult} vs server ${recData.result}`)
                        // to-do: network close
                        break;
                    }
                    if (rpsResult === 1) {
                        myPoints++;
                        //// your self-calced points === point in 'final result'
                        if (myPoints !== recData.point) {
                            alert(`4. point result is wrong - mine: ${myPoints + 1} vs server ${recData.point}`)
                            // to-do: network close
                            break;
                        }
                        // setMyPoints(myPoints + 1);
                    }

                    getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>하나빼기!</b></p>`;
                    if (recData.your_removed_card_num === 1) {
                        getElem("myRPS1").innerHTML = ""
                    } else {
                        getElem("myRPS2").innerHTML = ""
                    }

                    if (recData.cpty_removed_card_num === 1) {
                        getElem("cptyRPS1").innerHTML = ""
                    } else {
                        getElem("cptyRPS2").innerHTML = ""
                    }

                    getElem("roundResult").innerHTML = `${currentRound + 1}: you ${RPSSign[recData.your_choice]} - cpty ${RPSSign[recData.cpty_choice]}`
                    getElem("myPoints").innerHTML = `<b>Points: ${myPoints}</b>`;
                    if (recData.result === 1) {
                        getElem("roundMessage").innerHTML = `<b>You Win ^^</b>`;
                    } else if (recData.result === -1) {
                        getElem("roundMessage").innerHTML = `<b>You Lose TT</b>`;
                    } else {
                        getElem("roundMessage").innerHTML = `<b>Draw --</b>`;
                    }

                    // let message;
                    // let point;


                    // if (recData.result === 1) {
                    //     message = `[Round ${currentRound + 1}] Win!`;
                    //     point = `Your point is ${myPoints}`;
                    // } else if (recData.result === -1) {
                    //     message = `[Round ${currentRound + 1}] Lose!`;
                    //     point = `Your point is ${myPoints}`;
                    // } else {
                    //     message = `[Round ${currentRound + 1}] Draw`;
                    //     point = `Your point is ${myPoints}`;
                    // }

                    // setTimeout(function () {
                    //     getElem("roundResult").innerHTML = `cpty ${RPSSign[recData.cpty_choice]}  you ${RPSSign[recData.your_choice]}`
                    //     // getElem("rpsMinusOneResult").innerHTML += `<p> ${message} ${point} </p>`;
                    // }, 500);

                    // for the next round
                    // kbae kbae kbae

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
                        // to-do
                        // close ws.current
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
        if (showChoiceButtons) {
            setShowChoiceButtons(false);
            console.log('MY Choice is 1');
            myRemovedCard.current = 1;

            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 1 }));

        }
    }

    const chooseSecond = () => {
        if (showChoiceButtons) {
            setShowChoiceButtons(false);
            console.log('MY Choice is 2');
            myRemovedCard.current = 2;

            ws.current.send(JSON.stringify({ cmd: REMOVE_CARD, removed_card_num: 2 }));

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
                    <span>{selectedTokenID} - {selectedTokenGenes}</span>
                </div>

                <div className="ready">
                    <Button id='runGameBtn' onClick={runGame} disabled={!verified} >
                        Start
                    </Button>
                    <div id="rpsMinusOneGameStatus"></div>
                </div>
            </div >


            <table border='3pt' align="center">
                <tr height='70'>
                    <td width='150'>Hand</td>
                    <td width='150'>1</td>
                    <td width='200'>2</td>
                    <td width='300'>Final</td>
                </tr>
                <tr height='150'>
                    <td>Cpty's Pair</td>
                    <td><font size="5"><div id="cptyRPS1"></div></font></td>
                    <td><font size="5"><div id="cptyRPS2"></div></font></td>
                    <td><font size="5"><div id="roundResult"></div></font></td>
                </tr>
                <tr height='150'>
                    <td>My Pair</td>
                    <td><font size="7"><div id="myRPS1" ></div></font></td>
                    <td><font size="7"><div id="myRPS2" ></div></font></td>
                    <td><font size="7"><div id="myPoints"></div></font></td>
                </tr>
                <tr height='50'>
                    <td>Select Pegi</td>
                    <td>
                        <Button id='chooseFirstBtn'
                            className="bg-red-500  hover:bg-red-700 ..."
                            onClick={chooseFirst} disabled={!showChoiceButtons} >
                            빼기
                        </Button>
                    </td>
                    <td>
                        <Button id='chooseSecondBtn'
                            className="bg-red-500  hover:bg-red-700 ..."
                            onClick={chooseSecond} disabled={!showChoiceButtons} >
                            빼기
                        </Button>
                    </td>
                    <td><font size="5"><div id="roundMessage" align="center"></div></font></td>
                </tr>
            </table>
            <p><div id="rpsMinusOneResult"></div></p>

        </>
    );

}
