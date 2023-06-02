import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridEditor/Caption/CaptionPosition/Left/Left';
import {
    getEditingObject,
    getSource,
} from 'Controls-demo/PropertyGridNew/resources/Data';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._editingObject = getEditingObject();
        this._typeDescription = [
            ...getSource(),
            {
                name: 'longCaptionEditor',
                caption: 'Редактор с очень длинным названием',
                editorClass: 'controls-demo-pg-text-editor',
                group: 'text',
                type: 'text',
            },
        ];
    }

    static _styles: string[] = [
        'Controls-demo/PropertyGridEditor/PropertyGridEditor',
    ];
}
