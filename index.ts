// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############

import logger from './src/utils/Logger'

import GameServer from './src/GameServer'
import GameManager from './src/GameManager'
import UserManager from './src/UserManager'
import LightShow from './src/LightShow'

// Register Games
import Wand from './src/games/Wand'
import Pong from './src/games/Pong'
import Manual from './src/games/manual'

// Interaction Interface
import AdminPortal from './src/admin/Admin'
import Layout from './src/utils/Layout'

const server = new GameServer();
const lightShow = new LightShow(server);

/** REGISTER GAMES */
const WAND: string = 'WAND';
GameManager.registerGame(new Wand(lightShow), WAND);

const PONG: string = 'PONG';
GameManager.registerGame(new Pong(lightShow), PONG);

const MANUAL: string = 'MANUAL';
GameManager.registerGame(new Manual(lightShow), MANUAL);

const userManager = new UserManager(server);
const gameManager = new GameManager(userManager);

/** LOAD LAYOUT */
const layout = new Layout('exceed', "./server/layouts/exceed/map.svg");

const adminPortal = new AdminPortal(gameManager, layout);
adminPortal.initRoutes(server.getExpressApp());

gameManager.startGame(MANUAL);

server.serveClient();

// start the server
const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
server.start(port);
