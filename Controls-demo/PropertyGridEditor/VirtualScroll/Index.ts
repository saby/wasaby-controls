import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import * as template from 'wml!Controls-demo/PropertyGridEditor/VirtualScroll/Index';

const ITEMS_COUNT = 1000;

enum EditorType {
    Text = 'text',
    Boolean = 'boolean',
}

export default class Demo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _editingObject: object;
    protected _typeDescription: object[];

    protected _beforeMount(): void {
        this._typeDescription = this.getTypeDescriptions();
        this._editingObject = this.getEditingObject(this._typeDescription);
    }

    protected getTypeDescriptions(): object[] {
        const typeDescriptions = [];
        for (let i = 0; i < ITEMS_COUNT; i++) {
            const key = `item ${i}`;
            typeDescriptions.push({
                name: key,
                caption: key,
                type: this._getRandomType(),
            });
        }
        return typeDescriptions;
    }

    protected getEditingObject(description: object[]): object {
        const result = {};
        description.forEach((item: IFilterItem) => {
            result[item.name] = this._getValueForType(item.type);
        });

        return result;
    }

    private _getRandomType(): string {
        const types = Object.values(EditorType).filter((value) => {
            return typeof value === 'string';
        });

        return types[Math.floor(Math.random() * types.length)];
    }

    private _getValueForType(type: string): unknown {
        switch (type) {
            case EditorType.Boolean:
                return Math.random() < 0.5;
            case EditorType.Text:
                return 'testValue';
            default:
                return 'testValue';
        }
    }

    static _styles: string[] = ['Controls-demo/PropertyGridNew/PropertyGrid'];
}
