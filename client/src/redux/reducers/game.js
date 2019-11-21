import { START_GAME, END_GAME, LOAD_GAME, QUEUE_UPDATE } from "../actionTypes";

const initialState = {
    inGame: false,
    currentGame: null,
    line: -1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case START_GAME: {
            return {
                ...state,
                inGame: true
            }
        }
        case END_GAME: {
            return {
                ...state,
                inGame: false
            }
        }
        case LOAD_GAME: {
            return {
                ...state,
                currentGame: action.payload.game,
            }
        }
        case QUEUE_UPDATE: {
            return {
                ...state,
                placeInLine: action.payload.place
            }
        }
        default:
            return state;
    }
}

