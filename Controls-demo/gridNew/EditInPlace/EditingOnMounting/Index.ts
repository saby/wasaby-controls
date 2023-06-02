import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingOnMounting/EditingOnMounting';
import * as EditingTemplate from 'wml!Controls-demo/gridNew/EditInPlace/EditingOnMounting/EditingTemplate';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { TColspanCallbackResult } from 'Controls/display';
import { IEditingConfig } from 'Controls/display';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _editingConfig: IEditingConfig = null;

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }

    protected _beforeMount(): Promise<void> {
        this._columns[0].template = EditingTemplate;
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: [],
        });

        return this._viewSource.create().then((record) => {
            this._editingConfig = {
                toolbarVisibility: true,
                item: record,
                editOnClick: true,
            };
        });
    }
}
