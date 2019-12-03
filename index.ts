// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############
import path from 'path';

import {config} from 'dotenv';
config();

import GameServer from './src/GameServer'
import GameManager from './src/games/GameManager'
import PlayerManager from './src/PlayerManager'
import LightShow from './src/LightShow'

// Games
import Wand from './src/games/catalog/Wand'
import Pong from './src/games/catalog/Pong'
import Manual from './src/games/catalog/Manual'

/** Interaction Interface */
import AdminAPI from './src/games/Admin'
import Layout from './src/utils/Layout'

/** CREATE SERVER */
const server = new GameServer();

/** CREATE LAYOUT */
const lightshow2019 = path.join(__dirname, "..", "static", "layouts", "lightshow2019");
const layout = new Layout(lightshow2019);
const lightShow = new LightShow(layout, server);

/** REGISTER GAMES */
const WAND: string = 'WAND';
GameManager.registerGame(new Wand(lightShow), WAND);

const PONG: string = 'PONG';
GameManager.registerGame(new Pong(lightShow), PONG);

const MANUAL: string = 'MANUAL';
GameManager.registerGame(new Manual(lightShow), MANUAL);

/** CREATE MANAGERS */
const playerManager = new PlayerManager(server);
const gameManager = new GameManager(playerManager);

/** SERVE ADMIN API */
server.use('/games', new AdminAPI(gameManager).getRouter());
server.use('/layout', layout.getRouter());
server.useAdmin(path.join(__dirname,  "..", 'admin', 'build'));

/** START DEFAULT GAME */
gameManager.startGame(WAND);

/** START SERVE */
server.start(process.env.PORT);
