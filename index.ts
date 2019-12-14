// ##############
/* Welcome to ... the game server ..., dun dun dun */
// ##############

import {config} from 'dotenv';
config();

import path from 'path';

import AdminAPI from './src/games/Admin'
import Layout from './src/lights/Layout'
import GameServer from './src/GameServer'
import GameManager from './src/games/GameManager'
import PlayerManager from './src/PlayerManager'
import LightManager from './src/LightManager'

// Games
import Wand from './src/games/catalog/Wand'
import Pong from './src/games/catalog/Pong'
import Tetris from './src/games/catalog/Tetris'
import Manual from './src/games/catalog/Manual'

/** CREATE SERVER */
const server = new GameServer();

/** CREATE LAYOUT */
const layout = new Layout(path.join(process.env.LAYOUTS, "lightshow2019"));

/** CREATE MANAGERS */
const lightManager = new LightManager(layout, server);
const playerManager = new PlayerManager(server);
const gameManager = new GameManager(playerManager);

/** REGISTER GAMES */
GameManager.registerGame(new Wand(lightManager));
GameManager.registerGame(new Pong(lightManager));
GameManager.registerGame(new Tetris(lightManager));
GameManager.registerGame(new Manual(lightManager));

/** SERVE ADMIN API */
server.use('/games', new AdminAPI(gameManager).getRouter());
server.use('/layout', layout.getRouter());
server.useAdmin(path.join(process.env.ADMIN, 'build'));

/** START SERVE */
server.start(process.env.PORT);
