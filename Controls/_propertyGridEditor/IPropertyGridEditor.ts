/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
import { IProperty, IPropertyGrid } from 'Controls/propertyGrid';
import { IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IItemAction, TItemActionVisibilityCallback } from 'Controls/itemActions';
import {
    IPromiseSelectableOptions,
    ISelectionTypeOptions,
    IItemPaddingOptions,
    TKey,
    TFontSize,
    TFontWeight,
} from 'Controls/interface';

export type TCaptionPosition = 'left' | 'top' | 'none';
export type TTypeDescription = IProperty[] | RecordSet<IProperty>;
export type TEditingObject = Model | Record<string, unknown>;
export type TCollapsedGroupsElement = string | number;
export interface IPropertyGridEditorOptions
    extends IControlOptions,
        IPromiseSelectableOptions,
        ISelectionTypeOptions,
        IItemPaddingOptions {
    /**
     * @cfg {Object | Types/entity:Model} Объект, свойства которого являются значениями для редакторов.
     * @example
     * <pre class="brush: js; highlight: [4-7,10-15,];">
     * // JavaScript
     * _beforeMount() {
     *    // Пример со значением в виде объекта
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *       showBackgroundImage: true,
     *    };
     *
     *    // Пример со значением в виде модели.
     *    this._editingObject = new Model({
     *        rawData: {
     *           description: 'This is http://mysite.com',
     *           showBackgroundImage: true,
     *       }
     *    })
     *
     *    this._typeDescription = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text'
     *       },
     *       {
     *          name: "showBackgroundImage",
     *          caption: "Показывать изображение",
     *          group: "boolean"
     *       }
     *    ]
     * }
     * </pre>
     *
     * <pre class="brush: html; highlight: [3];">
     * <!-- WML -->
     * <Controls.propertyGridEditor:PropertyGridEditor
     *     bind:editingObject="_editingObject"
     *     typeDescription="{{_typeDescription}}"/>
     * </pre>
     * @demo Controls-demo/PropertyGridEditor/Caption/CaptionPosition/Left/Index
     */
    editingObject: TEditingObject;
    /**
     * @cfg {Controls/_propertyGrid/IProperty[]} Конфигурация свойств в PropertyGrid.
     * Например, можно установить текст метки, которая будет отображаться рядом с редактором или сгруппировать свойства по определённому признаку.
     * @remark Если конфигурация для свойства не передана, она будет сформирована автоматически.
     * @example
     * Задаём конфигурацию
     * <pre class="brush: js; highlight: [8-18];">
     * // TypeScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *       showBackgroundImage: true,
     *    };
     *
     *    this._typeDescription = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text'
     *       }, {
     *          name: "showBackgroundImage",
     *          caption: "Показывать изображение",
     *          group: "boolean"
     *       }
     *    ]
     * }
     * </pre>
     *
     * <pre class="brush: html; highlight: [4];">
     * <!-- WML -->
     * <Controls.propertyGridEditor:PropertyGridEditor
     *    bind:editingObject="_editingObject"
     *    typeDescription="{{_typeDescription}}"/>
     * </pre>
     * @demo Controls-demo/PropertyGridNew/Source/Index
     */
    typeDescription?: TTypeDescription;
    /**
     * @default Controls/propertyGridEditor:GroupTemplate
     * @example
     * Далее показано как изменить параметры шаблона.
     * <pre class="brush: html; highlight: [3-11]">
     * <!-- WML -->
     * <Controls.propertyGridEditor:PropertyGridEditor>
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/propertyGridEditor:GroupTemplate"
     *          expanderVisible="{{true}}"
     *          scope="{{groupTemplate}}">
     *          <ws:contentTemplate>
     *              <div>Заголовок группы</div>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.propertyGridEditor:PropertyGridEditor>
     * </pre>
     * @demo Controls-demo/PropertyGridEditor/Group/Template/Index
     * @see groupProperty
     * @see collapsedGroups
     */
    groupTemplate?: Function;
    /**
     * Шаблон отображения элемента
     * @default Controls/propertyGridEditor:ItemTemplate
     * @remark
     * Для отображения элементов используется базовый шаблон {@link Controls/treeGrid:ItemTemplate дерева}.
     * Подробнее о настройке смотрите на странице {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/item/ дерева с колонками}
     * @example
     * Далее показано как изменить параметры шаблона.
     * <pre class="brush: html; highlight: [3-11]">
     * <!-- WML -->
     * <Controls.propertyGridEditor:PropertyGridEditor>
     *    <ws:itemTemplate>
     *       <ws:partial template="Controls.propertyGridEditor:ItemTemplate" clickable="{{false}}"/>
     *    </ws:itemTemplate>
     * </Controls.propertyGridEditor:PropertyGridEditor>
     * </pre>
     */
    itemTemplate?: Function;
    /**
     * @cfg {String} Имя свойства, содержащего идентификатор группы элемента редактора свойств.
     * @default group
     * @example
     *  <pre class="brush: html; highlight: [2]">
     * <!-- WML -->
     * <Controls.propertyGridEditor:PropertyGridEditor groupProperty='myGroupField'>
     *    ...
     * </Controls.propertyGridEditor:PropertyGridEditor>
     * </pre>
     * <pre class="brush: js;; highlight: [7]">
     * // TypeScript
     * _beforeMount() {
     *     this._propertyGridSource = [
     *         {
     *             name: 'myProperty'
     *             type: 'string',
     *             myGroupField: 'myGroup'
     *         }
     *     ];
     * }
     * </pre>
     */
    groupProperty?: string;
    /**
     * @cfg {Array.<String>} Список идентификаторов свернутых групп.
     * @see groupTemplate
     */
    collapsedGroups?: TCollapsedGroupsElement[];
    /**
     * @cfg {String} Имя свойства, содержащего информацию о типе элемента (лист, узел).
     * @see parentProperty
     */
    nodeProperty?: string;
    /**
     * @cfg {String} Имя свойства, содержащего сведения о родительском узле.
     * @see nodeProperty
     */
    parentProperty?: string;
    /**
     * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
     */
    keyProperty?: string;
    /**
     * @cfg {Array.<Controls/itemActions:IItemAction>} Конфигурация опций записи.
     * @demo Controls-demo/PropertyGridEditor/ItemActions/ItemActions/Index
     * @see itemActionVisibilityCallback
     */
    itemActions: IItemAction[];
    /**
     * Функция управления видимостью операций над записью.
     * @name Controls/_propertyGridEditor:IPropertyGridEditor#itemActionVisibilityCallback
     * @function
     * @param {Controls/itemActions:IItemAction} action Объект с настройкой действия.
     * @param {Types/entity:Model} item Экземпляр записи, действие над которой обрабатывается.
     * @remark Если из функции возвращается true, то операция отображается.
     * @demo Controls-demo/PropertyGridEditor/ItemActions/ItemActionVisibilityCallback/Index
     * @see itemActions
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
    /**
     * @cfg {Controls/display:MultiSelectAccessibility} Имя поля записи, в котором хранится состояние видимости чекбокса.
     * @see multiSelectVisibility
     */
    multiSelectAccessibilityProperty?: string;
    /**
     * @cfg {String} Видимость чекбоксов.
     * @variant visible Показать.
     * @variant hidden Скрыть.
     * @variant onhover Показывать при наведении.
     * @default hidden
     * @demo Controls-demo/PropertyGridEditor/MultiSelect/MultiSelectVisibility/Visible/Index
     * @see multiSelectAccessibilityProperty
     */
    multiSelectVisibility?: 'visible' | 'onhover' | 'hidden';
    /**
     * @cfg {String} Позиционирование чекбоксов.
     * @variant default Стандартная позиция чекбоксов в начале строки.
     * @variant custom Позиционирование чекбокса в произвольном месте пользовательского шаблона.
     * @default default
     */
    multiSelectPosition?: 'default' | 'custom';
    /**
     * @cfg {TemplateFunction|String} Пользовательский шаблон множественного выбора.
     */
    multiSelectTemplate?: Function;
    /**
     * @cfg {String} Цвет текста заголовков редакторов.
     * @variant unaccented
     * @variant label
     * @default label
     * @remark Значение fontColorStyle, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridEditor/Caption/CaptionOptions/Index
     */
    captionFontColorStyle: 'label' | 'unaccented';
    /**
     * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта заголовков редакторов.
     * @default m
     * @remark Значение fontSize, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridEditor/Caption/CaptionOptions/Index
     */
    captionFontSize: TFontSize;
    /**
     * @cfg {Controls/_interface/IFontWeight/TFontWeight.typedef} Начертание шрифта заголовков редакторов.
     * @variant default
     * @variant normal
     * @variant bold
     * @default default
     * @remark Значение fontWeight, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridEditor/Caption/CaptionOptions/Index
     */
    captionFontWeight: TFontWeight;
    captionPosition?: TCaptionPosition;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#jumpingLabel
     * @cfg {Boolean} Выводить прыгающие метки для всех редакторов.
     */
    jumpingLabel: boolean;
    /**
     * @cfg {Controls/propertyGrid:IPropertyGridColumn} Конфигурации ширины колонки редактора.
     */
    editorColumnOptions?: IPropertyGrid.IPropertyGridColumnOptions;
    /**
     * @cfg {Controls/propertyGrid:IPropertyGridColumn} Конфигурации ширины колонки заголовка редактора.
     */
    captionColumnOptions?: IPropertyGrid.IPropertyGridColumnOptions;
}

/**
 * Интерфейс контрола {@link Controls/propertyGridEditor:PropertyGridEditor}.
 * @public
 */
export interface IPropertyGridEditor {
    readonly '[Controls/_propertyGridEditor/IPropertyGridEditor]': boolean;
}
