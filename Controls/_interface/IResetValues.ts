/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IResetValuesOptions {
    resetStartValue?: Date;
    resetEndValue?: Date;
}

/**
 * Интерфейс для контролов, которые поддерживают сброс выбраннного периода.
 * @public
 */

export default interface IResetValues {
    readonly '[Controls/_interface/IResetValues]': boolean;
}

/**
 * @name Controls/_interface/IResetValues#resetStartValue
 * @cfg {Date} Начало периода, которое будет установлено после сброса значения
 * @remark
 * При использовании опции, рядом с контролом появится крестик, нажав на который, пользователь перейдет к
 * периоду, указанному в resetStartValue и resetEndValue. Если задана только resetEndValue - resetStartValue
 * будет установлен как null.
 * @demo Controls-demo/dateRange/RangeSelector/ResetValues/Index
 */

/**
 * @name Controls/_interface/IResetValues#resetEndValue
 * @cfg {Date} Конец периода, которое будет установлено после сброса значения
 * @remark
 * При использовании опции, рядом с контролом появится крестик, нажав на который, пользователь перейдет к
 * периоду, указанному в resetStartValue и resetEndValue. Если задана только resetStartValue - resetEndValue
 * будет установлен как null.
 * @demo Controls-demo/dateRange/RangeSelector/ResetValues/Index
 */
