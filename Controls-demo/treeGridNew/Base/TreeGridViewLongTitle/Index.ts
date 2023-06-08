import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/Base/TreeGridViewLongTitle/TreeGridViewLongTitle';
import { HierarchicalMemory } from 'Types/source';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IColumn } from 'Controls/grid';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalMemory;
    protected _viewSourceOverflow: HierarchicalMemory;
    protected _columns: IColumn[] = Flat.getColumns();
    protected _columnsOverflow: IColumn[] = Array.from(Flat.getColumns()).map(
        (item) => {
            return {
                ...item,
                textOverflow: 'ellipsis',
            };
        }
    );

    protected _beforeMount(): void {
        const data = Flat.getData();
        const { title } = data[0];
        data[0].title = `${title} ${title} ${title} ${title}`;

        const config = {
            keyProperty: 'key',
            data,
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        };

        this._viewSource = new HierarchicalMemory(config);
        this._viewSourceOverflow = new HierarchicalMemory(config);
    }
}
