/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IResetValueOptions {
    resetValue?: boolean | null;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку предустановленного значения.
 * @public
 */
export default interface IResetValue {
    readonly '[Controls/_interface/IResetValueOptions]': boolean;
}

/**
 * @name Controls/_interface/IResetValue#resetValue
 * @cfg {boolean} Предустановленное значение
 */
