import { combineReducers } from "redux";
import gyro from "./gyro";
import permissions from "./permissions";

export default combineReducers({gyro, permissions});