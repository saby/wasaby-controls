import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';

import { isReactView } from './PropsConverter';

import type { IOptions as IGridOptions } from 'Controls/_baseGrid/display/mixins/Grid';
import type { IGridProps as IReactGridProps } from 'Controls/gridReact';
import type { TSupportedLibs } from 'Controls/gridColumnScroll';

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

export function resolveViewControls<TControl>(
    control: unknown,
    options: IGridOptions | IReactGridProps,
    wasabyView: object,
    wasabyViewControl: object,
    reactViewControl?: object
): void {
    const canBeReact = isReactView(options);
    const isReactLoaded = canBeReact && isLoaded('Controls/gridReact');
    const reactLib =
        isReactLoaded && loadSync<typeof import('Controls/gridReact')>('Controls/gridReact');
    const needReactColumnScroll = canBeReact && isReactLoaded && !!options.columnScroll;
    const isReactColumnScrollLoaded =
        needReactColumnScroll && isLoaded('Controls/gridColumnScroll');
    const reactColumnScrollLib =
        isReactColumnScrollLoaded &&
        loadSync<typeof import('Controls/gridColumnScroll')>('Controls/gridColumnScroll');

    if (needReactColumnScroll) {
        if (isReactColumnScrollLoaded) {
            control._viewName = reactColumnScrollLib.GridViewColumnScroll;
            control._viewTemplate = reactColumnScrollLib.resolveColumnScrollControl(
                getLibNameByControlPrototype(reactViewControl || wasabyViewControl)
            );
            control._useReactScrollContexts = true;
            control._isReactView = true;
        } else {
            Logger.error(
                'Ошибка использования Controls/grid:View. ' +
                    'Библиотека Controls/gridColumnScroll не загружена. ' +
                    'Для корректной работы горизонтального скролла в таблице необходимо на прикладном уровне ' +
                    'предзагрузить библиотеку Controls/gridColumnScroll.'
            );
        }
    } else if (canBeReact && isReactLoaded) {
        control._viewName = reactLib.GridView;
        control._viewTemplate = reactViewControl || wasabyViewControl;
        control._isReactView = true;
    } else {
        control._viewName = wasabyView;
        control._viewTemplate = wasabyViewControl;
        control._isReactView = false;
    }
}
