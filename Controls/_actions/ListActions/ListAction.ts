/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import BaseAction from '../BaseAction';
import { ISelectionObject, TFilter } from 'Controls/interface';
import { IListActionOptions, IListAction } from 'Controls/_actions/interface/IListAction';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';
import { RecordSet } from 'Types/collection';

/**
 * Класс базового экшена для списка.
 * @class Controls/_actions/ListActions/ListAction
 * @implements Controls/_actions/interface/IListAction
 * @public
 */

export default class ListAction<
        T extends IListActionOptions = IListActionOptions,
        V extends IActionExecuteParams = IActionExecuteParams
    >
    extends BaseAction<T, V>
    implements IListAction<T>
{
    protected onSelectionChanged(items: RecordSet, selection: ISelectionObject): void {
        /* for override */
    }
    protected onCollectionChanged(items: RecordSet): void {
        /* for override */
    }
    listChanged(selection: ISelectionObject, items: RecordSet, filter: TFilter): void {
        /* for override */
    }
    update(context: Record<string, unknown>): void {
        /* for override */
    }
}
