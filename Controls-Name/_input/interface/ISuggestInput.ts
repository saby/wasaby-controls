import { IControlOptions, TemplateFunction } from 'UI/Base';
import { ICrud } from 'Types/source';
import {
    IContrastBackgroundOptions,
    INavigationOptions,
    INavigationSourceConfig,
} from 'Controls/interface';
import { INameValue } from './IInput';
import { IStickyOpener } from 'Controls/popup';

/**
 * Интерфейс поля ввода ФИО.
 *
 * @extends Controls/interface:ISource
 * @extends Controls/interface:IContrastBackgroundOptions
 * @extends Controls/interface:INavigationSourceConfig
 * @public
 */
export interface ISuggestInput
    extends IControlOptions,
        IContrastBackgroundOptions,
        INavigationOptions<INavigationSourceConfig> {
    /**
     * @cfg {string[]} Массив отображаемых полей редактирования имени.
     * Доступные идентификаторы частей ФИО:
     * "lastName" - фамилия
     * "firstName" - имя
     * "middleName" - отчество
     * @example
     * Demo.wml:
     * <pre class="brush: html">
     *     <Controls-Name.Input fields="{{ _fields }}"/>
     * </pre>
     * Demo.ts:
     * <pre>
     *     ...
     *     this._fields = ["lastName", "firstName"];
     *     ...
     * </pre>
     */
    fields?: string[];
    /**
     * @cfg {string[]} Массив значений прлейсхолдера для полей ввода.
     * @example
     * <pre>
     *     protected _beforeMount(): void {
     *         this._placeholders = ['customLastName', 'customFirstName', 'customMiddleName'];
     *     }
     * </pre>
     * <pre>
     *     <Controls-Name.Input ...
     *                 placeholders="{{ _placeholders }}"/>
     * </pre>
     * @demo Engine-demo/doc/Placeholders/Index
     */
    placeholders?: string[];
    /**
     * @cfg {string} Опция со значением имени.
     * @example
     * wml:
     * <pre class="brush: html">
     *     <Controls-Name.Input bind:firstName="firstName"/>
     * </pre>
     */
    firstName: string;
    /**
     * @cfg {string} Опция со значением отчества.
     * @example
     * wml:
     * <pre class="brush: html">
     *     <Controls-Name.Input bind:middleName="middleName"/>
     * </pre>
     */
    middleName: string;
    /**
     * @cfg {string} Опция со значением фамилии.
     * @example
     * wml:
     * <pre class="brush: html">
     *     <Controls-Name.Input bind:lastName="lastName"/>
     * </pre>
     */
    lastName: string;
    /**
     * @cfg {Controls-Name/Input:INameValue} Значение поля ввода ФИО
     */
    value?: INameValue;
    /**
     * @cfg {Object} Определяет настройку фильтра, для автозаполнения
     */
    filter?: object;
    /**
     * @cfg {Types/source:ICrud} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
     * Используется когда необходимо отображать меню с автодополнением при вводе ФИО
     * @example
     * В приведённом примере для контрола в опцию source передаётся {@link Types/source:HierarchicalMemory} источник.
     * Контрол при вводе ФИО получит данные из источника и отображает их в выпадающем меню.
     *
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Name:Input source="{{_source}}" keyProperty="id" displayProperty="suggestValue"/>
     * </pre>
     *
     * <pre class="brush: js">
     * import {Memory} from "Types/source";
     *
     * _source: null,
     * _beforeMount: function() {
     *      keyProperty: 'id',
     *       data: [
     *          {id: 1, suggestValue: 'Алексей', type: 'firstName'},
     *          {id: 2, suggestValue: 'Александр', type: 'firstName'},
     *          {id: 3, suggestValue: 'Андрей', type: 'firstName'},
     *          {id: 4, suggestValue: 'Владимир', type: 'firstName'},
     *          {id: 5, suggestValue: 'Иван', type: 'firstName'},
     *          {id: 6, suggestValue: 'Илья', type: 'firstName'},
     *          {id: 7, suggestValue: 'Алексеев', type: 'lastName'},
     *          {id: 8, suggestValue: 'Александров', type: 'lastName'},
     *          {id: 9, suggestValue: 'Иванов', type: 'lastName'},
     *          {id: 10, suggestValue: 'Алексеевич', type: 'middleName'},
     *          {id: 11, suggestValue: 'Александрович', type: 'middleName'},
     *          {id: 12, suggestValue: 'Андреевич', type: 'middleName'},
     *          {id: 13, suggestValue: 'Иванович', type: 'middleName'},
     *          {id: 14, suggestValue: 'Ильич', type: 'middleName'},
     *          {id: 15, suggestValue: 'Владимирович', type: 'middleName'}
     *      ],
     *      filter: (item, queryFilter: Record<string, string | unknown>) => {
     *      ...
     *      }
     *      create((params: {
     *          value?: string,
     *          order: string[],
     *          firstName?: string,
     *          middleName?: string,
     *          lastName?: string
     *      }) => {
     *      ...
     *      }
     * }
     * </pre>
     * @demo Controls-Name-demo/Demo/Index
     */
    source?: ICrud;
    /**
     * @cfg {Controls/popup:IStickyOpener} Конфигурация всплывающего блока {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
     */
    suggestPopupOptions?: IStickyOpener;
    /**
     * @cfg {string} Имя поля элемента, значение которого будет отображаться в поле ввода ФИО
     */
    displayProperty?: string;
    /**
     * @cfg {TemplateFunction | string} Строка или шаблон, содержащие прикладной контент, который будет отображаться справа
     * от поля ввода ФИО.
     * @demo Controls-Name-demo/RightFieldTemplate/Index
     */
    rightFieldTemplate?: TemplateFunction | string;
    /**
     * @cfg {boolean} Определяет наличие пробельных символов в начале и конце значения, после завершения ввода.
     * @remark
     * * false - Пробельные символы сохраняются.
     * * true - Пробельные символы удаляются.
     * @default false
     * @demo Controls-Name-demo/Trim/Index
     */
    trim?: boolean;
    /**
     * @cfg {string} Определяет видимость подсказки.
     * @variant editable Подсказка отображается, когда поле пустое и доступно для редактирования.
     * @variant empty Подсказка отображается, когда поле пустое.
     */
    placeholderVisibility?: 'editable' | 'empty';
    /**
     * @private
     */
    hideReorderButton?: boolean;
}
