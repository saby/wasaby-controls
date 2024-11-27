import { CrudEntityKey } from 'Types/source';
import type { TVisibility } from './common/types';

export const MoveMarkerChangeName = 'MOVE_MARKER';
export const ChangeMarkerVisibilityChangeName = 'CHANGE_MARKER_VISIBILITY';
export type TMoveMarkerChangeName = typeof MoveMarkerChangeName;
export type TChangeMarkerVisibilityChangeName = typeof ChangeMarkerVisibilityChangeName;

/* Переместить маркер */
export interface IMoveMarkerChange {
    name: TMoveMarkerChangeName;
    args: {
        from?: CrudEntityKey;
        to?: CrudEntityKey;
    };
}

/* Изменить видимость маркера */
export interface IChangeMarkerVisibilityChange {
    name: TChangeMarkerVisibilityChangeName;
    args: {
        visibility: TVisibility;
    };
}

export type TMarkerChanges = IMoveMarkerChange | IChangeMarkerVisibilityChange;
