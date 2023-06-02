import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/Colspan/Colspan';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/Colspan/ColumnTemplate';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _columns: IColumn[] = Flat.getColumns();

    protected _beforeMount(): void {
        this._columns[0].template = ColumnTemplate;
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Flat.getData(),
        });
    }

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }
}
