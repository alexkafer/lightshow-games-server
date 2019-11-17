// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############
import LightShow from './scene/LightShow';
import GameServer from './GameServer'; 
import GameManager from './GameManager';
import UserManager from './UserManager';

// Register Games
import Wand from './games/Wand';

// Setup server
const scene = new LightShow();
const gameManager = new GameManager(scene);
const userManager = new UserManager(gameManager);
const server = new GameServer(userManager, scene);

// Register games
gameManager.registerGame(new Wand(), 'Wand');

gameManager.startGame('Wand');

// start the server
const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
server.start(port);
