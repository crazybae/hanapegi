var appPropLocal = {
    csAddr: "localhost:8085",
    useTLS: false,
    skipInsecureTLS: true,
}

var appAWSTestEnv = {
    csAddr: "54.180.163.232:8085",
    useTLS: false,
    skipInsecureTLS: true,
}

// var appProp1 = appAWSTestEnv;
var appProp1 = appPropLocal

if( 'function' === typeof importScripts) {

    importScripts('./wasm_exec.js');

    const go = new Go();
    let mod, inst;
    addEventListener('message', async (e) => {
    
        if (e.data.eventType === "init") {
            // // polyfill
            if (!WebAssembly.instantiateStreaming) {
                WebAssembly.instantiateStreaming = async (resp, importObject) => {
                    const source = await (await resp).arrayBuffer();
                    return await WebAssembly.instantiate(source, importObject);
                };
            }
            WebAssembly.instantiateStreaming(fetch("./dkeyswasm.wasm"), go.importObject).then(
                async result => {
                    mod = result.module;
                    inst = result.instance;
            
                    await go.run(inst);
                }
            );
        } else if (e.data.eventType === "kg") {
            self.postMessage({done: true, msg: "starting key generation ..." });
            InitiateShares(e.data.aessource, e.data.user_id, e.data.wallet_id)
        } else if (e.data.eventType === "sg") {
            Sign(e.data.message, e.data.target_account_id)
        } else if (e.data.eventType === "rg") {
            self.postMessage({done: true, msg: "starting key recovery ..." });
            RecoverShare(e.data.aessource, e.data.user_id, e.data.wallet_id, e.data.mnemonic)
        } else if (e.data.eventType === "add-account") {
            self.postMessage({done: true, msg: "starting account addition ..." });
            AddAccount(e.data.aessource)
        } else if (e.data.eventType === "get-accounts") {
            GetAccounts()
        } else if (e.data.eventType === "change-active-account") {
            ChangeActiveAccount(e.data.active_account_id)
        } else if (e.data.eventType === "self-sign") {
            SelfSign(e.data.message)
        } else if (e.data.eventType === "check-password") {
            CheckPassword(e.data.aessource)
        } else if (e.data.eventType === "check-share-in-memory") {
            CheckShareInMemory()
        } else if (e.data.eventType === "clear-share-in-memory") {
            ClearShareInMemory()
        } else if (e.data.eventType === "unlock") {
            Unlock(e.data.message, e.data.aessource)
        } else if (e.data.eventType === "show-mnemonic") {
            ShowMnemonic()

        // } else if (e.data.eventType === "tfars") {
        //     Reset2FA(e.data.user_id, e.data.wallet_id, e.data.clientmnemonic, e.data.accesstoken)

        } else if (e.data.eventType === "esr") {
            EmSeedRequest(e.data.password, e.data.confirmcode, e.data.user_id, e.data.wallet_id)
        } else if (e.data.eventType === "em-recover") {
            EmRecover(e.data.clientmnemonic, e.data.emseedcipher, e.data.number_of_accounts)
        } else {
            self.postMessage({
                done: true,
                msg: "Invalid eventType"
            });
        }
    }, false);
}


///////////////////////////////////////////
//  dkeys worker js functions


const UCID = 1;
const CSID = 2;
const RSID = 3;

const ErrStr = "wasmerror"

var EncPV

var bgStatusKG = 0
var bgStatusSG = 0
var bgStatusRG = 0
var bgStatusESR = 0
var bgStatusTFARS = 0
var bgStatusAG = 0

//////////////////////////////////// FOR Key Share Generation

function InitiateShares(aessource, userID, walletID) {
    if (! bgStatusKG) {
        bgStatusKG = 1
        var appProp = appProp1
        ECInitiateShares(aessource, appProp, userID, walletID)
        bgStatusKG = 0
    } else {
        console.log("KG is running")
    }
}

function ECInitiateShares(aessource, appProp, userID, walletID) {
    let csws = connectToCSForKG(aessource, appProp, userID, walletID)
    if (csws != NaN || csws != undefined) {
        // console.log("PrepareConnections - SUCCESS cscw =", csws)
    } else {
        console.log("PrepareConnections - FAILED cscw =", csws)
    }
}

function connectToCSForKG(aessource, appProp, userID, walletID) {

    var authToken = "DUMMYTOKEN"
    var purposeCode = "KG"

    let csws = ConnectTo(appProp.csAddr, "/gen", appProp.useTLS, appProp.skipInsecureTLS)

    csws.addEventListener('open', function (event) {
        let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
        csws.send(JSON.stringify(sendData));
    });
    
    csws.onmessage = (event) => {
        let recData = JSON.parse(event.data);
        switch (recData.cmd) {
            case 'res-init-conn':
                let sendDataNotifyAllConnected = WASMKGFunction01(recData.job_id, userID, walletID)

                if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
                    console.log(sendDataNotifyAllConnected);
                    csws.close();
                    break;
                }
                csws.send(sendDataNotifyAllConnected)
                break;

            case 'KG2P01':
                let sendDataKG2P02 = WASMKGFunction11(JSON.stringify(recData), CSID)
                if (sendDataKG2P02.indexOf(ErrStr) != -1) {
                    console.log(sendDataKG2P02);
                    csws.close();
                    break;
                }
                csws.send(sendDataKG2P02)
                break;

            case 'KG2P03':
                let sendDataPDLZK01 = WASMKGFunction12(JSON.stringify(recData), CSID)
                if (sendDataPDLZK01.indexOf(ErrStr) != -1) {
                    console.log(sendDataPDLZK01);
                    csws.close();
                    break;
                }
                csws.send(sendDataPDLZK01)
                break;

            case 'PDLZK02':
                let sendDataPDLZK03 = WASMKGFunction41(JSON.stringify(recData), CSID)
                if (sendDataPDLZK03.indexOf(ErrStr) != -1) {
                    console.log(sendDataPDLZK03);
                    csws.close();
                    break;
                }
                csws.send(sendDataPDLZK03)
                break;

            case 'PDLZK04':
                let is_success = WASMKGFunction42(JSON.stringify(recData), CSID)
                if (is_success != "success") {
                    console.log("Error:", is_success)
                    csws.close()
                    self.postMessage({done: false, msg: is_success});
                }
                break;

            case 'DBPS01':
                let sendDataDBPS01 = WASMKGFunction51(JSON.stringify(recData), CSID)
                if (sendDataDBPS01.indexOf(ErrStr) != -1) {
                    console.log(sendDataDBPS01);
                    csws.close();
                    break;
                }
                csws.send(sendDataDBPS01)

                break;

            case 'DBPS02':
                let final_res = WASMKGFunction61(aessource)
                if (final_res.indexOf(ErrStr) != -1) {
                    console.log(final_res);
                    csws.close();
                    break;
                }

                let r = JSON.parse(final_res)
                console.log('[New Share Info]');
                console.log('Uid', r.Uid);
                console.log('Wid', r.Wid);
                console.log('Sid', r.Sid);
                console.log('EthAddress', r.EthAddress);
                console.log('OurPubKey', r.OurPubKey);
                console.log('UCPubKey', r.UCPubKey);

                EncPV = r.PVEncStr

                let res_string = "New Share Info - User ID: "+r.Uid+"  Wallet ID: "+r.Wid+"  Public Keys: "+r.OurPubKey

                csws.close()

                self.postMessage({done: true, msg: res_string});

                break;

            default:
        }
    }
    return csws
}

//////////////////////////////////// FOR ADD ACCOUNT (new)

function AddAccount(aessource) {

    if (! bgStatusAG) {
        bgStatusAG = 1

        var appProp = appProp1

        // check password
        let res = WASMPasswordCheck(aessource, EncPV)
        if (res != "verified") {
            self.postMessage({done: false, msg: res });
            bgStatusAG = 0
            return
        }

        let csws = connectToCSForAddAccount(aessource, appProp)
        if (csws != NaN || csws != undefined) {
            // console.log("PrepareConnections - SUCCESS cscw =", csws)
        }

        bgStatusAG = 0
    } else {
        console.log("Previous AG is running")
    }
}

function connectToCSForAddAccount(aessource, appProp) {

    var authToken = "DUMMYTOKEN"
    var purposeCode = "AG"

    let csws = ConnectTo(appProp.csAddr, "/gen", appProp.useTLS, appProp.skipInsecureTLS)

    csws.addEventListener('open', function (event) {
        let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
        csws.send(JSON.stringify(sendData));
    });
    
    csws.onmessage = (event) => {
        let recData = JSON.parse(event.data);
        
        console.log(recData.cmd)

        switch (recData.cmd) {
            case 'res-init-conn':
                
                let sendDataNotifyAllConnected = WASMAGFunction01(recData.job_id)

                if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
                    console.log(sendDataNotifyAllConnected);
                    csws.close();
                    break;
                }

                csws.send(sendDataNotifyAllConnected)

                let sendDataAGPS01 = WASMAGFunction02()

                if (sendDataAGPS01.indexOf(ErrStr) != -1) {
                    console.log(sendDataAGPS01);
                    csws.close();
                    break;
                }
                
                csws.send(sendDataAGPS01)
                
                break;

            case 'AGPS02':
                
                let res = WASMAGFunction03(JSON.stringify(recData), aessource, EncPV)
                
                if (res.indexOf(ErrStr) != -1) {
                    console.log(res);
                    csws.close();
                    break;
                }
                

                let r = JSON.parse(res)
                let res_string = "New Account Info - AccountID: "+r.AccountID+"  EthAddress: "+r.EthAddress
                console.log('[New Account Info] ', res_string);

                EncPV = r.NewPVEncStr   // pvenc replaced (with a new accout)

                csws.close()

                self.postMessage({done: true, msg: res_string});
                
                break;

            default:
        }
    }
    return csws
}

//////////////////////////////////// FOR SIGN

function Sign(message, accountid) {

    if (WASMCheckPV() == 'None') {
        self.postMessage({done: false, msg: 'There is no share in memory' });
        return
    }
    if (! bgStatusSG) {
        bgStatusSG = 1
        var appProp = appProp1
        ECSignV1(message, accountid, appProp)
        bgStatusSG = 0
    } else {
        console.log("SG is running")
    }
}

function ECSignV1(message, accountid, appProp) {

    let csws = connectToCSForSign(message, accountid, appProp)

    if (csws != NaN || csws != undefined) {
        // console.log("PrepareConnections - SUCCESS cscw =", csws)
    }
}

function connectToCSForSign(message, accountid, appProp) {

    var authToken = "DUMMYTOKEN"
    var purposeCode = "SG"

    let csws = ConnectTo(appProp.csAddr, "/sign", appProp.useTLS, appProp.skipInsecureTLS)

    csws.addEventListener('open', function (event) {
        let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
        csws.send(JSON.stringify(sendData));
    });
    
    csws.onmessage = (event) => {
        let recData = JSON.parse(event.data);
        switch (recData.cmd) {
            case 'res-init-conn':
                
                let sendDataNotifyAllConnected = WASMSGFunction01(
                    recData.job_id,
                    message,
                    Number(accountid))
                if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
                    console.log(sendDataNotifyAllConnected);
                    csws.close();
                    break;
                }
    
                csws.send(sendDataNotifyAllConnected)

                let sendDataSGPSVALILDENC = WASMSGSGPSVALILDENC(CSID)
                if (sendDataSGPSVALILDENC.indexOf(ErrStr) != -1) {
                    console.log(sendDataSGPSVALILDENC);
                    csws.close();
                    break;
                }
                csws.send(sendDataSGPSVALILDENC)
                break;

            default:
        }

        if (recData.length >= 1) {
            switch (recData[0].cmd) {
                case 'SGPS01':
                    let sendDataSGPS02 = WASMSGFunction02(JSON.stringify(recData), CSID)
                    if (sendDataSGPS02.indexOf(ErrStr) != -1) {
                        console.log(sendDataSGPS02);
                        csws.close();
                        break;
                    }
                    csws.send(sendDataSGPS02)
                    break;

                case 'SGPS03':
                    let sendDataSGPS04 = WASMSGFunction03(JSON.stringify(recData), CSID)
                    if (sendDataSGPS04.indexOf(ErrStr) != -1) {
                        console.log(sendDataSGPS04);
                        csws.close();
                        break;
                    }
                    csws.send(sendDataSGPS04)
                    break;

                case 'SGPS05':
                    csws.close()
                    let signResult = WASMSGFunction04(JSON.stringify(recData), CSID)
                    if (signResult.indexOf(ErrStr) != -1) {
                        console.log(signResult);
                        break;
                    }
                    console.dir(signResult)
                    let otsGenResult = WASMSeedGeneration()
                    if (otsGenResult.indexOf(ErrStr) != -1) {
                        console.log(otsGenResult);
                        break;
                    }
                        
                    self.postMessage({done: true, msg: signResult});

                    break;
    
                default:
                    // console.log(">>>>>>>>>>>>> CS UNCHECKED recData Array :", recData);
            }
        }
    }
    return csws
}



//////////////////////////////////// FOR Key Share Recovery

function RecoverShare(aessource, userID, walletID, mnemonic) {
    if (! bgStatusRG) {
        bgStatusRG = 1
        var appProp = appProp1
        ECRecoverShares(aessource, userID, walletID, mnemonic, appProp)
        bgStatusRG = 0
    } else {
        console.log("RG is running")
    }
}

function ECRecoverShares(aessource, userID, walletID, mnemonic, appProp) {

    // inject mnemonic and receive Sid
    let res = WASMRGPrepare(mnemonic, "datetime-string")
    if (res.indexOf(ErrStr) != -1) {
        console.log(res);
        return;
    }
    console.log("Preparation: ", res)
    // 2FA and receive Uid, Sid
    //   userID, walletID = 2FA(sid)

    // to-do:  기존의 account id list를 app server에서 받아서 아래 connectToCSForRG에 넘겨주자...

    // use received Uid, Sid (this sample just uses fixed userID, walletID)
    let csws = connectToCSForRG(aessource, userID, walletID, appProp)
    if (csws != NaN || csws != undefined) {
        // console.log("PrepareConnections - SUCCESS cscw =", csws)
    } else {
        console.log("PrepareConnections - FAILED cscw =", csws)
    }
}

function connectToCSForRG(aessource, userID, walletID, appProp) {

    var authToken = "DUMMYTOKEN"
    var purposeCode = "RG"

    let csws = ConnectTo(appProp.csAddr, "/gen", appProp.useTLS, appProp.skipInsecureTLS)

    csws.addEventListener('open', function (event) {
        let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
        csws.send(JSON.stringify(sendData));
    });
    
    csws.onmessage = (event) => {
        let recData = JSON.parse(event.data);
        switch (recData.cmd) {
            case 'res-init-conn':

                let sendDataNotifyAllConnected = WASMRGFunction01(recData.job_id, userID, walletID) //document.querySelector('#mnemonic').value)
                if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
                    console.log(sendDataNotifyAllConnected);
                    csws.close();
                    break;
                }
                csws.send(sendDataNotifyAllConnected)
                break;

            case 'VALIDDBPS01':
                //  이거 받지 않으면 다음 것 진행하지 못하게 해야 함 이 다음은 똑 같음
                let isok = WASMRGFunction02(JSON.stringify(recData))
                if (isok.indexOf(ErrStr) != -1) {
                    console.log(isok);
                    csws.close();
                    break;
                }
                break;
    
            case 'KG2P01':
                let sendDataKG2P02 = WASMRGFunction11(JSON.stringify(recData), CSID) //, userID, walletID)
                if (sendDataKG2P02.indexOf(ErrStr) != -1) {
                    console.log(sendDataKG2P02);
                    csws.close();
                    break;
                }
                csws.send(sendDataKG2P02)
                break;

            case 'KG2P03':
                let sendDataPDLZK01 = WASMKGFunction12(JSON.stringify(recData), CSID)
                if (sendDataPDLZK01.indexOf(ErrStr) != -1) {
                    console.log(sendDataPDLZK01);
                    csws.close();
                    break;
                }
                csws.send(sendDataPDLZK01)
                break;

            case 'PDLZK02':
                let sendDataPDLZK03 = WASMKGFunction41(JSON.stringify(recData), CSID)
                if (sendDataPDLZK03.indexOf(ErrStr) != -1) {
                    console.log(sendDataPDLZK03);
                    csws.close();
                    break;
                }
                csws.send(sendDataPDLZK03)
                break;

            case 'PDLZK04':
                let is_success = WASMKGFunction42(JSON.stringify(recData), CSID)
                if (is_success != "success") {
                    console.log("Error:", is_success)
                    csws.close()
                    self.postMessage({done: false, msg: is_success});
                }
                // let is_success = WASMKGFunction42wRangeProof(JSON.stringify(recData), CSID)
                break;

            case 'DBPS01':
                let sendDataDBPS01 = WASMKGFunction51(JSON.stringify(recData), CSID)
                if (sendDataDBPS01.indexOf(ErrStr) != -1) {
                    console.log(sendDataDBPS01);
                    csws.close();
                    break;
                }
                csws.send(sendDataDBPS01)

                break;

            case 'DBPS02':
                let final_res = WASMKGFunction61(aessource)
                if (final_res.indexOf(ErrStr) != -1) {
                    console.log(final_res);
                    csws.close();
                    break;
                }

                let r = JSON.parse(final_res)
                console.log('[Recovered Share Info]');
                console.log('Uid', r.Uid);
                console.log('Wid', r.Wid);
                console.log('Sid', r.Sid);
                console.log('EthAddress', r.EthAddress);
                console.log('OurPubKey', r.OurPubKey);
                console.log('UCPubKey', r.UCPubKey);

                EncPV = r.PVEncStr

                let res_string = "Recovered Share Info - User ID: "+r.Uid+"  Wallet ID: "+r.Wid+"  Public Keys: "+r.OurPubKey

                csws.close()

                self.postMessage({done: true, msg: res_string});

                break;

            default:
        }
    }
    return csws
}


//////////////////////////////////// FOR Emergency Seed Request

function EmSeedRequest(password, confirmcode, userID, walletID) {

    // console.log("in EmSeedRequest,", email)

    if (WASMCheckPV() == 'None') {
        self.postMessage({done: false, msg: 'There is no share in memory' });
        return
    }
    if (! bgStatusESR) {
        bgStatusESR = 1
        var appProp = appProp1
        ECEmSeedRequest(password, confirmcode, userID, walletID, appProp)
        bgStatusESR = 0
    } else {
        console.log("SG is running")
    }
}

function ECEmSeedRequest(password, confirmcode, userID, walletID, appProp) {

    let csws = connectToCSForESR(password, confirmcode, userID, walletID, appProp)

    if (csws != NaN || csws != undefined) {
        // console.log("PrepareConnections - SUCCESS cscw =", csws)
    }
}

function connectToCSForESR(password, confirmcode, userID, walletID, appProp) {

    var authToken = "DUMMYTOKEN"
    var purposeCode = "ESR"

    let csws = ConnectTo(appProp.csAddr, "/gen", appProp.useTLS, appProp.skipInsecureTLS)

    csws.addEventListener('open', function (event) {
        let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
        csws.send(JSON.stringify(sendData));
    });
    
    csws.onmessage = (event) => {
        let recData = JSON.parse(event.data);
        switch (recData.cmd) {
            case 'res-init-conn':
                
                let sendDataNotifyAllConnected = WASMESRFunction01(
                    recData.job_id, userID, walletID, password, confirmcode)
                if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
                    console.log(sendDataNotifyAllConnected);
                    csws.close();
                    break;
                }
    
                csws.send(sendDataNotifyAllConnected)

                let acctoken = "ACC-TOKEN"
                let sendDataESRPS01 = WASMESRFunction02(acctoken, CSID)
                if (sendDataESRPS01.indexOf(ErrStr) != -1) {
                    console.log(sendDataESRPS01);
                    csws.close();
                    break;
                }
                csws.send(sendDataESRPS01)
                break;

            case 'ESR2P02':

                if (recData.ok == 0) {
                    console.log('Err:', recData.message)
                    self.postMessage({done: false, msg: recData.message});
                } else {
                    console.log(recData.message)
                    self.postMessage({done: true, msg: recData.message});
                }

                csws.close()
                break;

            default:
                // console.log(">>>>>>>>>>>>> CS UNCHECKED recData Array :", recData);
        }
    }
    return csws
}


// //////////////////////////////////// FOR 2FA Reset Request

// function Reset2FA(userID, walletID, mnemonic, accesstoken) {

//     /// check client mnemonic and get SID
//     let res = WASMTFARSPrepare(mnemonic)
//     if (res.indexOf(ErrStr) != -1) {
//         console.log(res);
//         self.postMessage({done: false, msg: 'invalid mnemonic' });
//         return;
//     }
//     let shareID = JSON.parse(res).sid
//     // console.dir(shareID)

//     self.postMessage({done: true, msg: 'SID:'+ shareID });

//     /// request 2fa reset

//     if (! bgStatusTFARS) {
//         bgStatusTFARS = 1
//         var appProp = appProp1
//         TwoFSResetRequest(userID, walletID, shareID, mnemonic, accesstoken, appProp)
//         bgStatusTFARS = 0
//     } else {
//         console.log("2FA Reset is running")
//     }
// }

// function TwoFSResetRequest(userID, walletID, shareID, mnemonic, accesstoken, appProp) {

//     let csws = connectToCSForTFARS(userID, walletID, shareID, mnemonic, accesstoken, appProp)

//     if (csws != NaN || csws != undefined) {
//         // console.log("PrepareConnections - SUCCESS cscw =", csws)
//     }
// }

// function connectToCSForTFARS(userID, walletID, shareID, mnemonic, accesstoken, appProp) {

//     var authToken = "DUMMYTOKEN"
//     var purposeCode = "TFARS"

//     let csws = ConnectTo(appProp.csAddr, "/gen", appProp.useTLS, appProp.skipInsecureTLS)

//     csws.addEventListener('open', function (event) {
//         let sendData = {cmd: "req-init-conn", type: "app", purpose: purposeCode, auth_token: authToken}
//         csws.send(JSON.stringify(sendData));
//     });
    
//     csws.onmessage = (event) => {
//         let recData = JSON.parse(event.data);
//         switch (recData.cmd) {
//             case 'res-init-conn':
                
//                 let sendDataNotifyAllConnected = WASMTFARSFunction01(
//                     recData.job_id, userID, walletID, shareID)
//                 if (sendDataNotifyAllConnected.indexOf(ErrStr) != -1) {
//                     console.log(sendDataNotifyAllConnected);
//                     csws.close();
//                     break;
//                 }
    
//                 csws.send(sendDataNotifyAllConnected)

//                 let sendDataTFARSPS01 = WASMTFARSFunction02(mnemonic, accesstoken, CSID)
//                 if (sendDataTFARSPS01.indexOf(ErrStr) != -1) {
//                     console.log(sendDataTFARSPS01);
//                     csws.close();
//                     break;
//                 }
//                 csws.send(sendDataTFARSPS01)
//                 break;

//             case 'TFARSPS02':

//                 if (recData.ok == 0) {
//                     console.log('Err:', recData.message)
//                     self.postMessage({done: false, msg: recData.message});
//                 } else {
//                     console.log(recData.message)
//                     self.postMessage({done: true, msg: recData.message});
//                 }

//                 csws.close()
//                 break;

//             default:
//                 // console.log(">>>>>>>>>>>>> CS UNCHECKED recData Array :", recData);
//         }
//     }
//     return csws
// }



/////////////////////////////////////////////////////////////////
// connect to

function ConnectTo(addr, path, useTLS, skipInsecureTLS) {

    return new WebSocket("ws://"+addr+path, "token")
}

/////////////////////////////////////////////////////////////////
// account management (new)

function GetAccounts() {

    let res = WASMGetAccounts()
    if (res.indexOf(ErrStr) != -1) {
        self.postMessage({done: false, msg: res });
    } else {
        self.postMessage({done: true, msg: res });
    }
}


function ChangeActiveAccount(aaid) {
    let res = WASMChangeActiveAccount(Number(aaid))
    if (res.indexOf(ErrStr) != -1) {
        self.postMessage({done: false, msg: res });
    } else {
        self.postMessage({done: true, msg: res });
    }
}

/////////////////////////////////////////////////////////////////
// this function inject encpv for unlocking
function SelfSign(message) {

    let self_sig = WASMUCSign(message)
    if (self_sig.indexOf(ErrStr) != -1) {
        self.postMessage({done: false, msg: self_sig });
    } else {
        let sig = JSON.parse(self_sig)
        self.postMessage({done: true, msg: 'Sig R:'+ sig.r + ', Sig S:'+ sig.s });
    }
}


function CheckPassword(aessource) {

    let res = WASMPasswordCheck(aessource, EncPV)
    if (res == "verified") {
        self.postMessage({done: true, msg: "Your password is verified" });
    } else {
        self.postMessage({done: false, msg: res });
    }
}

function CheckShareInMemory() {
    if (WASMCheckPV() == 'None') {
        self.postMessage({done: true, msg: 'There is no share in memory' });
    } else {
        self.postMessage({done: true, msg: 'Share exists in memory' });
    }
}

function ClearShareInMemory() {
    self.postMessage({done: true, msg: WASMClearPV() });
}


function Unlock(message, aessource) {

    let res = WASMUnlock(message, aessource, EncPV)

    if (res.indexOf(ErrStr) != -1) {
        console.log(res);
        self.postMessage({done: false, msg: res });
        return;
    }
    
    let r = JSON.parse(res)
    if (r.Status == 'Verified') {
        self.postMessage({done: true, msg: "Unlock is verified" });
    }

    if (r.Status == 'Migrated') {
        EncPV = r.PVEncStr
        self.postMessage({done: true, msg: "Share is migrated" });
    }
}


function ShowMnemonic() {

    let mnemonic = WASMShowMnemonic()
    if (mnemonic.indexOf(ErrStr) != -1) {
        self.postMessage({done: false, msg: mnemonic });
    } else {
        self.postMessage({done: true, msg: mnemonic });
    }
}

function EmRecover(clientmnemonic, emseedcipher, numofaccounts) {

    let res = WASMEmergentRecovery(clientmnemonic, emseedcipher, Number(numofaccounts))

    if (res.indexOf(ErrStr) != -1) {
        self.postMessage({done: false, msg: res });
    } else {
        self.postMessage({done: true, msg: res });
    }
}
