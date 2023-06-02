/**
 * @kaizen_zone 8b1886ea-b987-4659-bc96-c96169eb1599
 */
import { IMaxLengthOptions } from 'Controls/_input/interface/IMaxLength';

export interface ITextOptions extends IMaxLengthOptions {
    constraint?: string | RegExp;
    convertPunycode?: boolean;
    trim?: boolean;
    transliterate?: boolean;
}

/**
 * Интерфейс текстового поля ввода.
 *
 * @interface Controls/_input/interface/IText
 * @implements Controls/input:IMaxLength
 * @public
 */
export interface IText {
    readonly '[Controls/_input/interface/IText]': boolean;
}

/**
 * @name Controls/_input/interface/IText#constraint
 * @cfg {String | RegExp} Фильтр вводимого значения в формате регулярного выражения {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Regular_Expressions#special-character-set [xyz]}.
 * @remark
 * Каждый, введенный символ пользователем, фильтруется отдельно. Символ не прошедший фильтрацию в поле не добавляется.
 * Например, пользователь вставляет "1ab2cd" в поле с ограничением "[0-9]". Будет вставлено "12".
 * @demo Controls-demo/Input/Constraint/Index
 */
/**
 * @name Controls/_input/interface/IText#convertPunycode
 * @cfg {Boolean} Нужно ли преобразовывать вводимое значения из Punycode в Unicode.
 * @demo Controls-demo/Input/ConvertPunycode/Index
 */
/**
 * @name Controls/_input/interface/IText#trim
 * @cfg {Boolean} Определяет наличие пробельных символов в начале и конце значения, после завершения ввода.
 * @remark
 * * false - Пробельные символы сохраняются.
 * * true - Пробельные символы удаляются.
 * @demo Controls-demo/Input/Trim/Index
 * @default true
 */
/**
 * @name Controls/_input/interface/IText#transliterate
 * @cfg {Boolean} Определяет включена ли транслитерация на сочетание клавиш Alt+t или PauseBreak.
 * @default true
 * @demo Controls-demo/Input/Text/Transliterate/Index
 */
/**
 * @name Controls/_input/interface/IText#contrastBackground
 * @cfg {Boolean}
 * @demo Controls-demo/Input/Text/ContrastBackground/Index
 */
