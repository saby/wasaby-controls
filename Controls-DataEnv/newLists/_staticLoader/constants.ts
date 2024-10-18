import type { TUI_Dependencies } from './types';

export enum LibPaths {
    Tile = 'Controls/tile',
    TreeGrid = 'Controls-Lists/treeGrid',
}

export const UI_DEPENDENCIES: TUI_Dependencies = {
    [LibPaths.Tile]: [
        {
            prop: 'viewMode',
            value: ['tile'],
        },
    ],
    // Только для новейшего списка
    // [LibPaths.TreeGrid]: [
    //     {
    //         prop: 'viewMode',
    //         value: ['table'],
    //     },
    // ],
};
