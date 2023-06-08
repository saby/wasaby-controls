/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import template = require('wml!Controls/_propertyGrid/defaultEditors/Text');
import StringEditor = require('Controls/_propertyGrid/defaultEditors/String');

/**
 * Редактор для многострочного типа данных.
 * @class Controls/_propertyGrid/defaultEditors/TextEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 * @implements Controls/input:IText
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/input:IFieldTemplate
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/Text/Index
 */

/*
 * Editor for multiline string type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @author Герасимов А.М.
 */

class TextEditor extends StringEditor {
    protected _template: Function = template;
}

export = TextEditor;
