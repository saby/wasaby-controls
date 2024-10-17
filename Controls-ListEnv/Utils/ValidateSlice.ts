import { Logger } from 'UI/Utils';
import { ListSlice } from 'Controls/dataFactory';

export default function (slice: ListSlice, controlName: string): boolean {
    let result = true;
    if (slice['[ICompatibleSlice]']) {
        Logger.warn(`${controlName}::Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
            " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/`);
        result = false;
    }
    if (!slice['[IListSlice]']) {
        Logger.warn(`${controlName}::В контрол передан слайс не списочного типа`);
        result = false;
    }
    return result;
}
