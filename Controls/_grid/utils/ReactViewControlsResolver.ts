import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';

import { isReactView } from './PropsConverter';

import type { IOptions as IGridOptions } from '../display/mixins/Grid';
import type { IGridProps as IReactGridProps } from 'Controls/gridReact';

export function resolveViewControls<TControl>(
    control: unknown,
    options: IGridOptions | IReactGridProps,
    baseView: unknown,
    baseControl: unknown
): void {
    const canBeReact = isReactView(options);
    const isReactLoaded = canBeReact && isLoaded('Controls/gridReact');
    const reactLib =
        isReactLoaded &&
        loadSync<typeof import('Controls/gridReact')>('Controls/gridReact');
    const needReactColumnScroll =
        canBeReact && isReactLoaded && !!options.columnScroll;
    const isReactColumnScrollLoaded =
        needReactColumnScroll && isLoaded('Controls/gridColumnScroll');
    const reactColumnScrollLib =
        isReactColumnScrollLoaded &&
        loadSync<typeof import('Controls/gridColumnScroll')>(
            'Controls/gridColumnScroll'
        );

    if (needReactColumnScroll) {
        if (isReactColumnScrollLoaded) {
            control._viewName = reactColumnScrollLib.GridViewColumnScroll;
            control._viewTemplate =
                reactColumnScrollLib.resolveColumnScrollControl(
                    baseControl['[Controls/treeGrid:TreeGridControl]']
                        ? 'Controls/treeGrid'
                        : 'Controls/grid'
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
        control._viewTemplate = baseControl;
        control._isReactView = true;
    } else {
        control._viewName = baseView;
        control._viewTemplate = baseControl;
        control._isReactView = false;
    }
}
