/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { IUnderlineOptions } from 'Controls/interface';

export interface INumberFormatOptions extends IUnderlineOptions {
    useGrouping?: boolean;
    showEmptyDecimals?: boolean;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку числового формата.
 * @public
 */
interface INumberFormat {
    readonly '[Controls/_interface/INumberFormat]': boolean;
}

export default INumberFormat;

/**
 * @name Controls/_interface/INumberFormat#useGrouping
 * @cfg {Boolean} Определяет, следует ли использовать разделители группы.
 * @default true
 * @demo Controls-demo/Decorator/Number/UseGrouping/Index
 * @remark
 * * true - число разделено на группы.
 * * false - разделения не происходит.
 */
/**
 * @name Controls/_interface/INumberFormat#showEmptyDecimals
 * @cfg {Boolean} Определяет, отображать ли нули в конце десятичной части.
 * @default false
 * @demo Controls-demo/Decorator/Money/ShowEmptyDecimals/Index
 * @demo Controls-demo/Decorator/Number/ShowEmptyDecimals/Index
 * @remark
 * * true - отображать нули в десятичной части.
 * * false - не отображать нули в десятичной части.
 */
