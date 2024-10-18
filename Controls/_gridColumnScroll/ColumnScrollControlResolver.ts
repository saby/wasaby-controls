/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { TBaseControl, getClass } from './ColumnScrollControl';

export type TSupportedLibs =
    | 'Controls/grid'
    | 'Controls/treeGrid'
    | 'Controls/searchBreadcrumbsGrid';

const LIB_CONTROLLERS: Record<TSupportedLibs, string> = {
    'Controls/grid': 'GridControl',
    'Controls/treeGrid': 'TreeGridControl',
    'Controls/searchBreadcrumbsGrid': 'SearchGridControl',
};

export function resolveColumnScrollControl(libName: TSupportedLibs): ReturnType<typeof getClass> {
    const isLibLoaded = isLoaded(libName);
    if (!isLibLoaded) {
        Logger.error(
            'Ошибка использования функционала Controls/gridColumnScroll. ' +
                'Библиотека таблиц не загружена! ' +
                'Попытка создания табличного контроллера с аспектом скроллирования, хотя библиотека табличного представления не загружена. ' +
                `В данном случае - библиотека ${libName}. ` +
                'Библиотека Controls/gridColumnScroll - вспомогательная библиотека для горизонтального скроллирования колонок таблиц.'
        );
    }
    const BaseControl = (
        isLibLoaded ? loadSync(libName)[LIB_CONTROLLERS[libName]] : class {}
    ) as TBaseControl;

    return getClass(BaseControl);
}
