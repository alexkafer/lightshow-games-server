import { combineReducers } from "redux";
import gyro from "./gyro";
import game from "./game";

export default combineReducers({gyro, game});