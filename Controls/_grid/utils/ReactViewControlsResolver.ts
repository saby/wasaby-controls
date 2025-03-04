/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*
 * Содержит приватную утилиту resolveViewControls в зависимости от опции columnScroll: Boolean
 * устанавливает рендер таблицы со скроллом колонок или без него.
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';
import 'Controls/gridColumnScroll';
import type { TSupportedLibs } from 'Controls/gridColumnScroll';
import type { IGridProps as IReactGridProps } from 'Controls/gridRender';

const getLibNameByControlPrototype = (prototype: object): TSupportedLibs => {
    if (prototype['[Controls/searchBreadcrumbsGrid:SearchGridControl]']) {
        return 'Controls/searchBreadcrumbsGrid';
    }
    if (prototype['[Controls/treeGrid:TreeGridControl]']) {
        return 'Controls/treeGrid';
    }
    if (prototype['[Controls/grid:GridControl]']) {
        return 'Controls/grid';
    }
};

export function resolveViewControls(
    control: unknown,
    options: IReactGridProps,
    viewControl: object,
    viewController: object
): void {
    const needReactColumnScroll = !!options.columnScroll;
    const reactColumnScrollLib = loadSync<typeof import('Controls/gridColumnScroll')>(
        'Controls/gridColumnScroll'
    );

    if (needReactColumnScroll) {
        control._viewName = reactColumnScrollLib.GridViewColumnScroll;
        control._viewTemplate = reactColumnScrollLib.resolveColumnScrollControl(
            getLibNameByControlPrototype(viewController)
        );
        control._useReactScrollContexts = true;
        control._isReactView = true;
    } else {
        control._viewName = viewControl;
        control._viewTemplate = viewController;
        control._isReactView = true;
    }
}
