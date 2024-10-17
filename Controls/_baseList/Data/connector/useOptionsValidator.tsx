/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IConnectorProps } from './interface/IConectorProps';
import { Logger } from 'UI/Utils';
import VIEW_PROPS from './contstants/ViewProps';

export function useOptionsValidator(options: IConnectorProps): void {
    VIEW_PROPS.forEach((optionName) => {
        // @ts-ignore
        if (options[optionName] !== undefined) {
            Logger.error(`Передаётся опция ${optionName} для списка со storeId: ${options.storeId}.
                          Опцию ${optionName} необходимо задавать в параметрах списочной фабрики.
                          Подробнее можно прочитать тут: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/`);
        }
    });

    // @ts-ignore
    if (options.dataLoadCallback) {
        /*
         * warning пока подгрузка по скроллу не триггерит _dataLoaded в слайсе, надо добить реквест
         * https://online.sbis.ru/opendoc.html?guid=8d53f3b1-1acb-4b48-be8e-8ab773604670&client=3
         */
        Logger.warn(`Передаётся опция dataLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _dataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_dataLoaded/`);
    }

    // @ts-ignore
    if (options.nodeLoadCallback) {
        Logger.error(`Передаётся опция nodeLoadCallback для списка со storeId: ${options.storeId}.
                           Опция не поддерживается, надо определить метод _nodeDataLoaded на слайсе,
                           подробнее тут: https://wi.sbis.ru/docs/js/Controls/dataFactory/ListSlice/methods/_nodeDataLoaded/`);
    }
}
