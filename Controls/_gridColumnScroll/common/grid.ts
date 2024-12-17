import { Logger } from 'UI/Utils';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { IGridViewProps } from 'Controls/grid';
import type { GridView } from 'Controls/grid';

export function getGrid() {
    if (!isLoaded('Controls/grid')) {
        Logger.error('Библиотека Controls/grid должна быть загружена!');
    }
    return loadSync<typeof import('Controls/grid')>('Controls/grid');
}

export function gridViewPropsAreEqual(
    prevProps: IGridViewProps,
    nextProps: IGridViewProps
): boolean {
    const grid = getGrid();
    return grid.gridViewPropsAreEqual(prevProps, nextProps);
}

export function getBaseView(): typeof GridView {
    return getGrid().GridView;
}
