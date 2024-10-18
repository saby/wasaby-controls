/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { QuerySelectExpression } from 'Types/source';

export interface ISelectFieldsOptions {
    selectFields?: QuerySelectExpression;
}
/**
 * Интерфейс для контролов, поддерживающих выборку по именам полей.
 * @public
 */
export default interface ISelectFields {
    readonly '[Controls/_interface/ISelectFields]': boolean;
}

/**
 * @name Controls/_interface/ISelectFields#selectFields
 * @cfg {Array} Устанавливает имена полей для выбора.
 * @example
 * Выберем магазинные заказы с определенным набором полей.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.list:View selectField="{{['id', 'date', 'customerId']}}"/>
 * </pre>
 * {@link Types/_source/Query/Join#select}
 */
