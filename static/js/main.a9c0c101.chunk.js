(this.webpackJsonpsquidrpsweb=this.webpackJsonpsquidrpsweb||[]).push([[0],{21:function(e,t){e.exports={testnet:{nftCardAddress:"0xC814aFD17170d2A8c02C9f0E8B7bA8Bf96aB75Ff",leedoCoinAddress:"0xbC66FB9821A757a684364266Fb856513A189dbF7",leedoVaultAddress:"0xBF6CC26C2cA10B59AA68fca6EdAc0773cE306c97",maticCoinAddress:"0xCa5DdD47F2f321ae54610d20BD29D1ff6F9bAE97",maticNFTAddress:"0x2E39443148785c9be0d7343799Ed48672381e056",raffleAddress:"0xb109173Ab57Dab7F954Ef8F10D87a5bFDB740EEB",erc20PredicateAddress:"0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34",erc721PredicateAddress:"0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b",rootChainManagerAddress:"0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74",childChainManagerAddress:"0xb5505a6d998549090530911180f38aC5130101c6",L1ChainID:5,L2ChainID:80001,leedoCoinDecimals:18,maticCoinDecimals:18,parentProvider:"https://goerli.infura.io/v3/",maticProvider:"https://rpc-mumbai.maticvigil.com/",leedoFaucetAddress:"0x1C2eB54997aD433D82D41e028eDa71eEcAAd2eE3",leedoBridgeServerAddress:"http://leedobridge.dekey.app:18881/"},abi:{SquidNFTABI:["function ownerOf(uint256 tokenId) external view returns (address)","function balanceOf(address owner) external view returns (uint256)","function getGenes(uint256 _tokenId) public view returns (uint8[8])","function getConsonants(uint256 _tokenId) public view returns (string[3])","function getConsonantsIndex(uint256 _tokenId) public view returns (uint8[3])","function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)","function tokenURI(uint256 _tokenId) public view returns (string)","function claim() external"],LeedoCoinABI:["function approve(address spender, uint256 amount) external returns (bool)","function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)","function transfer(address recipient, uint256 amount) external returns (bool)","function balanceOf(address account) external view returns (uint256)","function totalSupply() external view returns (uint256)","function allowance(address owner, address spender) external view returns (uint256)"]}}},32:function(e,t,n){},33:function(e,t,n){},34:function(e,t,n){},66:function(e,t,n){},70:function(e,t){},95:function(e,t,n){"use strict";n.r(t);var r=n(3),c=n.n(r),a=n(20),s=n.n(a),i=(n(66),n(2)),o=n.n(i),u=n(11),d=n(8),l=n(16),A=n(21),b=n.n(A),g=n(6),h=b.a.testnet,v={1:{Network:"Mainnet",MainCardAddress:h.nftCardAddress},5:{Network:"Goerli Testnet",MainCardAddress:h.nftCardAddress},0:{Network:"Undefined",MainCardAddress:""}},m=c.a.createContext(null),j=function(e){var t=Object(r.useState)(""),n=Object(d.a)(t,2),c=n[0],a=n[1],s=Object(r.useState)(0),i=Object(d.a)(s,2),A=i[0],b=i[1],h=Object(r.useState)(!1),v=Object(d.a)(h,2),j=v[0],f=v[1],p=Object(r.useState)(!1),w=Object(d.a)(p,2),x=w[0],I=w[1],O=Object(r.useRef)(null),C=Object(r.useRef)(null),S=Object(r.useRef)(null);if("undefined"===typeof window.ethereum)return Object(g.jsx)("div",{children:"You need an ethereum wallet extention to play this game ..."});Object(r.useEffect)((function(){k()}),[]);var k=function(){var e=Object(u.a)(o.a.mark((function e(){var t,n;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,O.current||(O.current=new l.a.providers.Web3Provider(window.ethereum)),e.next=4,O.current.getNetwork();case 4:if(5===(t=e.sent.chainId)){e.next=11;break}return e.next=8,R();case 8:return e.next=10,O.current.getNetwork();case 10:t=e.sent.chainId;case 11:return e.next=13,O.current.listAccounts();case 13:if(!(e.sent.length<=0)){e.next=17;break}return e.next=17,D();case 17:return C.current=O.current.getSigner(),e.next=20,C.current.getAddress();case 20:return n=e.sent,e.next=23,B();case 23:b(t),a(n),I(!0),e.next=32;break;case 28:e.prev=28,e.t0=e.catch(0),alert("Failed to load web3, accounts, or contract. Check console for details."),console.error(e.t0);case 32:case"end":return e.stop()}}),e,null,[[0,28]])})));return function(){return e.apply(this,arguments)}}(),D=function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.ethereum.request({method:"eth_requestAccounts"});case 2:S.current=e.sent;case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B=function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:O.current.on("accountsChanged",(function(e){k()})),O.current.on("chainChanged",(function(e){})),O.current.on("disconnect",(function(e){alert("Disconnected from Ethereum network")}));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+5..toString(16)}]});case 3:e.next=8;break;case 5:e.prev=5,e.t0=e.catch(0),alert("Add the network ".concat(5," into your wallet"));case 8:O.current=new l.a.providers.Web3Provider(window.ethereum);case 9:case"end":return e.stop()}}),e,null,[[0,5]])})));return function(){return e.apply(this,arguments)}}(),F={provider:O,signer:C,account:c,setAccount:a,networkId:A,setNetworkId:b,verified:j,setVerified:f,initialized:x};return Object(g.jsx)(g.Fragment,{children:Object(g.jsx)(m.Provider,{value:F,children:e.children})})},f=n(22),p=n(19);n(32),n(33),n(34),b.a.abi.SquidNFTABI;var w={gameServerURL:"ws://209.182.235.114:12321/rps",boardURL:"http://209.182.235.114:12321/board",useTLS:!1,skipInsecureTLS:!0},x=n.p+"static/media/hand-paper.870fc736.png",I=n.p+"static/media/hand-scissors.2f283daf.png",O=b.a.abi.SquidNFTABI,C=0;function S(e){return document.getElementById(e)}var k={1:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuZWRhMmIzZiwgMjAyMS8xMS8xNC0xMjozMDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjEgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMS0xMlQxODowMjoyMiswOTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDEtMDZUMTM6MDY6MzkrMDk6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDEtMDZUMTM6MDY6MzkrMDk6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNkYmU3Yjk5LWI3N2ItZWE0MS05MWFhLTY1NGVjNmVlMGY1ZiIgeG1wTU06RG9jdW1lbnRJRD0i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",2:x,3:I},D="TWO_CARDS",B="REMOVE_CARD",R=function(e){var t=Object(r.useContext)(m),n=t.provider,c=(t.signer,t.account),a=(t.setAccount,t.networkId),s=(t.setNetworkId,t.verified),i=Object(r.useState)(0),A=Object(d.a)(i,2),b=A[0],h=A[1],j=Object(r.useState)(null),x=Object(d.a)(j,2),I=x[0],R=x[1],F=Object(r.useState)([]),Q=Object(d.a)(F,2),E=Q[0],M=Q[1],y=Object(r.useState)(null),U=Object(d.a)(y,2),G=U[0],L=U[1],N=Object(r.useState)(""),W=Object(d.a)(N,2),J=W[0],V=W[1],Y=Object(r.useState)(""),T=Object(d.a)(Y,2),Z=(T[0],T[1]),P=Object(r.useState)(!1),z=Object(d.a)(P,2),K=z[0],X=z[1],H=Object(r.useState)(""),q=Object(d.a)(H,2),_=q[0],$=q[1],ee=Object(r.useState)(!1),te=Object(d.a)(ee,2),ne=te[0],re=te[1],ce=Object(r.useState)(null),ae=Object(d.a)(ce,2),se=ae[0],ie=ae[1],oe=Object(r.useState)(null),ue=Object(d.a)(oe,2),de=ue[0],le=ue[1],Ae=Object(r.useState)(null),be=Object(d.a)(Ae,2),ge=be[0],he=be[1],ve=Object(r.useState)(null),me=Object(d.a)(ve,2),je=me[0],fe=me[1];Object(r.useEffect)((function(){pe()}),[]);var pe=function(){var e=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=new l.a.Contract(v[a].MainCardAddress,O,n.current),e.t0=h,e.next=5,t.balanceOf(c);case 5:e.t1=e.sent.toNumber(),(0,e.t0)(e.t1),R(t),S("consoleimg_r").style.display="block",S("consoleimg_g").style.display="block",S("tvimg_l").style.display="block",S("tvimg_r").style.display="block",e.next=17;break;case 14:e.prev=14,e.t2=e.catch(0),console.log(e.t2);case 17:case"end":return e.stop()}}),e,null,[[0,14]])})));return function(){return e.apply(this,arguments)}}(),we=function(){var e=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s){e.next=3;break}return alert("Please verify you first!"),e.abrupt("return");case 3:if(0!==b){e.next=6;break}return alert("Your account ".concat(c," has no Squid Game cards. Please use another address having cards")),e.abrupt("return");case 6:return $("Waiting"),X(!0),M([]),e.next=11,xe(1);case 11:t=e.sent,"",t.forEach((function(e){Z(e.rps),L(e.image),V("Token ID ".concat(e.tokenID))})),X(!1),M(Object(f.a)(t)),re(!0);case 17:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),xe=function(){var e=Object(u.a)(o.a.mark((function e(t){var n,r,a,s,i,u,d;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(b<=0)){e.next=3;break}return alert("you don't have cards in your account,",c),e.abrupt("return");case 3:n=[],r=0;case 5:if(!(r<t)){e.next=21;break}return e.next=8,I.tokenOfOwnerByIndex(c,(o=0,l=b,o=Math.ceil(o),l=Math.floor(l),Math.floor(Math.random()*(l-o))+o));case 8:return a=e.sent,e.next=11,I.getGenes(a);case 11:return s=e.sent,i=s.map((function(e){return e%3+1})),e.next=15,I.tokenURI(a);case 15:u=e.sent,d=JSON.parse(atob(u.substring(29))),n.push({tokenID:a.toNumber(),image:d.image,rps:i});case 18:r++,e.next=5;break;case 21:return e.abrupt("return",n);case 22:case"end":return e.stop()}var o,l}),e)})));return function(t){return e.apply(this,arguments)}}(),Ie=Object(r.useState)(!1),Oe=Object(d.a)(Ie,2),Ce=(Oe[0],Oe[1]),Se=Object(r.useRef)(0),ke=Object(r.useRef)(null),De=function(){for(var e=E.length,t=[],n=0;n<e;n++){var r=E[n].rps;t.push([r[0],r[1]]),t.push([r[2],r[3]]),t.push([r[4],r[5]]),t.push([r[6],r[7]])}return console.log("Combat Pairs",t),t},Be=function(){var e=Object(u.a)(o.a.mark((function e(){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:ie(null),le(null),he(null),fe(null),S("myPoints").innerHTML="0 Points",Re(c,De(),w);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Re=function(e,t,n){var r;ke.current=new WebSocket(n.gameServerURL);var c,a,s=0,i=0;ke.current.addEventListener("open",(function(t){ke.current.send(JSON.stringify({cmd:"REQ_CONNECT",address:e,auth_token:"DUMMYTOKEN"}))})),ke.current.addEventListener("message",(function(e){var n,o,u=JSON.parse(e.data);switch(u.cmd){case"WAIT_GAME":console.log(u),$("Waiting"),X(!0);break;case"START_GAME":console.log(u),Se.current=0,c=t[s][0],a=t[s][1],r={cmd:D,card1:c,card2:a},X(!1),console.log("(first round) MY CARDS",r),ke.current.send(JSON.stringify(r));break;case"REJECT_GAME":console.log("game is rejected since",u.message);break;case"TWO_CARDS":console.log("CPTY_CARDS",u),ie(k[c]),le(k[a]),he(k[u.card1]),fe(k[u.card2]),Se.current=0,Ce(!0);var d=S("countdown");C=5,d.style.display="block";var l=setInterval((function(){0==C?(d.style.display="none",clearInterval(l)):(d.innerText=C,C-=1)}),1e3);setTimeout((function(){0===Se.current&&(Ce(!1),C=0,console.log("Automatic Choice is 2"),Se.current=2,ke.current.send(JSON.stringify({cmd:B,removed_card_num:2})))}),5e3);break;case"FINAL_RESULT":if(console.log("*** Final result",u),console.log("currentRound: ".concat(s,", myRemovedCard: ").concat(Se.current)),t[s][2-Se.current]!==u.your_choice){alert("1. my choice is wrong - mine: ".concat(t[s][2-Se.current]," vs server ").concat(u.your_choice)),ke.current.close("1. my choice is wrong - mine: ".concat(t[s][2-Se.current]," vs server ").concat(u.your_choice));break}if(Se.current!==u.your_removed_card_num){alert("2. my choice is wrong - mine: ".concat(Se.current," vs server ").concat(u.your_removed_card_num)),ke.current.close("2. my choice is wrong - mine: ".concat(Se.current," vs server ").concat(u.your_removed_card_num));break}var A=(n=u.cpty_choice,o=u.your_choice,n===o?0:1===n?2===o?1:-1:2===n?3===o?1:-1:3===n?1===o?1:-1:void 0);if(A!==u.result){alert("3. RPS result is wrong - RPS: ".concat(A," vs server ").concat(u.result)),ke.current.close("3. RPS result is wrong - RPS: ".concat(A," vs server ").concat(u.result));break}if(1===A){if(++i!==u.point){alert("4. point result is wrong - mine: ".concat(i+1," vs server ").concat(u.point)),ke.current.close("4. point result is wrong - mine: ".concat(i+1," vs server ").concat(u.point));break}$("You Win ^^"),X(!0),setTimeout((function(){X(!1)}),1e3)}else-1===A?($("You Lose TT"),X(!0),setTimeout((function(){X(!1)}),1e3)):($("Draw --"),X(!0),setTimeout((function(){X(!1)}),1e3));1===u.your_removed_card_num?ie(null):le(null),1===u.cpty_removed_card_num?he(null):fe(null),S("myPoints").innerHTML="".concat(i," Points"),s++,console.log("new round: ".concat(s)),s<4?(console.log("new round started: ".concat(s)),c=t[s][0],a=t[s][1],r={cmd:D,card1:c,card2:a},console.log("(new round) MY CARDS",r),ke.current.send(JSON.stringify({cmd:D,card1:c,card2:a}))):($("You've got ".concat(i," points")),X(!0),setTimeout((function(){ie(null),le(null),he(null),fe(null),X(!1)}),5e3));break;default:console.log("abnormal message from server - ".concat(u))}})),ke.current.addEventListener("close",(function(e){console.log("network is closed")}))};return b<=0?Object(g.jsxs)("div",{align:"center",children:["you don't have cards in your account, ",c]}):Object(g.jsxs)(g.Fragment,{children:[Object(g.jsxs)("div",{className:"box_wrap",children:[Object(g.jsxs)("div",{className:"Choices",children:[Object(g.jsx)(p.a,{type:"button",id:"yourChoicesBtn",onClick:we,disabled:!s,children:"Get a Random Card"}),Object(g.jsx)("span",{children:Object(g.jsx)("img",{src:G,width:"100pt",alt:""})}),Object(g.jsx)("br",{}),Object(g.jsx)("span",{children:J})]}),Object(g.jsxs)("div",{className:"ready",children:[Object(g.jsx)(p.a,{id:"runGameBtn",onClick:Be,disabled:!ne,children:"Start"}),K&&Object(g.jsx)("div",{className:"msg_box",id:"msg_box_waiting",children:Object(g.jsxs)("div",{className:"msg_waitiing",children:[Object(g.jsx)("div",{className:"loader"}),Object(g.jsx)("h3",{children:_})]})})]})]}),Object(g.jsxs)("div",{id:"game_warp",children:[Object(g.jsx)("span",{className:"backImg"}),Object(g.jsxs)("div",{id:"game",children:[Object(g.jsxs)("div",{className:"tv",children:[Object(g.jsx)("span",{className:"hand left",children:Object(g.jsx)("img",{id:"tvimg_l",src:ge,alt:""})}),Object(g.jsx)("span",{className:"hand right",children:Object(g.jsx)("img",{id:"tvimg_r",src:je,alt:""})})]}),Object(g.jsxs)("div",{className:"game_console",children:[Object(g.jsx)("div",{id:"countdown"}),Object(g.jsx)("button",{type:"button",className:"game_console_btn red",id:"btn_red",value:"0",onClick:function(){0===Se.current&&null!=ke.current&&(Ce(!1),C=0,console.log("MY Choice is 1"),Se.current=2,ke.current.send(JSON.stringify({cmd:B,removed_card_num:2})))},children:Object(g.jsx)("img",{id:"consoleimg_r",src:se,alt:""})}),Object(g.jsx)("button",{type:"button",className:"game_console_btn green",id:"btn_green",value:"0",onClick:function(){0===Se.current&&null!=ke.current&&(Ce(!1),C=0,console.log("MY Choice is 2"),Se.current=1,ke.current.send(JSON.stringify({cmd:B,removed_card_num:1})))},children:Object(g.jsx)("img",{id:"consoleimg_g",src:de,alt:""})})]}),Object(g.jsx)("div",{className:"msg_box",id:"msg_box_result",children:Object(g.jsxs)("div",{className:"msg_result",children:[Object(g.jsx)("div",{className:"loader"}),Object(g.jsx)("h3",{children:"Win"})]})}),Object(g.jsxs)("div",{className:"points",children:[Object(g.jsx)("span",{className:"points_icon",children:Object(g.jsx)("img",{src:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKzSURBVHgB7VfPaxNBFH4zrWJNI4uBHvSSXAwFQYtCjybeq8mt4MH2IPWk4E0QSkDw5rniofGg9NZK/4DYoyA0ghACQvbUQ0FZDLFUzYxvdjebnf0xO5ukp/aDhZ3dmfm+eb/2LcBpB0kzmbeMEkzR+8ChhMM8Xob7ygLCm7hdE/rsI5m3PunuqSWAt3IrQPm6S6oDExipkfkf9aSJRE1s5IHSbby9CaMBhbAyWsSMm0DjXvDvxkMk3x+DXEAcYJ+3c5W4CZEWcBbwbZgo2AopWu8gSYBrdnFyAyYLC92xEHRH2AWUNpLIDw6pfXV7qZLIcONJgrSDG+2bcTu82boIG1szoefFQh9uXf8LD5aO4MocAyUYWfVnhyygfbkDilR79OISfPl2DlR4vPwb1paPVFNMUvxZGAw8F9hFRj/PY7GBVnq/e0E1Je9yyQKA0AqkgDD525e/4PXzLizdPZbeCVd1ezR+sY9r2ntIyQ3gHHRxda4Pt1GEQHnxj309e5W1xyI4Dw4JxkacAH7Ho/Uecj5OwbEF+NHuTCtmk3xYgEbez2biLdTuTEnjhGzwuFQyQ8hmhpsOfCzqQePzefiwOyORD9yTBL8AC1JUP0G6UMlFvlvDVEyANbjxu8CEMZFFF4msuBfIihDs3sHB0AIc9rAsaQeiILtW+GebW9yLICziOJvRyCRGvkYIYDuYn09BE+XFY6g96cFIEFwuPBc4bRQ34cTBTX/LJpcrxmtw0ghwSAJQWR0VNuPW+v07m4ERYJ++LnGGpiQ0JCLvB2K0Am6IyIYkuiVrGdgX0E2YKFgVW7Kd4NPIT5ZjJlYFX8EYA+Lkq1HkNpdqpeMO0vB/PNIB44nxqqot1/wxES4h6/pCMJ0x2oMBN7IAn5CS3Uw4vYOomsNfM0HKyZ4oMml+zc7wH3n5+MnL8HcyAAAAAElFTkSuQmCC",alt:""})}),Object(g.jsx)("div",{id:"myPoints",children:"0 Point"})]})]})]})]})};n(39);var F=function(e){var t=Object(r.useContext)(m),n=(t.provider,t.signer),c=t.account,a=(t.setAccount,t.networkId,t.setNetworkId,t.verified),s=t.setVerified,i=function(){var e=Object(u.a)(o.a.mark((function e(){var t,r,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t="".concat(+new Date),e.next=3,n.current.signMessage(t);case 3:r=e.sent,c=l.a.utils.arrayify(l.a.utils.hashMessage(t)),l.a.utils.recoverAddress(c,r),s(!0);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(g.jsx)(g.Fragment,{children:Object(g.jsxs)("p",{align:e.align,children:[c,"\xa0\xa0",Object(g.jsx)(p.a,{id:"signAndVerifyBtn",onClick:i,disabled:a,children:a?"Verified":"Click me to verify"})]})})},Q=n(57),E=n.n(Q),M=[{name:"Address",selector:function(e){return e.Address},width:"400pt"},{name:"Point",selector:function(e){return e.Point},width:"70pt",sortable:!0}],y=function(){var e=Object(u.a)(o.a.mark((function e(){var t,n,r=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.length>0&&void 0!==r[0]?r[0]:"",n=r.length>1&&void 0!==r[1]?r[1]:{},e.abrupt("return",fetch(t,{method:"POST",mode:"cors",cache:"no-cache",headers:{"Content-Type":"application/json"},redirect:"follow",referrer:"no-referrer",body:JSON.stringify(n)}).then((function(e){return e.json()})));case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),U=function(e){var t=Object(r.useState)([]),n=Object(d.a)(t,2),c=n[0],a=n[1];Object(r.useEffect)((function(){s()}),[]);var s=function(){var e=Object(u.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,y(w.boardURL,{startdate:"2020-01-01",enddate:"2030-01-01"});case 3:null!==(t=e.sent)&&a(t),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}();return null!==c&&c.length<=0?Object(g.jsx)("div",{align:"center"}):Object(g.jsx)(g.Fragment,{children:Object(g.jsx)(E.a,{title:"Leader Board",columns:M,data:c,keyField:"Address",defaultSortFieldId:"Point",defaultSortAsc:!1})})},G=n.p+"static/media/title.1df88d2d.png";var L=function(){var e=Object(r.useContext)(m);return e.networkId,e.initialized?Object(g.jsxs)("div",{className:"App wrap",align:"center",children:[Object(g.jsxs)("content",{children:[Object(g.jsx)("header",{children:Object(g.jsx)("img",{src:G,alt:"LOGO",width:"300pt"})}),Object(g.jsx)(F,{align:"center"}),Object(g.jsx)(R,{})]}),Object(g.jsx)(U,{})]}):Object(g.jsx)("div",{children:"loading..."})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(Object(g.jsx)(j,{children:Object(g.jsx)(L,{})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[95,1,2]]]);
//# sourceMappingURL=main.a9c0c101.chunk.js.map