/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
export interface INumberLengthOptions {
    integersLength?: number;
    precision?: number;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку длины числа.
 *
 * @interface Controls/_input/interface/INumberLength
 * @public
 */
export interface INumberLength {
    readonly '[Controls/_input/interface/INumberLength]': boolean;
}

/**
 * @name Controls/_input/interface/INumberLength#integersLength
 * @cfg {Number} Максимальная длина целой части.
 * @remark
 * Если значение не задано, длина целой части не ограничена.
 * @demo Controls-demo/Input/Number/IntegersLength/Index
 */
/**
 * @name Controls/_input/interface/INumberLength#precision
 * @cfg {Number} Количество знаков в дробной части.
 * @remark
 * Если значение не задано, количество знаков не ограничено. Если задано значение 0, то можно вводить только целые числа.
 * @demo Controls-demo/Input/Number/Precision/Index
 */
