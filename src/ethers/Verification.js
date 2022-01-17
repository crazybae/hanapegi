import React, { useEffect, useState, useContext, useRef } from 'react';
import { ethers } from "ethers";
import config from '../config';
import { EthersContext } from './EthersProvider';
import Button from 'react-bootstrap/Button';
import verify_img from '../img/icon-verify.png'
import "../App.css";
import "../play.css";
import "../ellen.css";

function Verification(props) {

  const {
    provider, signer,
    account, setAccount,
    networkId, setNetworkId,
    verified, setVerified,
  } = useContext(EthersContext);

  const signAndVerify = async () => {

    const randomMessage = `${+ new Date()}`;
    const signature = await signer.current.signMessage(randomMessage);

    const digest = ethers.utils.arrayify(ethers.utils.hashMessage(randomMessage));
    let recoveredAddress = ethers.utils.recoverAddress(digest, signature);

    if (recoveredAddress === account) {
      setVerified(true);
    } else {
      setVerified(true);
    }
  }

  ///////////////////////////

  const eip712Sign = async () => {

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


  return (
    <>
      <p align={props.align}>
        {account}&nbsp;&nbsp;
        <Button id='signAndVerifyBtn' onClick={signAndVerify} disabled={verified} >
          {(verified) ? 'Verified' : 'Click me to verify'}
        </Button>
      </p>
    </>
  );
}

export default Verification;
