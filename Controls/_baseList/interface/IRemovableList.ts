/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { ISelectionObject } from 'Controls/interface';
import { IListActionAdditionalConfig } from './IMovableList';

/**
 * Интерфейс контрола для удаления записей
 * @interface Controls/_list/interface/IRemovableList
 * @public
 */

export interface IRemovableList {
    /**
     * Удаляет элементы по ключам.
     * @function Controls/_list/interface/IRemovableList#removeItems
     * @param {Controls/interface:ISelectionObject} selection Объект, содержащий список ключей записей для удаления и список ключей записей, которые необходимо исключить при удалении.
     * @param {String} viewCommandName Название команды для выполнения действия с RecordSet. По умолчанию Controls/viewCommands:AtomicRemove
     * @remark Если удаление состоялось, возвращаемый Promise содержит строку 'fullReload'
     * @returns {Promise<String | void>}
     */

    /*
     * Removes items from the data source by identifiers of the items in the collection.
     * @function Controls/_list/interface/IRemovableList#removeItems
     * @param {Controls/interface:ISelectionObject} selection Object containing a list of selected records for remove and a list of records, which must be excluded from removal.
     * @remark if one or more records were removed promise contains string result with 'fullReload' value
     * @returns {Promise<String | void>}
     */
    removeItems(selection: ISelectionObject, viewCommandName?: string): Promise<void | string>;

    /**
     * Удаляет элементы по ключам с подтверждением.
     * @function Controls/_list/interface/IRemovableList#removeItemsWithConfirmation
     * @param {Controls/interface:ISelectionObject} selection Объект, содержащий список ключей записей для удаления и список ключей записей, которые необходимо исключить при удалении.
     * @param {IListActionAdditionalConfig} config Конфигурация, необходимая для открытия диалогового окна.  В качестве команды для выполнения действия с RecordSet по умолчанию используется Controls/viewCommands:AtomicRemove
     * @remark Если удаление состоялось, возвращаемый Promise содержит строку 'fullReload'
     * @returns {Promise<String | void>}
     */

    /*
     * Removes items with confirmation from the data source by identifiers of the items in the collection.
     * @function Controls/_list/interface/IRemovableList#removeItemsWithConfirmation
     * @param {Controls/interface:ISelectionObject} selection Object containing a list of selected records for remove and a list of records, which must be excluded from removal.
     * @remark if one or more records were removed promise contains string result with 'fullReload' value
     * @returns {Promise<String | void>}
     */
    removeItemsWithConfirmation(
        selection: ISelectionObject,
        config?: IListActionAdditionalConfig
    ): Promise<void | string>;
}
