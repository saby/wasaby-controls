import type { IConnectableToSlice } from './IConnectableToSlice';

/**
 * Параметры хука, получающего View-команды.
 */
export type TUseInteractorCommandsHookProps = IConnectableToSlice & {
    changeRootByItemClick?: boolean;
    expandByItemClick?: boolean;
};
