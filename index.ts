// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############
import LightShow from './src/scene/LightShow';
import GameServer from './src/GameServer'; 
import GameManager from './src/GameManager';
import UserManager from './src/UserManager';

// Register Games
import Wand from './src/games/Wand';

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
