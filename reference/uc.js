
var worker = new window.Worker(`js/worker.js`);
console.log("worker is started ...")

const promise = new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
        if (event.data.done) {
            if (event.data.msg !== undefined) {
                let old_text = document.getElementById("result").innerHTML
                document.getElementById("result").innerHTML = old_text + '<p><p>' + event.data.msg
            }
        } else if (!event.data.done) {
                if (event.data.msg !== undefined) {
                    let old_text = document.getElementById("result").innerHTML
                    document.getElementById("result").innerHTML = old_text + '<p><p>ERR: ' + event.data.msg
                }
        } else if (event.data.error) {
            if (event.data.msg !== undefined) {
                let old_text = document.getElementById("result").innerHTML
                document.getElementById("result").innerHTML = old_text + '<p><p>worker and wasm failed'
            }
        }
        return;
    };
});
worker.postMessage({eventType: "init", data: "go-wasm"});

var SampleUserID = 1000;
var SampleWalletID = 4;

// called by html
function generateKeyShare() {
    worker.postMessage({
        eventType: "kg",
        aessource: document.querySelector('#aespassword').value,
        user_id: SampleUserID,
        wallet_id: SampleWalletID
    });
}

// called by html
function addAccount() {
    worker.postMessage({
        eventType: "add-account",
        aessource: document.querySelector('#aespasswordfornewaccount').value,
    });
}

// called by html
function getAccounts() {
    worker.postMessage({
        eventType: "get-accounts"
    });
}

// called by html
function changeActiveAccount() {
    worker.postMessage({
        eventType: "change-active-account",
        active_account_id: document.querySelector('#activeaccountid').value
    });
}


// called by html
function sign() {
    worker.postMessage({
        eventType: "sg",
        message: strToHex(document.querySelector('#rawmessage').value),
        target_account_id: document.querySelector('#targetaccountid').value
    });
}

// called by html
function recover() {
    worker.postMessage({
        eventType: "rg",
        aessource: document.querySelector('#aespassword').value,
        user_id: SampleUserID,
        wallet_id: SampleWalletID,
        mnemonic: document.querySelector('#mnemonic').value
    });
}

// called by html
function selfSign() {
    worker.postMessage({
        eventType: "self-sign",
        message: strToHex("kibaekibaekibae")
    });
}

// called by html
function checkPassword() {
    worker.postMessage({
        eventType: "check-password",
        aessource: document.querySelector('#passwordinput').value
    });
}

// called by html
function checkShareInMemory() {
    worker.postMessage({
        eventType: "check-share-in-memory"
    });
}

// called by html
function clearShareInMemory() {
    worker.postMessage({
        eventType: "clear-share-in-memory"
    });
}

// called by html
function unlock() {
    worker.postMessage({
        eventType: "unlock",
        message: strToHex("kibaekibaekibae"),
        aessource: document.querySelector('#unlockpassword').value
    });
}

// called by html
function showMnemonic() {
    worker.postMessage({
        eventType: "show-mnemonic"
    });
}

// called by html
function clearResults() {
    document.getElementById("result").innerHTML = ''
}

// // called by html
// function twoFAReset() {
//     worker.postMessage({
//         eventType: "tfars",
//         user_id: SampleUserID,
//         wallet_id: SampleWalletID,
//         clientmnemonic: document.querySelector('#mnemonic2').value,
//         accesstoken: document.querySelector('#accesstoken').value
//     });
// }

// called by html
function emSeedRequest() {
    worker.postMessage({
        eventType: "esr",
        user_id: SampleUserID,
        wallet_id: SampleWalletID,
        password: document.querySelector('#emseedpassword').value,
        confirmcode: document.querySelector('#confirmcode').value
    });
}

// called by html
function emRecover() {
    worker.postMessage({
        eventType: "em-recover",
        clientmnemonic: document.querySelector('#clientmnemonic').value,
        emseedcipher: document.querySelector('#emseedcipher').value,
        number_of_accounts: document.querySelector('#numofaccounts').value
    });
}

function terminateWorker() {
    worker.terminate();
    console.log("worker is terminated ...")
}

//////////////////////////////////////////////////////////
// helper functions

function strToHex(str){
    var hex, i;
    var result = "";
    for (i=0; i<str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}
