import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/LoadMore/ReverseLoad/ReverseLoad';
import { IColumn } from 'Controls/grid';
import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { HierarchicalReverseMemory, getData, getColumns } from './Data';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: HierarchicalReverseMemory;
    protected _columns: IColumn[] = getColumns();
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = {
        source: 'position',
        view: 'demand',
        sourceConfig: {
            direction: 'bothways',
            field: 'key',
            limit: 2,
            // multiNavigation: true
        },
    };

    protected _beforeMount(): void {
        this._viewSource = new HierarchicalReverseMemory({
            keyProperty: 'key',
            parentProperty: 'parent',
            data: getData(),
        });
    }
}
