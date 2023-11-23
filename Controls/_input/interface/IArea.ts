/**
 * @kaizen_zone 2a31278f-f868-4f4f-9ef4-3e21a7f9f586
 */
import { TemplateFunction } from 'UI/Base';
import { ITextOptions } from 'Controls/_input/interface/IText';
import { IBaseInputOptions } from 'Controls/_input/Base';
import { ICounterVisibilityOptions } from 'Controls/_input/interface/ICounterVisibility';

export interface IAreaOptions extends ITextOptions, IBaseInputOptions, ICounterVisibilityOptions {
    maxLines?: number;
    minLines?: number;
    value?: string;
    optimizeShadow?: boolean;
    footerTemplate?: string | TemplateFunction;
    readonlyViewMode?: string;
}

/**
 * Интерфейс многострочного поля ввода.
 * @interface Controls/_input/interface/IArea
 * @public
 */

/**
 * @name Controls/_input/interface/IArea#readonlyViewMode
 * @cfg {String} Определяет режим отображения контролла в режиме на чтение
 * @variant text Отображается как текст
 * @variant field Отображается как поле ввода
 * @default text
 */

/**
 * @name Controls/_input/interface/IArea#minLines
 * @cfg {Number} Минимальное количество строк.
 * @remark
 * Определяет минимальную высоту поля ввода, при этом в поле может быть введено сколько угодно строк текста.
 * Поддерживается значение от 1 до 10.
 * При задании в fontSize значение inherit, опция перестает работать.
 * @see maxLines
 * @see fontSize
 * @default 1
 * @demo Controls-demo/Input/Area/MinMaxLines/Index
 */

/**
 * @name Controls/_input/interface/IArea#maxLines
 * @cfg {Number} Максимальное количество строк.
 * @remark
 * Определяет максимальную высоту поля ввода, при этом в поле может быть введено сколько угодно строк текста. Если максимальная высота не равна минимальной, то поле ввода тянется по высоте при вводе текста.
 * При вводе текста, превышающего максимальную высоту, в поле ввода появляется скролл.
 * Поддерживается значение от 1 до 10.
 * При задании в fontSize значение inherit, опция перестает работать.
 * @see minLines
 * @see fontSize
 * @demo Controls-demo/Input/Area/MinMaxLines/Index
 */

/**
 * @name Controls/_input/interface/IArea#footerTemplate
 * @cfg {String|TemplateFunction} Строка или шаблон, содержащие контент подвала, который будет отображаться в многострочном поле.
 * @demo Controls-demo/Input/Area/FooterTemplate/Index
 */

/**
 * @name Controls/_input/interface/IArea#optimizeShadow
 * @cfg {Boolean} Включает режим быстрой отрисовки тени.
 * @default true
 * @remark
 * true - Оптимизированные тени.
 * false - Не оптимизированные тени.
 *
 * Отключите оптимизированные тени, если:
 *
 * * У {@link Controls/input:Area} непрозрачный фон.
 * * Controls/input:Area находится в элементе с непрозрачным фоном.
 */
