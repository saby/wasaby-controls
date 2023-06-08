import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/EditInPlace/RowEditor/RowEditor';
import * as ColumnTemplate from 'wml!Controls-demo/treeGridNew/EditInPlace/RowEditor/ColumnTemplate';
import { HierarchicalMemory } from 'Types/source';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { Model } from 'Types/entity';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }

    protected _beforeMount(): void {
        this._columns[0].template = ColumnTemplate;
        this._viewSource = new HierarchicalMemory({
            keyProperty: 'key',
            data: Flat.getData(),
            parentProperty: 'parent',
        });
    }
}
