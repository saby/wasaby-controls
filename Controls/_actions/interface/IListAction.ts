/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IAction } from 'Controls/_actions/interface/IAction';
import { IActionOptions } from 'Controls/_actions/interface/IActionOptions';
import { ControllerClass as FilterController } from 'Controls/filter';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { ISelectionObject, TFilter } from 'Controls/interface';
import { RecordSet } from 'Types/collection';

/**
 * Интерфейс класса, реализующего экшен для взаимодействия со списком.
 * @interface Controls/_actions/interface/IListAction
 * @implements Controls/_actions/interface/IAction
 * @public
 */

/**
 * Метод, который вызовется при изменении фильтра, записей или выделения в списке.
 * @function Controls/_actions/interface/IAction#listChanged
 * @param {ISelectionObject} selection - текущее выделение в списке.
 * @param {RecordSet} items - текущие записи списка.
 * @param {TFilter} filter - текущий фильтр в списке.
 * @returns {void}
 * @example
 * <pre class="brush: js">
 * import {RecordSet} from 'Types/collection;
 * import {ISelectionObject} from 'Controls/interface;
 * import {TFilter} from 'Controls/filter'
 *
 * listChanged(selection: ISelectionObject, items: RecordSet, filter: TFilter): void {
 *   if (items.getCount() === 0) {
 *       this.visible = false;
 *   }
 * }
 * </pre>
 */

export interface IListActionOptions extends IActionOptions {
    filterController: FilterController;
    operationsController: OperationsController;
    sourceController: SourceController;
}

export interface IListAction<T extends IListActionOptions = IListActionOptions> extends IAction<T> {
    listChanged(selection: ISelectionObject, items: RecordSet, filter: TFilter): void;
    update(context: Record<string, unknown>): void;
}
