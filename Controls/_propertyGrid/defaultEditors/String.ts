/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UI/Events';
import template = require('wml!Controls/_propertyGrid/defaultEditors/String');
import { constants } from 'Env/Env';

import IEditorOptions from 'Controls/_propertyGrid/IEditorOptions';
import IEditor from 'Controls/_propertyGrid/IEditor';

export interface IStringEditorOptions
    extends IControlOptions,
        IEditor<string> {}

/**
 * Редактор для строкового типа данных.
 * @class Controls/_propertyGrid/defaultEditors/StringEditor
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_propertyGrid.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @demo Controls-demo/PropertyGridNew/Editors/String/Index
 */

/*
 * Editor for string type.
 * @extends UI/Base:Control
 * @implements Controls/propertyGrid:IEditor
 *
 * @public
 * @author Герасимов А.М.
 */

class StringEditor extends Control<IStringEditorOptions> {
    protected _template: TemplateFunction = template;

    protected value: string = '';
    private initialValue: string = '';

    _beforeMount(options: IStringEditorOptions): void {
        this.value = options.propertyValue;
        this.initialValue = options.propertyValue;
    }

    _beforeUpdate(newOptions: IStringEditorOptions): void {
        if (this._options.propertyValue !== newOptions.propertyValue) {
            this.value = newOptions.propertyValue;
            this.initialValue = newOptions.propertyValue;
        }
    }

    _inputCompleted(event: Event, value: string): void {
        if (this.initialValue !== value) {
            this.initialValue = value;
            this._notify('propertyValueChanged', [value], { bubbling: true });
        }
    }

    _keyDown(event: SyntheticEvent<KeyboardEvent>): void {
        if (event.nativeEvent.keyCode === constants.key.esc) {
            this._notify('propertyValueChanged', [this.value], {
                bubbling: true,
            });
        }
    }

    static getDefaultOptions(): Partial<IEditorOptions> {
        return {
            propertyValue: '',
        };
    }
}

export = StringEditor;
