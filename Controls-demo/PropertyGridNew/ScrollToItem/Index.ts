import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction } from 'Controls/itemActions';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IProperty as IPropertyGridItem } from 'Controls/propertyGrid';

import * as template from 'wml!Controls-demo/PropertyGridNew/ScrollToItem/Index';

function genRows(n: number) {
    const result = [];

    for (let i = 0; i < n; i++) {
        result.push({
            caption: 'Свойство #' + i,
            name: 'string' + i,
            editorTemplateName: 'Controls/propertyGridEditors:String',
            parent: 'Папка',
            'parent@': false,
        });
    }

    return result;
}

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: Model;
    protected _typeDescription: RecordSet;
    protected _itemActions: IItemAction[];
    private _fakeItemId: number = 0;

    protected _scrollTo() {
        this._children.propertyGrid.scrollToItem('string40', 'bottom');
    }

    protected _beforeMount(): void {
        const rows = genRows(50);

        this._editingObject = new Model<IPropertyGridItem>({
            rawData: {
                string1: 'Значение',
                ...rows.reduce((accum, row, i) => ({ ...accum, [row.name]: 'Значение' + i }), {}),
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
                ...rows,
            ],
            keyProperty: 'name',
        });
    }

    protected _beginAdd(): void {
        const newItem = new Model({
            keyProperty: 'name',
            rawData: {
                name: 'dynamicString' + ++this._fakeItemId,
                caption: '',
                isEditable: true,
                editorTemplateName: 'Controls/propertyGridEditors:String',
            },
        });
        this._children.propertyGrid.beginAdd({ item: newItem });
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
