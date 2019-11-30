// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############
import path from 'path';

import GameServer from './src/GameServer'
import GameManager from './src/GameManager'
import UserManager from './src/UserManager'
import LightShow from './src/LightShow'

// Games
import Wand from './src/games/Wand'
import Pong from './src/games/Pong'
import Manual from './src/games/Manual'

/** Interaction Interface */
import AdminAPI from './src/api/Admin'
import Layout from './src/utils/Layout'

/** CREATE SERVER */
const server = new GameServer();

/** CREATE LAYOUT */
const lightshow2019 = path.join(__dirname, "..", "/src/layouts/lightshow2019");
const layout = new Layout("lightshow2019", lightshow2019);
const lightShow = new LightShow(layout, server);

/** REGISTER GAMES */
const WAND: string = 'WAND';
GameManager.registerGame(new Wand(lightShow), WAND);

const PONG: string = 'PONG';
GameManager.registerGame(new Pong(lightShow), PONG);

const MANUAL: string = 'MANUAL';
GameManager.registerGame(new Manual(lightShow), MANUAL);

/** CREATE MANAGERS */
const userManager = new UserManager(server);
const gameManager = new GameManager(userManager);

/** SERVE ADMIN API */
server.use('/games', new AdminAPI(gameManager).getRouter());
server.use('/layout', layout.getRouter());
server.useAdmin(path.join(__dirname,  "..", 'admin', 'build'));

/** START DEFAULT GAME */
gameManager.startGame(WAND);

/** START SERVE */
server.start(process.env.PORT || 2567);
