/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
/**
 * Интерфейс редакторов propertyGrid.
 * @interface Controls/_propertyGrid/IEditor
 * @public
 */

/*
 * Interface of editor of PropertyGrid.
 * @interface Controls/_propertyGrid/IEditor
 * @author Герасимов А.М.
 */

import type { SyntheticEvent } from 'UICommon/Events';
import { IControlOptions } from 'UI/Base';

export default interface IEditor<T> extends IControlOptions {
    propertyValue?: T;
}

/**
 * @name Controls/_propertyGrid/IEditor#propertyValue
 * @cfg {*} Текущее значение свойства.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector on:selectedKeysChanged="_selectedKeysChanged()" selectedKeys="{{_options.propertyValue}}"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import { Control, TemplateFunction } from 'UI/Base';
 * import template = require('wml!MyEditor');
 *
 * class MyEditor extends Control implements IEditor {
 *    protected _template: Function = TemplateFunction;
 *
 *    _selectedKeysChanged(event: Event, selectedKeys: Array<number>): void {
 *       this._notify('propertyValueChanged', [selectedKeys], {bubbling: true});
 *    }
 * }
 *
 * export default MyEditor;
 * </pre>
 */

/**
 * @event propertyValueChanged Происходит после изменения значения свойства.
 * @name Controls/_propertyGrid/IEditor#propertyValueChanged
 * @param {UICommon/Events:SyntheticEvent} event Дескриптор события.
 * @param {*} value Новое значение свойства.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector on:selectedKeysChanged="_selectedKeysChanged()" selectedKeys="{{_options.propertyValue}}"/>
 * </pre>
 *
 * <pre class="brush: js; highlight: [9]">
 * // TypeScript
 * import { Control, TemplateFunction } from 'UI/Base';
 * import template = require('wml!MyEditor');
 *
 * class MyEditor extends Control implements IEditor {
 *    protected _template: Function = TemplateFunction;
 *
 *    _selectedKeysChanged(event: Event, selectedKeys: Array<number>): void {
 *       this._notify('propertyValueChanged', [selectedKeys], {bubbling: true});
 *    }
 * }
 *
 * export default MyEditor;
 * </pre>
 */

/**
 * Опции редакторов propertyGrid.
 * @public
 */
export interface IEditorProps<T> extends IEditor<T> {
    onPropertyValueChanged?: (event: SyntheticEvent, value: T) => void;
    jumpingLabel: boolean;
}
