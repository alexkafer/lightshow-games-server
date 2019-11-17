// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############

import GameServer from './server/GameServer'
import GameManager from './server/GameManager'
import UserManager from './server/UserManager';
import LightShow from './server/LightShow';

// Register Games
import Wand from './server/games/Wand'
import Pong from './server/games/Pong';

import AdminPortal from './server/admin/Admin';

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
