import { ISelectorTabConfig } from 'Controls/_selector/interfaces/ISelector';
import { IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

/**
 * Интерфейс аргументов фабрики окна выбора
 * @public
 */
export default interface ISelectFactoryArguments extends IBaseDataFactoryArguments {
    /**
     * Ключ активной вкладки на окне выбора
     */
    initialKey?: string;
    /**
     * Конфигурация каждой вкладки на окне выбора
     */
    configs: Record<string, ISelectorTabConfig>;
}
