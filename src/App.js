// import './index.css'; // tailwind css import
import React, { useEffect, useState, useContext, useRef } from 'react';
import { EthersContext, contractInfo } from './ethers/EthersProvider';
import SquidCards from './components/SquidCards';
import HanaPegi from './components/HanaPegi';
import ShowInstruction from './components/ShowInstruction';
import Verification from './ethers/Verification';
import LeaderBoard from './components/LeaderBoard';
import title_img from './img/title.png'
import "./App.css";
import "./play.css";
import "./ellen.css";

function App() {

  const {
    networkId,
    initialized,
  } = useContext(EthersContext);

  return !initialized ? <div>loading...</div> : (
    <div className="App wrap" align="center" >
      <content>
        <header><img src={title_img} alt="LOGO" width="300pt" /></header>

        {/* <h2 align="center">
          {contractInfo[networkId].Network} &nbsp;&nbsp;
          <ShowInstruction />
        </h2> */}
        <Verification align="center" />
        <HanaPegi />

      </content>

      <LeaderBoard />

    </div>
  );
}

export default App;
