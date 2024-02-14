import { RecordSet } from 'Types/collection';
import { IControlOptions } from 'UI/Base';
import IStep, { IStepOptions } from '../IStep';

/**
 * Набор свойств, которыми конфигурируется шаг ленты.
 * @private
 */
export interface IStepBarItem {
    /**
     * Заголовок шага.
     */
    title: string;
    /**
     * Подзаголовок шага.
     */
    subtitle?: string;
    /**
     * Ширина шага в ленте. Значение задается в процентах. Если задана ширина одного шага, должна быть задана ширина и для всех остальных шагов.
     */
    width?: number;
}

/**
 * Интерфейс для контролов, отображающих ленту блоков.
 * @public
 */
export default interface IStepBar extends IStep {
    readonly '[Controls-Wizard/_horizontal/IStepBar]': boolean;
}

export interface IStepBarOptions extends IStepOptions, IControlOptions {
    /**
     * @name Controls-Wizard/_horizontal/IStepBar#items
     * @cfg {RecordSet<Controls-Wizard/_horizontal/IStepBar/IStepBarItem.typedef>} Конфигурация шагов.
     * @example
     * В данном примере показано, как задавать блоки ленты.
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.horizontal:StepBar items="{{items}}" />
     * </pre>
     * <pre class="brush: js">
     * // TypeScript
     * import {Control, ...} from 'UI/Base';
     * import {RecordSet} from 'Types/collection";
     * ...
     * export default class MyControl extends Control<...> {
     *     private items = new RecordSet({
     *         rawData: [{
     *             title: 'Проверка',
     *             itemTemplate: 'MyModule/Check'
     *         }, {
     *             title: 'Отправка',
     *             itemTemplate: 'MyModule/Send'
     *         }, {
     *             title: 'Результат',
     *             itemTemplate: 'MyModule/Result'
     *         }]
     *     });
     * }
     * </pre>
     */
    items: RecordSet<IStepBarItem>;
    /**
     * @name Controls-Wizard/_horizontal/IStepBar#displayMode
     * @cfg {String} Режим отображения контрола.
     * @default default
     * @variant default Широкий режим отображения.
     * @variant compact Узкий режим отображения.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Wizard.horizontal:StepBar displayMode="compact" />
     * </pre>
     */
    displayMode: 'default' | 'compact';
    /**
     * @name Controls-Wizard/_horizontal/IStepBar#currentStepIndex
     * @cfg {number} Номер текущего шага.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.horizontal:StepBar currentStepIndex="{{3}}" />
     * </pre>
     */
    currentStepIndex: number;
}
