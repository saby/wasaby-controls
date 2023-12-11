/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { TemplateFunction } from 'UI/Base';
import { ILabelOptions } from 'Controls/input';
import { IFontWeightOptions } from 'Controls/interface';
import { Model } from 'Types/entity';
import {
    TCaptionPosition,
    TEditingObject,
    TTypeDescription,
} from 'Controls/_propertyGrid/IPropertyGrid';

type TProperty =
    | 'string'
    | 'boolean'
    | 'number'
    | 'date'
    | 'enum'
    | 'text'
    | 'list'
    | 'propertyGrid'
    | 'lookup';
export interface IValidatorArgs {
    value: unknown;
    item: Model<IProperty>;
    items: TTypeDescription;
    editingObject: TEditingObject;
}
type TValidatorFunc = (args: IValidatorArgs) => boolean | string;
export type TValidator = TValidatorFunc | string;

/**
 * Интерфейс опций для {@link Controls/propertyGrid:PropertyGrid}.
 * @public
 */

/*
 * Interface of PropertyGrid property.
 * @author Герасимов А.М.
 */
export default interface IProperty {
    /**
     * @cfg Имя свойства.
     * @remark Значения из редакторов свойств попадают в editingObject по имени свойства.
     * @example
     * <pre class="brush: js; highlight: [10,15];">
     * // JavaScript
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
     * <pre class="brush: html;">
     * <!-- WML -->
     * <Controls.propertyGrid:PropertyGrid
     *     bind:editingObject="_editingObject"
     *     typeDescription="{{_typeDescription}}"/>
     * </pre>
     */
    name: string;
    /**
     * @cfg Текст метки редактора свойства.
     * @example
     * <pre class="brush: js; highlight: [11,16];">
     * // JavaScript
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
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls.propertyGrid:PropertyGrid
     *     bind:editingObject="_editingObject"
     *     typeDescription="{{_source}}"/>
     * </pre>
     * @see captionOptions
     * @see captionTemplate
     */
    caption?: string;
    /**
     * @cfg Шаблон для метки редактора свойства.
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <div class='myBlueLabel'>
     *    label
     * </div>
     * </pre>
     * @see caption
     * @see captionOptions
     */
    captionTemplate?: TemplateFunction;
    /**
     * @cfg {Object} Опция для {@link Controls/input:Label метки}, отображающейся рядом с редактором
     * @example
     * <pre class="brush: js; highlight: [12-15];">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *       showBackgroundImage: true
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          captionOptions: {
     *              required: true,
     *              fontSize: 'l'
     *          }
     *          type: 'text'
     *       }, {
     *          name: 'showBackgroundImage',
     *          caption: 'Показывать изображение'
     *       }
     *    ]
     * }
     * </pre>
     * @see caption
     * @see captionTemplate
     */
    captionOptions?: ILabelOptions & IFontWeightOptions;
    /**
     * @cfg Имя контрола, который будет использоваться в качестве редактора. Если параметр не задан, будет использоваться редактор по-умолчанию.
     * @remark
     * Редактору в опции propertyValue приходит текущее значение св-во из {@link Controls/propertyGrid:PropertyGrid#editingObject}
     * При изменении значения редактор должен пронотифицировать об изменениях событием propertyValueChanged
     * @demo Controls-demo/PropertyGridNew/Editors/CustomEditor/Index
     * @see editorOptions
     * @see type
     */
    editorTemplateName?: string;
    /**
     * @cfg Опции редактора свойства.
     * @example
     * <pre class="brush: js; highlight: [12-15];">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          editorOptions: {
     *             fontSize: 'm',
     *             fontColorStyle: 'danger'
     *          }
     *       }
     *    ]
     * }
     * </pre>
     * Включение jumpingLabel для редактора
     * <pre class="brush: js; highlight: [12-14]">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          editorOptions: {
     *             jumpingLabel: true
     *          }
     *       }
     *    ]
     * }
     * </pre>
     * @see editorTemplateName
     */
    editorOptions?: Record<string, unknown>;
    editorOptionsName?: string;
    /**
     * @cfg {String} CSS класс, который устанавливается на корневую DOM-ноду редактора
     * @example
     * <pre class="brush: js; highlight: [12]">
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          group: 'siteDescription',
     *          editorClass: 'myClass'
     *       }
     *    ];
     * }
     * </pre>
     */
    editorClass?: string;
    /**
     * @cfg {String} Тип свойства.
     * @variant number Числовой тип, редактор по умолчанию - {@link Controls/propertyGrid:NumberEditor}
     * @variant boolean Логический тип, редактор по умолчанию - {@link Controls/propertyGrid:BooleanEditor}
     * @variant string Строковой тип, редактор по умолчанию - {@link Controls/propertyGrid:StringEditor}
     * @variant text Строковой тип, отличается от типа string редактором - {@link Controls/propertyGrid:TextEditor}
     * @variant enum Перечисляемый тип, редактор по умолчанию - {@link Controls/propertyGrid:EnumEditor}
     * @remark Если параметр не задан, тип будет определен по значению {@link propertyValue свойства}.
     * @example
     * <pre class="brush: js">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com'
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text'
     *       }
     *    ]
     * }
     * </pre>
     */
    type?: TProperty;
    /**
     * @cfg Поле, по которому будут сгруппированы редакторы.
     * @example
     * <pre class="brush: js; highlight: [13,17]">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com',
     *       showBackgroundImage: true
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          group: 'siteDescription'
     *       }, {
     *          name: 'showBackgroundImage',
     *          caption: 'Показывать изображение',
     *          group: 'siteDescription'
     *       }
     *    ]
     * }
     * </pre>
     */
    group?: string;
    /**
     * @cfg {String} Задаёт иконку для кнопки скрытия/отображения редактора.
     * @remark Набор кнопок для скрытия/отображения редакторов будет отображаться под последним редактором.
     * @example
     * <pre class="brush: js; highlight: [12]">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com'
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          toggleEditorButtonIcon: 'icon-done'
     *       }
     *    ]
     * }
     * </pre>
     * @see toggledEditors
     * @demo Controls-demo/PropertyGridNew/Source/ToggleEditorButtonIcon/Index
     */
    toggleEditorButtonIcon?: string;
    /**
     * @cfg {String} Задаёт подсказку для кнопки скрытия/отображения редактора.
     * @example
     * <pre class="brush: js; highlight: [13]">
     * // JavaScript
     * _beforeMount() {
     *    this._editingObject = {
     *       description: 'This is http://mysite.com'
     *    };
     *
     *    this._source = [
     *       {
     *          name: 'description',
     *          caption: 'Описание',
     *          type: 'text',
     *          toggleEditorButtonIcon: 'icon-done',
     *          toggleEditorButtonTooltip: 'Описание'
     *       }
     *    ]
     * }
     * </pre>
     * @see toggledEditors
     * @see toggleEditorButtonIcon
     * @demo Controls-demo/PropertyGridNew/Source/ToggleEditorButtonIcon/Index
     */
    toggleEditorButtonTooltip?: string;
    /**
     * @typedef {String} TValidateTemplate
     * @description Шаблоны для валидации значения.
     * @variant Controls/validate:SelectionContainer
     * @variant Controls/validate:InputContainer
     */

    /**
     * @name Controls/_propertyGrid/IPropertyGrid#validateTemplateName
     * @cfg {TValidateTemplate} Шаблон для валидации значения в редакторе свойства.
     * @demo Controls-demo/PropertyGridNew/Validators/Index
     * @see validators
     */
    validateTemplateName?: string;

    /**
     * @typedef {Function} TValidatorArguments
     * @description Параметры для функции, которая валидирует значение св-ва.
     * @param {Object | Types/entity:Model} value Объект, свойства которого являются значениями для редакторов.
     * @param {Model<IPropertyGridProperty>} item Редактируемое свойство
     * @param {Controls/_propertyGrid/IProperty[]} items свойства в PropertyGrid
     */

    /**
     * @name Controls/_propertyGrid/IPropertyGrid#validators
     * @cfg {TValidator[]} Функции-валидаторы для свойства.
     * @demo Controls-demo/PropertyGridNew/Validators/Index
     * @see validateTemplateName
     */
    validators?: TValidator[];
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#captionValidators
     * @cfg {TValidatorFunc[]} Функции-валидаторы для метки свойства
     * @demo Controls-demo/PropertyGridNew/Validators/Index
     * @see validateTemplateName
     * @see validators
     */
    captionValidators?: TValidator[];
    /**
     * @name Controls/_propertyGrid/IPropertyGrid#isEditable
     * @cfg {Boolean} Определяет, возможно ли редактирование текста метки редактора.
     * @demo Controls-demo/PropertyGridNew/AddInPlace/GridRender/Index
     * @see caption
     * @see editorOption
     */
    isEditable?: boolean;

    /**
     * @cfg {Controls/_propertyGrid/IPropertyGrid/TCaptionPosition.typedef} Определяет расположение заголовка редактора.
     * @remark Позволяет переопределить расположение заголовка, выставленное для всего PropertyGrid, на отдельно взятом редакторе.
     * @demo Controls-demo/PropertyGridNew/ItemCaptionPosition/Index
     * @see Controls/_propertyGrid/IPropertyGrid#captionPosition
     */
    captionPosition?: TCaptionPosition;
}
