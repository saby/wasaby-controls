import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Logger } from 'UI/Utils';
import { TBaseControl, getClass } from './ColumnScrollControl';

export function resolveColumnScrollControl(
    libName: 'Controls/grid' | 'Controls/treeGrid'
): ReturnType<typeof getClass> {
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
    const BaseControlName =
        libName === 'Controls/grid' ? 'GridControl' : 'TreeGridControl';
    const BaseControl = (
        isLibLoaded ? loadSync(libName)[BaseControlName] : class {}
    ) as TBaseControl;

    return getClass(BaseControl);
}
