/**
 * @kaizen_zone a79f3050-faba-4501-aee5-b3a15a75dfdf
 */
import { descriptor } from 'Types/entity';

export interface IValueValidatorObject {
    validator: Function;
    arguments: object;
}

export type TValueValidators = IValueValidatorObject[] | Function[];

export interface IValueValidatorsOptions {
    valueValidators: TValueValidators;
    validateByFocusOut: boolean;
}

export function getDefaultOptions() {
    return {
        valueValidators: [],
        validateByFocusOut: true,
    };
}

export function getOptionTypes() {
    return {
        valueValidators: descriptor(Array),
        validateByFocusOut: descriptor(Boolean),
    };
}

/**
 * Интерфейс для полей ввода с внутренней валидацией. Позволяет заать валидаторы для возвращаемого значения.
 *
 * @public
 */
export default interface IValueValidators {
    readonly '[Controls/_date/interface/IValueValidators]': boolean;
}

/**
 * @name Controls/_date/interface/IValueValidators#valueValidators
 * @cfg {Array} Массив вылидаторов или объектов содержащих валидаторы и их аргументы.
 *
 * @remark
 * При вызове валидатора в качестве аргументов он получает введнное в поле значение и заданные из прикладного кода
 * аргументы.
 *
 * @example
 * Поле ввода даты с валидатором, который проверяет, что в поле введено значение. Так же этот валидатор устанавливается
 * в поле ввода в диалоге выбора даты, который открывается по клику на кнопку рядом с полем ввода.
 * <pre>
 * <Controls.date:BaseInput>
 *     <ws:valueValidators>
 *         <ws:Array>
 *             <ws:Function>Controls/validate:isRequired</ws:Function>
 *         </ws:Array>
 *     </ws:valueValidators>
 * </Controls.date:BaseInput>
 * </pre>
 * Поле ввода с прикладным валидатором, который проверяет, что введенное значение лежит в интервале между _startValue
 * и _endValue.
 * <pre>
 * <Controls.date:BaseInput>
 *     <ws:valueValidators>
 *         <ws:Array>
 *             <ws:Object>
 *                 <ws:validator>
 *                     <ws:Function>Controls-demo/Input/DateBase/Validators/isInRange:default</ws:Function>
 *                 </ws:validator>
 *                 <ws:arguments startValue="{{_startValue}}" endValue="{{_endValue}}"/>
 *             </ws:Object>
 *         </ws:Array>
 *     </ws:valueValidators>
 * </Controls.date:BaseInput>
 * </pre>
 *
 * @see Controls/_date/interface/IValueValidators#validateByFocusOut
 */

/**
 * @name Controls/_date/interface/IValueValidators#validateByFocusOut
 * @cfg {Boolean} Если true, то внутренняя валидация будет срабатывать по уходу фокуса из контрола, если false то
 * будет срабатывать только по внешнему триггеру, например при валидации формы.
 * @default true
 *
 * @example
 * Включаем срабатывание валидации только по внешнему тригеру. Например при валидации формы.
 * <Controls.date:Input validateByFocusOut="{{false}}"/>
 *
 * @see Controls/_date/interface/IValueValidators#valueValidators
 */

/**
 * @name Controls/_date/interface/IValueValidators#errorTemplate
 * @cfg {Function} Пользовательский шаблон для отображения содержимого окна с ошибкой.
 */
