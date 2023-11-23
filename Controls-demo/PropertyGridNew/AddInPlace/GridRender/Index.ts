import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IProperty as IPropertyGridItem } from 'Controls/propertyGrid';

import * as template from 'wml!Controls-demo/PropertyGridNew/AddInPlace/GridRender/GridRender';

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Model;
    protected _typeDescription: RecordSet;
    protected _itemActions: IItemAction[];
    private _fakeItemId: number = 0;

    protected _beforeMount(): void {
        this._editingObject = new Model<IPropertyGridItem>({
            rawData: {
                string: 'Значение',
                dynamicString: 'Значение',
            },
        });
        this._typeDescription = new RecordSet<IPropertyGridItem>({
            rawData: [
                {
                    caption: 'Папка',
                    name: 'Папка',
                    parent: null,
                    'parent@': true,
                },
                {
                    caption: 'Статическое свойство',
                    name: 'string',
                    editorTemplateName: 'Controls/propertyGrid:StringEditor',
                    parent: 'Папка',
                    'parent@': false,
                },
                {
                    caption: 'Динамическое свойство',
                    name: 'dynamicString',
                    isEditable: true,
                    editorTemplateName: 'Controls/propertyGrid:StringEditor',
                    parent: 'Папка',
                    'parent@': false,
                },
            ],
            keyProperty: 'name',
        });
    }

    protected _typeDescriptionChanged(
        e: SyntheticEvent,
        typeDescription: RecordSet<IPropertyGridItem>
    ): void {
        // console.log(typeDescription);
    }

    protected _editingObjectChanged(
        e: SyntheticEvent,
        editingObject: RecordSet<IPropertyGridItem>
    ): void {
        // console.log(editingObject);
    }

    protected _beginAdd(): void {
        const newItem = new Model({
            keyProperty: 'name',
            rawData: {
                name: 'dynamicString' + ++this._fakeItemId,
                caption: '',
                isEditable: true,
                editorTemplateName: 'Controls/propertyGrid:StringEditor',
            },
        });
        this._children.propertyGrid.beginAdd({ item: newItem });
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
