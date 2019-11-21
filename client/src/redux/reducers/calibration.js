import { DEVICE_MOTION, DEVICE_ORIENTATION } from "../actionTypes";

const initialState = {
    offset_alpha: NaN,
    offset_beta: NaN,
    offset_gamma: NaN,
    offset_compass: NaN,
    offset_compass_accuracy: NaN,
    offset_x: NaN,
    offset_y: NaN,
    offset_z: NaN
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

