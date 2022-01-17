
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

function StartGame(address) {

    if (!bgStatusSG) {

        let csws = connectToCSForSign(address, appProp)
        if (csws != NaN || csws != undefined) {
            // console.log("PrepareConnections - SUCCESS cscw =", csws)
        }

    } else {
        console.log("game was started already ...")
    }
}


function connectToCSForSign(address, appProp) {

    const authToken = "DUMMYTOKEN"
    let csws = new WebSocket(appProp.gameServerURL, authToken);

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
                ;

            case START_GAME:
                console.log(recData);
                let response = { cmd: MY_CARDS, card1: 1, card2: 2 };
                csws.send(JSON.stringify(response));

            case CPTY_CARDS:
                console.log(recData);
                let response = { cmd: REMOVE_CARD, removed_card_num: 2 };
                csws.send(JSON.stringify(response));

            case FINAL_RESULT:
                console.log(recData);
                // verify
                ;

            default:
        }
    }
    return csws
}

// function ConnectTo(appConf) {
//     // const addr = appConf.gameServerAddr
//     // const path = appConf.gameServerPath
//     // return new WebSocket("ws://"+addr+path, "token")
//     return new WebSocket(appConf.gameServerURL, "token")
// }
