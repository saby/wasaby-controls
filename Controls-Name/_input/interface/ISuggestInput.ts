import { IControlOptions, TemplateFunction } from 'UI/Base';
import { ICrud } from 'Types/source';
import {
    IContrastBackgroundOptions,
    INavigationOptions,
    INavigationSourceConfig,
} from 'Controls/interface';
import { INameValue } from './IInput';

/**
 * Интерфейс поля ввода ФИО.
 *
 * @mixes Controls/interface:ISource
 * @public
 */
export interface ISuggestInput
    extends IControlOptions,
        IContrastBackgroundOptions,
        INavigationOptions<INavigationSourceConfig> {
    fields?: string[];
    placeholders?: string[];
    firstName: string;
    middleName: string;
    lastName: string;
    value?: INameValue;
    filter?: object;
    source?: ICrud;
    displayProperty?: string;
    rightFieldTemplate?: TemplateFunction | string;
    trim?: boolean;
}

/**
 * @name Controls-Name/_input/interface/ISuggestInput#value
 * @cfg {Controls-Name/_input/interface/ISuggestInput/INameValue.typedef} Значение поля ввода ФИО
 * @default {}
 */

/**
 * @typedef INameValue
 * @property {String} firstName Значение поля имени.
 * @property {String} middleName Значение поля отчества.
 * @property {String} lastName Значение поля фамилии.
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#placeholderVisibility
 * @cfg {String} Определяет видимость подсказки.
 * @variant editable Подсказка отображается, когда поле пустое и доступно для редактирования.
 * @variant empty Подсказка отображается, когда поле пустое.
 * @default editable
 */
/**
 * @name Controls-Name/_input/interface/ISuggestInput#placeholders
 * @cfg {String[]} Массив значений прлейсхолдера для полей ввода.
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

/**
 * @name Controls-Name/_input/interface/ISuggestInput#rightFieldTemplate
 * @cfg {String|TemplateFunction} Строка или шаблон, содержащие прикладной контент, который будет отображаться справа
 * от поля ввода ФИО.
 * @demo Controls-Name-demo/RightFieldTemplate/Index
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#fields
 * @cfg {String[]} Массив отображаемых полей редактирования имени.
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

/**
 * @name Controls-Name/_input/interface/ISuggestInput#lastName
 * @cfg {String} Опция со значением фамилии.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input bind:lastName="lastName"/>
 * </pre>
 */

/**
 * @event Controls-Name/_input/interface/ISuggestInput#lastNameChanged Происходит, когда изменяется значение поля "Фамилия".
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} lastName новое значение.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input on:lastNameChanged="lastNameChanged()"
 * </pre>
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#firstName
 * @cfg {String} Опция со значением имени.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input bind:firstName="firstName"/>
 * </pre>
 */

/**
 * @event Controls-Name/_input/interface/ISuggestInput#firstNameChanged Происходит, когда изменяется значение поля "Имя".
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} firstName новое значение.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input on:firstNameChanged="firstNameChanged()"
 * </pre>
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#middleName
 * @cfg {String} Опция со значением отчества.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input bind:middleName="middleName"/>
 * </pre>
 */

/**
 * @event Controls-Name/_input/interface/ISuggestInput#middleNameChanged Происходит, когда изменяется значение поля "Отчество".
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} middleName новое значение.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input on:middleNameChanged="middleNameChanged()"
 * </pre>
 */

/**
 * @event Controls-Name/_input/interface/ISuggestInput#choose Происходит, когда пользователь выбирает элемент из автодополнения.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} value Выбранное значение.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input on:choose="_choose()"/>
 * </pre>
 * ts:
 * <pre>
 * private _suggestValue: RecordEntity;
 * ...
 * protected _choose(event: SyntheticEvent<Event>, value: RecordEntity): void {
 *     this._suggestValue = value;
 * }
 * </pre>
 */

/**
 * @event Controls-Name/_input/interface/ISuggestInput#genderChanged Происходит, когда бизнес-логика возвращает значение о предполагаемом поле пользователя.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Boolean | null} gender пол. Значения: true - мужской, false - женский, null - не определено.
 * @example
 * wml:
 * <pre class="brush: html">
 *     <Controls-Name.Input on:genderChanged="genderChanged()"
 * </pre>
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#contrastBackground
 * @cfg {boolean}
 * @default true
 * @demo Controls-Name-demo/doc/InputOptions/ContrastBackground/Index
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#source
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

/**
 * @name Controls-Name/_input/interface/ISuggestInput#trim
 * @cfg {boolean} Определяет наличие пробельных символов в начале и конце значения, после завершения ввода.
 * @remark
 * * false - Пробельные символы сохраняются.
 * * true - Пробельные символы удаляются.
 * @default false
 * @demo Controls-Name-demo/Trim/Index
 */

/**
 * @name Controls-Name/_input/interface/ISuggestInput#suggestPopupOptions
 * @cfg {Controls/popup:IStickyOpener} Конфигурация всплывающего блока {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/suggest/ автодополнения}.
 */
