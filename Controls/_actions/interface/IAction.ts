/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IActionProps } from 'Controls/_actions/interface/IActionProps';
import { IMenuControlOptions } from 'Controls/menu';
import { TKey } from 'Controls/interface';
import { Query } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { DataSet } from 'Types/source';
import { Model } from 'Types/entity';

/**
 * Интерфейс класса, реализующего экшен.
 * @interface Controls/_actions/interface/IAction
 * @extends Controls/_actions/interface/IActionProps
 * @public
 */

/**
 * Метод для получения опции меню.
 * @function Controls/_actions/interface/IAction#getMenuOptions
 * @see getChildren
 * @remark Метод будет вызван в случае, когда у экшена есть дочерние элементы
 * @returns {Controls/menu:IMenuControlOptions}
 * @example
 * <pre class="brush: js">
 * getMenuOptions(): Partial<IMenuControlOptions> {
 *    return {
 *        multiSelect: true,
 *        itemTemplate: 'MyModule/actions:EditItemTemplate
 *    }
 * }
 * </pre>
 */

/**
 * Метод для получения дочерних записей.
 * @function Controls/_actions/interface/IAction#getChildren
 * @see getMenuOptions
 * @param {Controls/interface/TKey.typedef} root - Индентификатор узла.
 * @param {Types/source:Query} query - Инстанс запроса.
 * @remark Метод будет вызван в случае, когда экшен является папкой.
 * @remark Если в getMenuOptions вернули source, то метод определять не нужно, записи будут загружены из источника.
 * @returns {Promise<Types/collection:RecordSet|Types/source:DataSet>}
 * @example
 * <pre class="brush: js">
 * import {RecordSet} from 'Types/collection';
 *
 * getChildren(root: TKey): Promise<RecordSet> {
 *   return new RecordSet({
 *       keyProperty: 'id',
 *       rawData: [{
 *           id: 'Moscow',
 *           title: 'Москва'
 *       }]
 *   });
 * }
 * </pre>
 */

/**
 * Метод для получения выбранных ключей.
 * @function Controls/_actions/interface/IAction#getValue
 * @see getMenuOptions
 * @see getChildren
 * @remark Метод будет вызван в случае, когда экшен является папкой.
 * @returns {Controls/interface/TKey.typedef}
 * @example
 * <pre class="brush: js">
 * import {RecordSet} from 'Types/collection';
 *
 * getValue(): Promise<RecordSet> {
 *   return ['Moscow']
 * }
 * </pre>
 */

/**
 * Метод, реализующий логику экшена
 * @function Controls/_actions/interface/IAction#execute
 * @param {TExecuteOptions} options
 * @returns {Promise<any>|void}
 * @example
 * <pre class="brush: js">
 * import {RecordSet} from 'Types/collection;
 *
 * execute(options: IExecuteOptions): Promise<RecordSet> {
 *   const newViewMode = options.toolbarItem.get('id');
 *   if (newViewMode = 'tile') {
 *       this.icon = 'icon-Tile'
 *   }
 *   this._setViewMode(newViewMode);
 * }
 * </pre>
 */

/**
 * Метод, вызываемый при разрушении инстанса класса.
 * @function Controls/_actions/interface/IAction#destroy
 * @param {TExecuteOptions} options
 * @returns {Promise<any>|void}
 * @example
 * <pre class="brush: js">
 * import {RecordSet} from 'Types/collection';
 *
 * destroy(): Promise<RecordSet> {
 *    this._eventBus.unsubscribe('event', this._eventCallback);
 * }
 * </pre>
 */

/**
 * Определяет можно ли выполнять экшен с элементом.
 * @function Controls/_actions/interface/IAction#canExecute
 * @param {Types/entity:Model} item
 * @returns {boolean}
 * @example
 * <pre class="brush: js">
 * import {Model} from 'Types/entity';
 *
 * canExecute(item: Model): boolean {
 *    return !item.get('someProp');
 * }
 * </pre>
 */

export interface IActionState extends IActionProps {
    menuOptions?: Partial<IMenuControlOptions>;
}
export interface IActionExecuteParams extends IActionState {
    toolbarItem: Model;
    toolbarSelectedKeys: TKey[];
    target: HTMLElement;
}

export interface IAction<
    IActionOptions = IActionProps,
    IExecuteParams extends IActionExecuteParams = IActionExecuteParams
> extends IActionProps {
    getMenuOptions(): Partial<IMenuControlOptions>;
    getValue(): TKey[];
    execute(options: IExecuteParams): void | Promise<unknown>;
    getChildren(root: TKey, query: Query): Promise<RecordSet | DataSet>;
    getState(): IActionState;
    canExecute?(item: Model): boolean;
    destroy(): void;
}
