/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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

export const passedStateUpdated = (mode: TDebugMode): boolean => {
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
