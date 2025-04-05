import { ISelectorTabConfig } from 'Controls/_selector/interfaces/ISelector';
import { IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { RecordSet, List } from 'Types/collection';
import { Model } from 'Types/entity';

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
    /**
     * Единичный/множественный выбор
     */
    multiSelect?: boolean;
    /**
     * Коллекция выбранных записей
     */
    selectedItems?: RecordSet<Model> | List<Model>;
}
