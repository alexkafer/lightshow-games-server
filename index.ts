// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############

import {logger} from './server/utils/Logger'

import GameServer from './server/GameServer'
import GameManager from './server/GameManager'
import UserManager from './server/UserManager';
import LightShow from './server/LightShow';

// Register Games
import Wand from './server/games/Wand'
import Pong from './server/games/Pong';
import Manual from './server/games/manual';

// Interaction Interface
import AdminPortal from './server/admin/Admin';
import Layout from './server/utils/Layout';

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
