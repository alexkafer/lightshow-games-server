import { DEVICE_MOTION, DEVICE_ORIENTATION, START_GAME, END_GAME, LOAD_GAME, QUEUE_UPDATE } from './actionTypes'

export const logDeviceMotion = content => ({
    type: DEVICE_MOTION,
    payload: {
        x: content.x,
        y: content.y,
        z: content.z,
    }
})

export const logDeviceOrientation = content => ({
    type: DEVICE_ORIENTATION,
    payload: {
        alpha: content.alpha | NaN,
        beta: content.beta | NaN,
        gamma: content.gamma | NaN,
        compass: content.compass | NaN,
        compass_accuracy: content.compass_accuracy | NaN,
    }
})

export const startGame = () => ({
    type: START_GAME
})

export const endGame = () => ({
    type: END_GAME
})

export const loadGame = newGame => ({
    type: LOAD_GAME,
    payload: {
        game: newGame | null
    }
})

export const updateQueue = newPlace => ({
    type: QUEUE_UPDATE,
    payload: {
        placeInLine: newPlace | -1
    }
})