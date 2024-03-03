import { IControlOptions, TemplateFunction } from 'UI/Base';
import IStep, { IStepOptions } from '../IStep';
import { IStepBarItem } from './IStepBar';
import { AreaSlice } from 'Controls-DataEnv/dataFactory';

/**
 * Набор свойств, которыми конфигурируется шаг в раскладке ленты.
 * @typedef {Object} ILayoutItem
 * @property {String} title Заголовок шага.
 * @property {Number} [width] Ширина шага в ленте блоков. Значение задается в процентах. Если задана ширина одного шага, должна быть задана ширина и для всех остальных шагов.
 * @property {String|Function} template Шаблон отображения шага.
 * @property {Object} templateOptions Опции для шаблона шага.
 */
export interface ILayoutItem extends IStepBarItem {
    template: string | TemplateFunction;
    templateOptions: Object;
}

/**
 * Интерфейс контрола для раскладки ленты шагов и визуального отображения шага.
 * @public
 */
export default interface ILayout extends IStep {
    readonly '[Controls-Wizard/_horizontal/ILayout]': boolean;
}

export interface ILayoutOptions extends IStepOptions, IControlOptions {
    /**
     * @name Controls-Wizard/_horizontal/ILayout#items
     * @cfg {ILayoutItem[]} Конфигурация шагов.
     * @example
     * В данном примере показано, как задавать элементы для отображения
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.horizontal:Layout items="{{items}}" />
     * </pre>
     * <pre class="brush: js">
     * // TypeScript
     * import {Control, ...} from 'UI/Base';
     * ...
     * export default class MyControl extends Control<...> {
     *     private items = [{
     *         title: 'Проверка',
     *         template: 'MyModule/Check,
     *         templateOptions: {
     *             someOption: someValue
     *         }
     *     }, {
     *         title: 'Отправка',
     *         template: 'MyModule/Send',
     *         templateOptions: {
     *             someOption: someValue
     *         }
     *     }, {
     *         title: 'Результат',
     *         template: 'MyModule/Result',
     *         templateOptions: {
     *             someOption: someValue
     *         }
     *     }]
     * }
     * </pre>
     */
    items: ILayoutItem[];
    /**
     * @name Controls-Wizard/_horizontal/ILayout#displayMode
     * @cfg {String} Режим отображения ленты шагов.
     * @default default
     * @variant default Широкий режим отображения.
     * @variant compact Узкий режим отображения.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.horizontal:Layout displayMode="compact" />
     * </pre>
     */
    displayMode: 'default' | 'compact';

    _dataOptionsValue?: AreaSlice;
}
