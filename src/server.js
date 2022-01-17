// gameserver network
var appPropLocal = {
    gameServerURL: "ws://localhost:12321/rps",
    boardURL: "http://localhost:12321/board",
    useTLS: false,
    skipInsecureTLS: true,
}

var appSSDNODES4 = {
    gameServerURL: "ws://63.250.52.190:12321/rps",
    boardURL: "http://63.250.52.190:12321/board",
    useTLS: false,
    skipInsecureTLS: true,
}

var appSSDNODES38 = {
    gameServerURL: "ws://209.182.235.114:12321/rps",
    boardURL: "http://209.182.235.114:12321/board",
    useTLS: false,
    skipInsecureTLS: true,
}



const appProp = appSSDNODES38

export default appProp;
