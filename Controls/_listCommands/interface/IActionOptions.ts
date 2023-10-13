/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import type { ICrudPlus, SbisService, CrudEntityKey, QueryOrderSelector } from 'Types/source';
import { Model } from 'Types/entity';
import { ISelectionObject, INavigationOptionValue } from 'Controls/interface';
import { IColumn } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

/**
 * Интерфейс стандартного набора опций для действия над записью
 * @public
 */
export default interface IActionOptions {
    /**
     * @cfg {ICrudPlus|SbisService} источник данных для выполнения команды на БЛ
     */
    source: ICrudPlus | SbisService;
    /**
     * @cfg {Object} Фильтр, применяемый к данным
     */
    filter?: object;
    /**
     * @cfg {Controls/interface:INavigationOptionValue} Навигация для источника данных
     */
    navigation?: INavigationOptionValue<unknown>;
    /**
     * @cfg {object} Сортировка для источника данных
     */
    sorting?: QueryOrderSelector;
    /**
     * @cfg {Object} Поле записи, содержщее информацию о родителе в иерархических данных
     */
    parentProperty?: string;
    /**
     * @cfg {Array<Controls/grid:IColumn>} Конфигурация колонок
     */
    columns?: IColumn[];
    /**
     * @cfg {Controls/interface:ISelectionObject} Объект, содержащий информацию о выбранных записях
     */
    selection?: ISelectionObject;
    /**
     * @cfg {Types/collection:RecordSet} Коллекция отображаемых записей
     */
    items?: RecordSet;
    target?: Model | CrudEntityKey | HTMLElement;

    rootHistoryId?: string;
}
