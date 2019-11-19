import { DEVICE_MOTION_PERMISSION } from "../actionTypes";

const initialState = {
    motion: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case DEVICE_MOTION_PERMISSION: {
            const asked = action.payload;
            return {
                ...state,
                motion: asked
            }
        }
        default:
            return state;
    }
}

