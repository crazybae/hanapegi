import React, { useEffect, useState, useRef } from 'react';
import { ethers } from "ethers";

import config from '../config';
const currentConfig = config.testnet;


const availableNetworks = [5]; // goerli only
const rootChainID = 5;

export const contractInfo = {
  1: {
    "Network": "Mainnet",
    "MainCardAddress": currentConfig.nftCardAddress,
  },
  5: {
    "Network": "Goerli Testnet",
    "MainCardAddress": currentConfig.nftCardAddress,
  },
  0: {
    "Network": "Undefined",
    "MainCardAddress": '',
  },
};

export const EthersContext = React.createContext(null);

export default (props) => {

  const [account, setAccount] = useState('');
  const [networkId, setNetworkId] = useState(0);
  const [verified, setVerified] = useState(false);
  const [initialized, setInitialized] = useState(false)

  let provider = useRef(null);
  let signer = useRef(null);
  let accounts = useRef(null);

  if (typeof window.ethereum === 'undefined') {
    return <div>You need an ethereum wallet extention to play this game ...</div>;
  }

  useEffect(() => {
    startApp();
  }, []);

  const startApp = async () => {
    try {

      if (!provider.current) {
        provider.current = new ethers.providers.Web3Provider(window.ethereum);
      }
      let chainId = (await provider.current.getNetwork()).chainId;

      if (chainId !== rootChainID) {
        await switchToRootChain();
        chainId = (await provider.current.getNetwork()).chainId;
      }

      let accts = await provider.current.listAccounts();
      if (accts.length <= 0) {
        await connectWallet();
      }

      signer.current = provider.current.getSigner();
      let myacc = await signer.current.getAddress();

      await watchChainAccount();

      setNetworkId(chainId);
      setAccount(myacc);
      setInitialized(true)

    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  const connectWallet = async () => {
    accounts.current = await window.ethereum
      .request({ method: 'eth_requestAccounts' });
  }

  const watchChainAccount = async () => {
    provider.current.on("accountsChanged", (accounts) => {
      startApp();
    });
    provider.current.on("chainChanged", (chainId) => {
      // startApp();
      // alert("Network changed to " + contractInfo[parseInt(chainId)].Network);
    });
    // provider.current.on("connect", (connectInfo) => {
    //   alert("Connected to Ethereum network");
    // });      
    provider.current.on("disconnect", (error) => {
      alert("Disconnected from Ethereum network");
    });
  }

  const switchToRootChain = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + rootChainID.toString(16) }],
      });

    } catch (switchError) {
      alert(`Add the network ${rootChainID} into your wallet`);
    }

    provider.current = new ethers.providers.Web3Provider(window.ethereum);
  };

  const contextValues = {
    provider,
    signer,
    account,
    setAccount,
    networkId,
    setNetworkId,
    verified,
    setVerified,
    initialized
  }

  return (

    // if (!this.state.loaded) {
    //   return <div>Change your wallet network into Goerli testnet and press F5 ...</div>;
    // }
    // return (

    <>
      <EthersContext.Provider value={contextValues}>{props.children}</EthersContext.Provider>
    </>

  );
}
