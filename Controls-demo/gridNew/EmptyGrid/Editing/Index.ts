import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import type { SyntheticEvent } from 'Vdom/Vdom';
import type { Model } from 'Types/entity';
import type { IColumn, IHeaderCell } from 'Controls/grid';

import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/Editing/Editing';
import * as editingCell from 'wml!Controls-demo/gridNew/EmptyGrid/Editing/cellEditor';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _hasItems: boolean = false;
    protected _isEditing: boolean = false;
    protected _inputValue: string = '';
    protected _emptyEditorStyle: string = 'default';
    protected _hasGridBackground: boolean = false;

    protected _header: IHeaderCell[] = Countries.getHeader().slice(1);
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths()
        .slice(1)
        .map((c) => {
            return {
                ...c,
                template: editingCell,
            };
        });

    private _fakeId: number = 1000;

    protected _beforeMount(): void {
        this._columns[0].width = '400px';
        this._columns[4].width = 'auto';
    }

    protected _beginAdd(): void {
        const key = this._fakeId++;
        this._children.grid.beginAdd({
            meta: {
                number: key + 1,
                country: null,
                capital: null,
                population: null,
                square: null,
                populationDensity: null,
            },
        });
    }

    protected _setEmptyEditorStyle(_: SyntheticEvent, style: string): void {
        if (this._emptyEditorStyle !== style) {
            this._emptyEditorStyle = style;
        }
    }

    protected _toggleGridBackground(): void {
        this._hasGridBackground = !this._hasGridBackground;
    }

    protected _onAfterBeginEnd(): void {
        this._isEditing = true;
    }

    protected _onBeforeEndEdit(e: SyntheticEvent, item: Model, commit: boolean): void {
        this._isEditing = false;
        this._hasItems = this._hasItems || commit;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EmptyGridEditing: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
