import './index.css'; // tailwind css import

import React, { Component, useState } from "react";
import Button from 'react-bootstrap/Button';
import { ethers } from "ethers";
import ShowInstruction from "./instruction";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import config from './config';
const currentConfig = config.testnet;

const numberOfCardsPerGame = 1;
const numberOfRoundsPerCard = 4;

const availableNetworks = [5]; // goerli only
const rootChainID = 5;

const RPSSign = {
  1: '\u270A',
  2: '\u270B',
  3: '\u270C',
};

const contractInfo = {
  5: {
    "Network": "Goerli Testnet",
    "MainCardAddress": currentConfig.nftCardAddress,
  },
};
const ABI = config.abi.SquidNFTABI;

//
// const [loading, setLoading] = useState(false);

// ...

// useEffect(() => {
//     doSomething(); // This is be executed when `loading` state changes
// }, [loading])
// setLoading(true);

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

function StartGame(address, pairs) {

  getElem("rpsMinusOneGameStatus").innerHTML = ""
  getElem("myRPS1").innerHTML = ""
  getElem("myRPS2").innerHTML = ""
  getElem("cptyRPS1").innerHTML = ""
  getElem("cptyRPS2").innerHTML = ""
  getElem("myRPSFinal").innerHTML = ""
  getElem("cptyRPSFinal").innerHTML = ""
  getElem("rpsMinusOneResult").innerHTML = ""

  let csws = runRPSMinusOne(address, pairs, appProp)
  if (csws != NaN || csws != undefined) {
    // console.log("PrepareConnections - SUCCESS cscw =", csws)
  }
}

function runRPSMinusOne(address, pairs, appProp) {
  // const [choice, setChoice] = useState(false);
  const authToken = "DUMMYTOKEN"
  let csws = new WebSocket(appProp.gameServerURL, authToken);
  let response;
  let currentRound = 0;  // [0, numberOfRoundsPerCard*numberOfCardsPerGame)
  let myRemovedCard;
  let myRPS1, myRPS2;
  let cptyRPS1, cptyRPS2;
  let myPoints = 0;

  csws.addEventListener('open', function (event) {
    let response = { cmd: REQ_CONNECT, address: address, auth_token: authToken };
    csws.send(JSON.stringify(response));
  });

  csws.onmessage = (event) => {
    let recData = JSON.parse(event.data);

    switch (recData.cmd) {

      case WAIT_GAME:
        console.log(recData);
        // show waiting sign
        getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>Waiting ...</b</p>`;
        break;

      case START_GAME:
        console.log(recData);

        myRPS1 = pairs[currentRound][0];
        myRPS2 = pairs[currentRound][1];
        response = {
          cmd: MY_CARDS,
          card1: myRPS1,
          card2: myRPS2,
        };
        getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>Started!</b</p>`;
        console.log('MY CARDS', response);
        csws.send(JSON.stringify(response));
        break;

      case CPTY_CARDS:
        console.log('CPTY_CARDS', recData);

        getElem("rpsMinusOneGameStatus").innerHTML = `<p><b>가위바위보!</b></p>`;
        getElem("myRPS1").innerHTML = `${RPSSign[myRPS1]}`
        getElem("myRPS2").innerHTML = `${RPSSign[myRPS2]}`
        cptyRPS1 = recData.card1;
        cptyRPS2 = recData.card2;
        getElem("cptyRPS1").innerHTML = `${RPSSign[cptyRPS1]}`
        getElem("cptyRPS2").innerHTML = `${RPSSign[cptyRPS2]}`
        // getElem("myRPSFinal").innerHTML = ""
        // getElem("cptyRPSFinal").innerHTML = ""

        // to-do:  user click determines the removed card
        myRemovedCard = getRandomInt(0, 100) % 2 + 1; // user will choose in UI

        // setChoice(true);

        response = { cmd: REMOVE_CARD, removed_card_num: myRemovedCard };
        console.log('Your removal', response);

        csws.send(JSON.stringify(response));
        break;

      case FINAL_RESULT:
        console.log("*** Final result", recData);

        // check the result
        //// check your card of 'final result' === your remaining card
        if (pairs[currentRound][2 - myRemovedCard] !== recData.your_choice) {
          alert(`my choice is wrong - mine: ${pairs[currentRound][2 - myRemovedCard]} vs server ${recData.your_choice}`)
          // to-do: network close
          break;
        }
        if (myRemovedCard !== recData.your_removed_card_num) {
          alert(`my choice is wrong - mine: ${myRemovedCard} vs server ${recData.your_removed_card_num}`)
          // to-do: network close
          break;
        }
        //// check RPS(you, cpty) === result in 'final result'
        let rpsResult = RPS(recData.cpty_choice, recData.your_choice);
        if (rpsResult !== recData.result) {
          alert(`RPS result is wrong - RPS: ${rpsResult} vs server ${recData.result}`)
          // to-do: network close
          break;
        }
        //// your self-calced points === point in 'final result'
        if (rpsResult === 1) {
          myPoints++;
        }
        console.log("**myPoints", myPoints);
        if (myPoints !== recData.point) {
          alert(`point result is wrong - mine: ${myPoints} vs server ${recData.point}`)
          // to-do: network close
          break;
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

        let message;
        let point;

        if (recData.result === 1) {
          message = `[Round ${currentRound + 1}] Win!`;
          point = `Your point is ${myPoints}`;
        } else if (recData.result === -1) {
          message = `[Round ${currentRound + 1}] Lose!`;
          point = `Your point is ${myPoints}`;
        } else {
          message = `[Round ${currentRound + 1}] Draw`;
          point = `Your point is ${myPoints}`;
        }

        setTimeout(function () {
          getElem("myRPSFinal").innerHTML = `${RPSSign[recData.your_choice]} <font size="4">${message}</font>`
          getElem("cptyRPSFinal").innerHTML = `${RPSSign[recData.cpty_choice]}`
          getElem("rpsMinusOneResult").innerHTML += `<p> ${message} ${point} </p>`;
        }, 500);

        // for the next round
        currentRound++;
        if (currentRound < numberOfRoundsPerCard * numberOfCardsPerGame) {
          myRPS1 = pairs[currentRound][0];
          myRPS2 = pairs[currentRound][1];
          response = {
            cmd: MY_CARDS,
            card1: myRPS1,
            card2: myRPS2,
          };
          // getElem("rpsMinusOneGameStatus").innerHTML = `<p><font size="5">Started!</font></p>`;
          // getElem("myRPS1").innerHTML = `<font size="7">${RPSSign[myRPS1]}</font>`
          // getElem("myRPS2").innerHTML = `<font size="7">${RPSSign[myRPS2]}</font>`
          // getElem("myRPSFinal").innerHTML = ""
          // getElem("cptyRPSFinal").innerHTML = ""

          console.log('MY CARDS', response);
          csws.send(JSON.stringify(response));
        } else {
          // to-do
          // close cscw
        }
        break;

      default:
        console.log(`abnormal message from server - ${recData}`)
    }
  }

  // useEffect(() => {
  //     alert("ddd"); // This is be executed when `loading` state changes
  // }, [choice])

  return csws
}

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

function getElem(elemId) {
  return document.getElementById(elemId);
}

// pick a random within [min, max)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

class App extends Component {

  state = {
    loaded: false,
    verified: false,
    chainId: 0,
    myAccount: "",
    cardBalance: 0,
    yourCards: [],
  };

  componentDidMount = async () => {

    if (typeof window.ethereum === 'undefined') {
      return <div>You need an ethereum wallet extention to play this game ...</div>;
    }
    await this.startApp();
    await this.watchChainAccount();
  };

  startApp = async () => {
    try {

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.networkId = (await this.provider.getNetwork()).chainId;

      if (this.networkId !== rootChainID) {
        await this.switchToRootChain();
        this.networkId = (await this.provider.getNetwork()).chainId;
      }

      // if ( !availableNetworks.includes(this.networkId) ) {
      //   return <div>Change your wallet network into Goerli testnet and press F5 ...</div>;
      // }

      let accts = await this.provider.listAccounts();
      // console.log(accts); 
      if (accts.length <= 0) {
        await this.connectWallet();
      }

      this.signer = this.provider.getSigner();
      this.account = await this.signer.getAddress();

      this.nftInstance = new ethers.Contract(contractInfo[this.networkId].MainCardAddress, ABI, this.provider);
      // const balance = await this.nftInstance.balanceOf(this.account);

      this.setState({
        chainId: this.networkId,
        loaded: true,
        myAccount: this.account,
        cardBalance: (await this.nftInstance.balanceOf(this.account)).toNumber(),
      });

    } catch (error) {
      console.log(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  connectWallet = async () => {
    this.accounts = await window.ethereum
      .request({ method: 'eth_requestAccounts' });
  }

  watchChainAccount = async () => {
    this.provider.on("accountsChanged", (accounts) => {
      // alert("Account changed");
      this.startApp();
    });
    this.provider.on("chainChanged", (chainId) => {
      // this.startApp();
      // alert("Network changed to " + contractInfo[parseInt(chainId)].Network);
    });
    // this.provider.on("connect", (connectInfo) => {
    //   alert("Connected to Ethereum network");
    // });      
    this.provider.on("disconnect", (error) => {
      alert("Disconnected from Ethereum network");
    });
  }


  switchToRootChain = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + rootChainID.toString(16) }],
      });

    } catch (switchError) {
      alert(`Add the network ${rootChainID} into your wallet`);
    }

    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  };


  getYourRandomChoices = async () => {

    if (!this.state.verified) {
      alert("Please verify you first!");
      return
    }
    if ((await this.nftInstance.balanceOf(this.account)).toNumber() === 0) {
      alert(`Your account ${this.account} has no Squid Game cards. Please use another address having cards`);
      return;
    }

    getElem("yourRandomChoices").innerHTML = "waiting ...";

    let cards = await this.getRandomCards(this.signer.getAddress(), numberOfCardsPerGame);

    var htmlStr = `<table class="center" border="1">`
    cards.forEach((card) => {
      htmlStr += `<tr><td>Token ID #${card.tokenID}</td><td><img class="w-16 md:w-32 lg:w-48" src='${card.image}' height="70" /></td><td>${card.rps}</td></tr>`
    });
    htmlStr += `</table>`

    getElem("yourRandomChoices").innerHTML = htmlStr;

    this.setState({
      chainId: this.networkId,
      loaded: true,
      myAccount: this.account,
      yourCards: cards,
    });
  }

  runGame = async () => {

    if (!this.state.verified) {
      alert("Please verify you first!");
      return
    }
    if (this.state.yourCards.length === 0) {
      alert("Press 'Get Your Random Choices' first");
      return
    }

    // const pairs = [[2,3], [1,3], [2,1], [3,2]]; // 1, 2, 3
    StartGame(this.account, this.makePairs())
  }

  makePairs = () => {
    let numCards = this.state.yourCards.length;
    let pairs = [];

    for (let i = 0; i < numCards; i++) {
      let sourceArrary = this.state.yourCards[i].rps;
      pairs.push([sourceArrary[0], sourceArrary[1]]);
      pairs.push([sourceArrary[2], sourceArrary[3]]);
      pairs.push([sourceArrary[4], sourceArrary[5]]);
      pairs.push([sourceArrary[6], sourceArrary[7]]);
    }

    console.log("Combat Pairs", pairs);

    return pairs;
  }

  getRandomCards = async (address, numOfCards) => {

    if (this.state.cardBalance <= 0) {
      alert("you don't have cards in your account,", this.state.myAccount);
      return;
    }

    let cards = [];

    for (let i = 0; i < numOfCards; i++) {
      let tokenID = await this.nftInstance.tokenOfOwnerByIndex(address, getRandomInt(0, this.state.cardBalance));
      let c1 = await this.nftInstance.getConsonantsIndex(tokenID);
      let g1 = await this.nftInstance.getGenes(tokenID);
      // temporally, use genes only
      let RPScard1 = g1.map((x) => {
        return (x % 3 + 1);
      });
      let tokenInfoBase64 = await this.nftInstance.tokenURI(tokenID);
      let jsonInfo = JSON.parse(atob(tokenInfoBase64.substring(29)));

      cards.push({ tokenID: tokenID.toNumber(), image: jsonInfo.image, rps: RPScard1 });
    }

    return cards;
  }

  ///////////////////////////

  eip712Sign = async () => {

    const domain = {
      name: "leedo",
      version: "v1",
      chainId: "5",
      verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
    };

    const TYPES = {
      SQUIDRPS:
        [
          { name: "sender", type: "address" },
          // { name: "data",   type: "bytes"   },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "salt", type: "bytes32" },
        ]
    }

    const value = {
      sender: this.account,
      // data:   "ssssss",
      value: 111,
      nonce: 22,
      salt: ethers.utils.randomBytes(32),
    };

    const signature = await this.signer._signTypedData(domain, TYPES, value);
    getElem('eip712SignResult').innerHTML = `Signature: ${signature.substring(0, 50)} ...`
  }


  signAndVerify = async () => {

    const randomMessage = `${+ new Date()}`;
    const signature = await this.signer.signMessage(randomMessage);

    const digest = ethers.utils.arrayify(ethers.utils.hashMessage(randomMessage));
    let recoveredAddress = ethers.utils.recoverAddress(digest, signature);

    if (recoveredAddress === this.account) {
      this.setState({ verified: true });
    } else {
      this.setState({ verified: false });
    }
  }


  render() {

    if (!this.state.loaded) {
      return <div>Change your wallet network into Goerli testnet and press F5 ...</div>;
    }
    return (

      <div className="App">

        <h1>Hana Pegi</h1>
        <p><button id='signAndVerifyBtn' class="bg-red-500  hover:bg-red-700 ..." onClick={this.signAndVerify} disabled={this.state.verified} >Verify You</button>&nbsp;
          Verified? <b>{(this.state.verified) ? 'Yes' : 'Not yet'}</b></p>
        <ShowInstruction />
        <hr />

        <p>Current network is <b>{contractInfo[this.state.chainId].Network}</b> having chain ID, {this.state.chainId}</p>
        <p>You have <b>{this.state.cardBalance}</b> cards in <b>{this.state.myAccount}</b></p>

        <table>
          <tr>
            <td width='400'><Button id='yourChoicesBtn' onClick={this.getYourRandomChoices} >
              Get Your Random Choices</Button></td>
            <td><div id="yourRandomChoices"></div></td>
          </tr>
          <tr>
            <td width='400'><Button id='runGameBtn' onClick={this.runGame} >
              Start RPS Minus One</Button></td>
            <td><font size="11"><div id="rpsMinusOneGameStatus"></div></font></td>
          </tr>
        </table>

        <table border='1pt'>
          <tr>
            <td width='150'>Hand</td>
            <td width='150'>1</td>
            <td width='200'>2</td>
            <td width='300'>Final</td>
          </tr>
          <tr>
            <td>Cpty's Pair</td>
            <td><font size="5"><div id="cptyRPS1"></div></font></td>
            <td><font size="5"><div id="cptyRPS2"></div></font></td>
            <td><font size="5"><div id="cptyRPSFinal"></div></font></td>
          </tr>
          <tr>
            <td>My Pair</td>
            <td><font size="7"><div id="myRPS1"></div></font></td>
            <td><font size="7"><div id="myRPS2"></div></font></td>
            <td><font size="7"><div id="myRPSFinal"></div></font></td>
          </tr>
          <tr>
            <td>My Pair</td>
            <td>
              <button id='signAndVerifyBtn'
                class="bg-red-500  hover:bg-red-700 ..."
                onClick={this.signAndVerify} disabled={this.state.verified} >
                빼기
              </button>
            </td>
            <button id='signAndVerifyBtn'
              class="bg-red-500  hover:bg-red-700 ..."
              onClick={this.signAndVerify} disabled={this.state.verified} >
              빼기
            </button>
            <td>
            </td>
            <td></td>
          </tr>
        </table>
        <p><div id="rpsMinusOneResult"></div></p>
      </div>
    );
  }
}

export default App;
