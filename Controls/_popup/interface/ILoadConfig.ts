/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */

export { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для окон, поддерживающих предзагрузку данных.
 * @interface Controls/_popup/interface/ILoadConfigOptions
 * @public
 */

export interface ILoadConfigOptions {
    /**
     * @cfg Конфигурация предзагрузки данных.
     * @remark Результат предзагрузки будет передан в опции шаблона в поле loadResult.
     * @demo Controls-demo/Popup/LoadConfig/Index
     */
    loadConfig?: IDataConfig;
    /**
     * @cfg Коллбек, который должен вернуть конфигурацию предзагрузки данных.
     * @remark Результат предзагрузки будет передан в опции шаблона в поле loadResult.
     * @demo Controls-demo/Popup/LoadConfig/Index
     */
    loadConfigGetter?: (config: IBasePopupOptions) => Promise<IDataConfig>;
}
