/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { IItemEditOptions, IItemAddOptions } from 'Controls/list';
import type { TAsyncOperationResult } from 'Controls/editInPlace';

/**
 * Интерфейс для {@link /doc/platform/developmentapl/interface-development/controls/property-grid/ редактора свойств} с возможностью редактирования по месту.
 * @public
 */
export interface IEditingPropertyGrid {
    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ редактирование по месту}.
     * Использование метода в редакторе свойств с режимом "только чтение" невозможно.
     * @param {Controls/list:IItemEditOptions} options Параметры редактирования.
     * @returns {Controls/editInPlace/TAsyncOperationResult.typedef}
     * Promise разрешается после монтирования контрола в DOM.
     */
    beginEdit(options?: IItemEditOptions): TAsyncOperationResult;

    /**
     * Запускает {@link /doc/platform/developmentapl/interface-development/controls/list/actions/edit/ добавление по месту}.
     * Использование метода в списке с режимом "только чтение" невозможно.
     * @param {Controls/list:IItemAddOptions} options Параметры добавления.
     * @returns {Controls/editInPlace/TAsyncOperationResult.typedef}
     * @remark
     * Promise разрешается после монтирования контрола в DOM.
     * @see beginEdit
     */
    beginAdd(options?: IItemAddOptions): TAsyncOperationResult;
}
