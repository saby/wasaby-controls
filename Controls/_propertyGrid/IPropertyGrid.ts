/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import IPropertyGridProperty from './IProperty';
import { IControlOptions, Control } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    IItemAction,
    TItemActionVisibilityCallback,
    IContextMenuConfig,
} from 'Controls/itemActions';
import { IEditingPropertyGrid } from 'Controls/_propertyGrid/interface/IEditingPropertyGrid';
import {
    IPromiseSelectableOptions,
    ISelectionTypeOptions,
    IItemPaddingOptions,
    TKey,
    TFontSize,
    TFontWeight,
} from 'Controls/interface';

export type TCaptionPosition = 'left' | 'top' | 'none';

/**
 * Интерфейс для опций {@link Controls/propertyGrid:IPropertyGrid#editorColumnOptions editorColumnOptions} и {@link Controls/propertyGrid:IPropertyGrid#captionColumnOptions captionColumnOptions}.
 * @interface Controls/property:IPropertyGridColumn
 * @public
 */
export interface IPropertyGridColumnOptions {
    /**
     * @name Controls/property:IPropertyGridColumn#width
     * @cfg Ширина.
     */
    width: string;
    /**
     * @name Controls/property:IPropertyGridColumn#compatibleWidth
     * @cfg Ширина в браузерах, не поддерживающих {@link https://developer.mozilla.org/ru/docs/web/css/css_grid_layout CSS Grid Layout}.
     */
    compatibleWidth: string;
}

export type TTypeDescription = IPropertyGridProperty[] | RecordSet<IPropertyGridProperty>;
export type TEditingObject = Model | Record<string, unknown>;
export type TCollapsedGroupsElement = string | number;
export interface IPropertyGridOptions
    extends IControlOptions,
        IPromiseSelectableOptions,
        ISelectionTypeOptions,
        IItemPaddingOptions,
        IEditingPropertyGrid {
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#editingObject
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
     * <Controls.propertyGrid:PropertyGrid
     *     bind:editingObject="_editingObject"
     *     typeDescription="{{_typeDescription}}"/>
     * </pre>
     * @demo Controls-demo/PropertyGridNew/Editors/CustomEditor/Index
     */
    /*
     * @name Controls/_propertyGrid/IPropertyGrid#editingObject
     * @cfg {Object} data object that will be displayed as editors with values in _propertyGrid
     */
    editingObject: TEditingObject;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#typeDescription
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
     * <Controls.propertyGrid:PropertyGrid
     *    bind:editingObject="_editingObject"
     *    typeDescription="{{_typeDescription}}"/>
     * </pre>
     * @demo Controls-demo/PropertyGridNew/Source/Index
     */
    typeDescription?: TTypeDescription;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#groupTemplate
     * @cfg {String|TemplateFunction} Устанавливает шаблон отображения заголовка группы.
     * @default Controls/propertyGrid:GroupTemplate
     * @example
     * Далее показано как изменить параметры шаблона.
     * <pre class="brush: html; highlight: [3-11]">
     * <!-- WML -->
     * <Controls.propertyGrid:PropertyGrid>
     *    <ws:groupTemplate>
     *       <ws:partial template="Controls/propertyGrid:GroupTemplate"
     *          expanderVisible="{{true}}"
     *          scope="{{groupTemplate}}">
     *          <ws:contentTemplate>
     *              <div>Заголовок группы</div>
     *          </ws:contentTemplate>
     *       </ws:partial>
     *    </ws:groupTemplate>
     * </Controls.propertyGrid:PropertyGrid>
     * </pre>
     * @remark
     * Подробнее о параметрах шаблона Controls/propertyGrid:GroupTemplate читайте {@link Controls/propertyGrid:GroupTemplate здесь}.
     * @demo Controls-demo/PropertyGridNew/Group/Template/Index
     * @see groupProperty
     * @see collapsedGroups
     */
    groupTemplate?: Function;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#groupProperty
     * @cfg {String} Имя свойства, содержащего идентификатор группы элемента редактора свойств.
     * @default group
     * @demo Controls-demo/PropertyGridNew/groupProperty/Index
     * @example
     *  <pre class="brush: html; highlight: [2]">
     * <!-- WML -->
     * <Controls.propertyGrid:PropertyGrid groupProperty='myGroupField'>
     *    ...
     * </Controls.propertyGrid:PropertyGrid>
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
     * @see groupTemplate
     * @see collapsedGroups
     */
    groupProperty?: string;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#collapsedGroups
     * @cfg {Array.<String>} Список идентификаторов свернутых групп.
     * @see groupTemplate
     * @demo Controls-demo/PropertyGridNew/CollapsedGroups/Index
     */
    collapsedGroups?: TCollapsedGroupsElement[];
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#nodeProperty
     * @cfg {String} Имя свойства, содержащего информацию о типе элемента (лист, узел).
     * @demo Controls-demo/PropertyGridNew/ParentProperty/Index
     * @see parentProperty
     */
    nodeProperty?: string;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#parentProperty
     * @cfg {String} Имя свойства, содержащего сведения о родительском узле.
     * @demo Controls-demo/PropertyGridNew/ParentProperty/Index
     * @see nodeProperty
     */
    parentProperty?: string;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#keyProperty
     * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
     */
    keyProperty?: string;
    render?: Control<IPropertyGridOptions>;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#itemActions
     * @cfg {Array.<Controls/itemActions:IItemAction>} Конфигурация опций записи.
     * @demo Controls-demo/PropertyGridNew/ItemActions/Index
     * @see itemActionVisibilityCallback
     */
    itemActions: IItemAction[];
    /**
     * Функция управления видимостью операций над записью.
     * @name Controls/_propertyGrid/IPropertyGrid#itemActionVisibilityCallback
     * @function
     * @param {Controls/itemActions:IItemAction} action Объект с настройкой действия.
     * @param {Types/entity:Model} item Экземпляр записи, действие над которой обрабатывается.
     * @remark Если из функции возвращается true, то операция отображается.
     * @demo Controls-demo/PropertyGridNew/ItemActionVisibilityCallback/Index
     * @see itemActions
     */
    itemActionVisibilityCallback?: TItemActionVisibilityCallback;
    /**
     * @cfg {Controls/propertyGrid:IPropertyGridColumn} Конфигурации ширины колонки редактора.
     * @demo Controls-demo/PropertyGridNew/EditorColumnOptions/Index
     */
    editorColumnOptions?: IPropertyGridColumnOptions;
    /**
     * @cfg {Controls/propertyGrid:IPropertyGridColumn} Конфигурации ширины колонки заголовка редактора.
     * @demo Controls-demo/PropertyGridNew/CaptionColumnOptions/Index
     */
    captionColumnOptions?: IPropertyGridColumnOptions;
    levelPadding?: boolean;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#multiSelectAccessibilityProperty
     * @cfg {Controls/display:MultiSelectAccessibility} Имя поля записи, в котором хранится состояние видимости чекбокса.
     * @see multiSelectVisibility
     */
    multiSelectAccessibilityProperty?: string;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#multiSelectVisibility
     * @cfg {String} Видимость чекбоксов.
     * @variant visible Показать.
     * @variant hidden Скрыть.
     * @variant onhover Показывать при наведении.
     * @default hidden
     * @demo Controls-demo/PropertyGridNew/MultiSelectVisibility/VisibleWithColumns/Index
     * @see multiSelectAccessibilityProperty
     */
    multiSelectVisibility?: 'visible' | 'onhover' | 'hidden';
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#multiSelectPosition
     * @cfg {String} Позиционирование чекбоксов.
     * @variant default Стандартная позиция чекбоксов в начале строки.
     * @variant custom Позиционирование чекбокса в произвольном месте пользовательского шаблона.
     * @demo Controls-demo/PropertyGridNew/MultiSelectPosition/Custom/Index
     * @default default
     */
    multiSelectPosition?: 'default' | 'custom';
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#multiSelectTemplate
     * @cfg {TemplateFunction|String} Пользовательский шаблон множественного выбора.
     */
    multiSelectTemplate?: Function;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#captionFontColorStyle
     * @cfg {String} Цвет текста заголовков редакторов.
     * @variant unaccented
     * @variant label
     * @default label
     * @remark Значение fontColorStyle, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridNew/CaptionOptions/Index
     */
    captionFontColorStyle: 'label' | 'unaccented';
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#captionFontSize
     * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта заголовков редакторов.
     * @default m
     * @remark Значение fontSize, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridNew/CaptionOptions/Index
     */
    captionFontSize: TFontSize;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#captionFontWeight
     * @cfg {Controls/_interface/IFontWeight/TFontWeight.typedef} Начертание шрифта заголовков редакторов.
     * @variant default
     * @variant normal
     * @variant bold
     * @default default
     * @remark Значение fontWeight, заданное в {{Controls/_propertyGrid/IProperty#captionOptions опциях заголовка редактора}} имеет больший приоритет.
     * @demo Controls-demo/PropertyGridNew/CaptionOptions/Index
     */
    captionFontWeight: TFontWeight;
    captionPosition?: TCaptionPosition;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#contextMenuConfig
     * @cfg {Controls/itemActions:IItemAction#contextMenuConfig} Конфигурация контекстного меню.
     * @demo Controls-demo/PropertyGridNew/ItemActions/Index
     * @see itemActionVisibilityCallback
     * @see itemActions
     */
    contextMenuConfig?: IContextMenuConfig;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#toggledEditors
     * @cfg {Array.<String>} Список идентификаторов скрытых редакторов.
     * @see toggleEditorButtonIcon
     * @demo Controls-demo/PropertyGridNew/Source/ToggleEditorButtonIcon/Index
     */
    toggledEditors?: TKey[];
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#jumpingLabel
     * @cfg {Boolean} Выводить прыгающие метки для всех редакторов.
     * @demo Controls-demo/PropertyGridNew/JumpingLabelExtended/Index
     */
    jumpingLabel: boolean;
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#limit
     * @cfg {number} Ограничивает количество выводимых редакторов до указанного количества.
     * @demo Controls-demo/PropertyGridNew/Limit/Index
     */
    limit?: number;
}

/**
 * @typedef {String} TCaptionPosition
 * @description Расположение заголовка редактора.
 * @variant left слева
 * @variant top сверху
 * @variant none заголовки не выводятся
 */

/**
 * @name Controls/_propertyGrid/IPropertyGrid#captionPosition
 * @cfg {TCaptionPosition.typedef} Расположение заголовка редактора.
 * @default left
 * @demo Controls-demo/PropertyGridNew/CaptionPosition/Index
 */

/**
 * @event itemClick Происходит при клике на элемент.
 * @name Controls/_propertyGrid/IPropertyGrid#itemClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_propertyGrid/PropertyGridCollectionItem} item Элемент, по которому произвели клик.
 * @param {Object} originalEvent Дескриптор исходного события.
 */

/**
 * @event editingObjectChanged Происходит при изменении объекта, свойства которого являются значениями для редакторов.
 * @name Controls/_propertyGrid/IPropertyGrid#editingObjectChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object | Types/entity:Model} editingObject Объект, с обновленными значениями для редакторов.
 */

/**
 * @event Controls/_propertyGrid/IPropertyGrid#typeDescriptionChanged Происходит при изменении конфигурации свойств в PropertyGrid.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/_propertyGrid/IProperty[]} typeDescription конфигурация свойств в PropertyGrid.
 * @see typeDescription
 */

/**
 * @event Controls/_propertyGrid/IPropertyGrid#toggledEditorsChanged Происходит при скрытии или показе редакторов.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String[]} hiddenEditorsKeys Список идентификаторов всех скрытых редакторов.
 * @param {String[]} lastHiddenEditorsKeys Список идентификаторов, которые были скрыты перед вызовом события.
 * @param {String[]} lastShownEditorsKeys Список идентификаторов, которые были показаны перед вызовом события.
 * @demo Controls-demo/PropertyGridNew/Source/ToggleEditorButtonIcon/Index
 * @see toggleEditorButtonIcon
 * @see toggledEditors
 */

/**
 * @event Controls/_propertyGrid/IPropertyGrid#validateFinished Происходит при завершении валидации редактора.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} editorName Название редактора.
 * @param {null|Boolean|String[]} validationResult Результат работы функции-валидатора.
 * @demo Controls-demo/PropertyGridNew/Validators/Index
 */

/**
 * Интерфейс контрола {@link Controls/propertyGrid:PropertyGrid}.
 * @interface Controls/_propertyGrid/IPropertyGrid
 * @public
 */

/*
 * Property grid options
 *
 * @interface Controls/_propertyGrid/IPropertyGrid
 * @public
 * @author Герасимов А.М.
 */
export interface IPropertyGrid {
    readonly '[Controls/_propertyGrid/IPropertyGrid]': boolean;
}
