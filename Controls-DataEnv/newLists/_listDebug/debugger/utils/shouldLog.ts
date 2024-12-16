import { TDebugMode } from '../types/TDebugMode';

const isAnyDev = (mode: TDebugMode) => mode === 'Dev' || mode === 'DevMin' || mode === 'DevMax';

export const time = (_mode: TDebugMode): boolean => {
    return true;
};

export const trace = (mode: TDebugMode): boolean => {
    return mode !== 'Time';
};

export const sliceChanged = (mode: TDebugMode): boolean => {
    return mode !== 'Time';
};

export const action = (mode: TDebugMode): boolean => {
    return isAnyDev(mode);
};

export const actionTime = (mode: TDebugMode): boolean => {
    return mode === 'DevMax';
};

export const userUpdateStateUpdated = (mode: TDebugMode): boolean => {
    return mode !== 'Time';
};

export const immediateStateUpdated = (mode: TDebugMode): boolean => {
    return isAnyDev(mode) || mode === 'State';
};

export const innerStateUpdated = (mode: TDebugMode): boolean => {
    return isAnyDev(mode) || mode === 'State';
};

export const outerStateUpdated = (mode: TDebugMode): boolean => {
    return mode !== 'Time';
};

export const uselessUpdateInitiator = (mode: TDebugMode): boolean => {
    return mode === 'State';
};
