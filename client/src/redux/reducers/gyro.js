import { DEVICE_MOTION, DEVICE_ORIENTATION } from "../actionTypes";

const initialState = {
    alpha: NaN,
    beta: NaN,
    gamma: NaN,
    compass: NaN,
    compass_accuracy: NaN,
    x: NaN,
    y: NaN,
    z: NaN
}

export default function(state = initialState, action) {
    switch (action.type) {
        case DEVICE_MOTION: {
            const { x, y, z} = action.payload;
            return {
                ...state,
                x: x,
                y: y,
                z: z
            }
        }
        case DEVICE_ORIENTATION: {
            const { alpha, beta, gamma, compass, compass_accuracy} = action.payload;
            return {
                ...state,
                alpha: alpha,
                beta: beta,
                gamma: gamma,
                compass: compass,
                compass_accuracy: compass_accuracy
            }
        }
        default:
            return state;
    }
}

