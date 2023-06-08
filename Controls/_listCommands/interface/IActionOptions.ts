/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import type {
    ICrudPlus,
    SbisService,
    CrudEntityKey,
    QueryOrderSelector,
} from 'Types/source';
import { Model } from 'Types/entity';
import { ISelectionObject, INavigationOptionValue } from 'Controls/interface';
import { IColumn } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

/**
 * Интерфейс стандартного набора опций для действия над записью
 * @interface Controls/_listCommands/interface/IActionOptions
 * @public
 */
export default interface IActionOptions {
    /**
     * @name Controls/_listCommands/interface/IActionOptions#source
     * @cfg {ICrudPlus|SbisService} источник данных для выполнения команды на БЛ
     */
    source: ICrudPlus | SbisService;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#filter
     * @cfg {Object} Фильтр, применяемый к данным
     */
    filter?: object;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#navigation
     * @cfg {Controls/interface:INavigationOptionValue} Навигация для источника данных
     */
    navigation?: INavigationOptionValue<unknown>;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#sorting
     * @cfg {object} Сортировка для источника данных
     */
    sorting?: QueryOrderSelector;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#parentProperty
     * @cfg {Object} Поле записи, содержщее информацию о родителе в иерархических данных
     */
    parentProperty?: string;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#columns
     * @cfg {Array<Controls/grid:IColumn>} Конфигурация колонок
     */
    columns?: IColumn[];
    /**
     * @name Controls/_listCommands/interface/IActionOptions#selection
     * @cfg {Controls/interface:ISelectionObject} Объект, содержащий информацию о выбранных записях
     */
    selection?: ISelectionObject;
    /**
     * @name Controls/_listCommands/interface/IActionOptions#items
     * @cfg {Types/collection:RecordSet} Коллекция отображаемых записей
     */
    items?: RecordSet;
    target?: Model | CrudEntityKey | HTMLElement;
}
