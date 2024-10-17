import type { TUI_Dependencies } from './types';

export enum LibPaths {
    Tile = 'Controls/tile',
}

export const UI_DEPENDENCIES: TUI_Dependencies = {
    [LibPaths.Tile]: [
        {
            prop: 'viewMode',
            value: ['tile'],
        },
    ],
};
