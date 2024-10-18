/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
export interface IResetValueOptions {
    resetValue: Date | null;
}

/**
 * Интерфейс для контролов, которые поддерживают сброс выбраннной даты.
 *
 * @interface Controls/_date/interface/IResetValue
 * @public
 */

/**
 * @name Controls/_date/interface/IResetValue#resetValue
 * @cfg {Date|null} Дата, которая будет установлена после сброса значения.
 * @remark В опцию можно указать null, в таком случае выбор даты полностью сбросится.
 */
