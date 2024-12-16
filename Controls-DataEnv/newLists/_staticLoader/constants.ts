import type { TUI_Dependencies } from './types';

export enum LibPaths {
    TreeTile = 'Controls/treeTile',
    NewTreeTile = 'Controls-Lists/treeTile',
    NewTreeGrid = 'Controls-Lists/treeGrid',
}

export const UI_DEPENDENCIES: TUI_Dependencies = {
    [LibPaths.TreeTile]: [
        {
            prop: 'viewMode',
            value: ['tile'],
        },
    ],
    [LibPaths.NewTreeTile]: [
        {
            prop: 'viewMode',
            value: ['tile'],
        },
    ],
    [LibPaths.NewTreeGrid]: [
        {
            prop: 'viewMode',
            value: (state) => state.isLatestInteractorVersion && state.viewMode === 'table',
        },
    ],
};
