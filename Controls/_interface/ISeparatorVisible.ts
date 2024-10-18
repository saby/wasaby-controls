/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface ISeparatorVisibleOptions {
    separatorVisible?: boolean;
}
/**
 * Интерфейс для контролов в которых присутствует разделительная линия между элементами
 * @public
 */
export default interface ISeparatorVisible {
    readonly '[Controls/_interface/ISeparatorVisible]': boolean;
}

/**
 * @name Controls/_interface/ISeparatorVisible#separatorVisible
 * @cfg {Boolean} Определяет наличие разделителя
 * @default true
 */
