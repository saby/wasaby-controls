/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Модуль возвращает метод, с помощью которого можно запросить данные с учетом фильтрации и сортировки.
 * @remark
 * <h2>Аргументы функции</h2>
 *
 * Функция на вход приниает объект с полями:
 *
 * * source: SbisService - источник данных;
 * * filterButtonSource: Array - элементы {@link Controls/filter:Controller#filterButtonSource FilterButton};
 * * fastFilterSource: Array - элементы {@link Controls/filter:Controller#fastFilterSource FastFilter};
 * * navigation: object - навигация для получения данных;
 * * historyId: string - идентификатор для получения истории фильтрации;
 * * groupHistoryId: string - идентификатор для получения состояния группировки;
 * * filter: FilterObject - фильтр для получения данных;
 * * sorting: SortingObject - сортировка для получения данных;
 * * propStorageId: string - идентификатор стора, в котором хранится сохраненная пользовательская сортировка;
 *
 * @class Controls/_dataSource/requestDataUtil
 * @public
 */
import { ILoadDataConfig, ILoadDataResult } from 'Controls/dataSourceOld';

export default function requestDataUtil(cfg: ILoadDataConfig): Promise<ILoadDataResult> {
    return import('Controls/dataSourceOld')
        .then(({ DataLoader }) => new DataLoader().load([cfg]))
        .then((loadResult) => {
            return loadResult[0] as ILoadDataResult;
        });
}
