// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############

import GameServer from './src/GameServer'
import GameManager from './src/GameManager'
import UserManager from './src/UserManager';
import LightShow from './src/LightShow';

// Register Games
import Wand from './src/games/Wand'
import Pong from './src/games/Pong';

import AdminPortal from './src/admin/Admin';

const WAND: string = 'WAND';
GameManager.registerGame(new Wand(), WAND);

const PONG: string = 'PONG';
GameManager.registerGame(new Pong(), PONG);

const server = new GameServer();
const lightShow = new LightShow(server);
const userManager = new UserManager(server);
const gameManager = new GameManager(userManager, lightShow);

const adminPortal = new AdminPortal(gameManager);
adminPortal.initRoutes(server.getExpressApp());

gameManager.startGame(WAND);

// start the server
const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
server.start(port);
