import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IHeaderCell } from 'Controls/grid';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IEditingConfig } from 'Controls/display';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as template from 'wml!Controls-demo/gridNew/NewColumnScroll/EditOnAfterMount/EditOnAfterMount';
import * as cellEditor from 'wml!Controls-demo/gridNew/NewColumnScroll/EditOnAfterMount/cellEditor';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _editingConfig: IEditingConfig = null;
    protected _header: IHeaderCell[] = Countries.getHeader().slice(1);
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths()
        .slice(1)
        .map((c) => {
            return {
                ...c,
                template: cellEditor,
            };
        });
    protected _hasItems: boolean = false;
    protected _isEditing: boolean = false;
    protected _isMounted: boolean = false;

    private _fakeId: number = 1000;

    protected _beforeMount(): void {
        this._columns[1].width = '100px';
        this._columns[2].width = '100px';
        this._columns[3].width = '100px';
        this._columns[4].width = '200px';
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [],
        });
        this._editingConfig = {
            editOnClick: true,
            toolbarVisibility: true,
        };
    }

    protected _afterMount(): void {
        this._isMounted = true;
        this._beginAdd();
    }

    protected _beginAdd(): void {
        const key = this._fakeId++;
        this._children.grid.beginAdd({
            item: new Model({
                rawData: {
                    key,
                    number: key + 1,
                    country: null,
                    capital: null,
                    population: null,
                    square: null,
                    populationDensity: null,
                },
            }),
        });
    }

    protected _onAfterBeginEnd(): void {
        this._isEditing = true;
    }
    protected _onBeforeEndEdit(
        e: SyntheticEvent,
        item: Model,
        willSave: boolean
    ): void {
        this._isEditing = false;
        this._hasItems = this._hasItems || willSave;
    }
}
