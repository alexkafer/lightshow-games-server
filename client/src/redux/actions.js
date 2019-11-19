import { DEVICE_MOTION, DEVICE_ORIENTATION, DEVICE_MOTION_PERMISSION } from './actionTypes'

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

export const askedForMotion = () => ({
    type: DEVICE_MOTION_PERMISSION,
    payload: {
        motion: true
    }
})