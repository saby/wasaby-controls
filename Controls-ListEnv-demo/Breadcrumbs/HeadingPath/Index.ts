import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Breadcrumbs/HeadingPath/HeadingPath';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { HierarchicalMemory } from 'Types/source';
import { Model } from 'Types/entity';
import { TColumns } from 'Controls/grid';
import { FlatHierarchy } from 'Controls-ListEnv-demo/_DemoData/Data';
import { SyntheticEvent } from 'UICommon/Events';

export default class HeadingPathDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns: TColumns = FlatHierarchy.getGridColumns();

    protected _itemClick(e: SyntheticEvent, item: Model): void {
        e.stopPropagation();
        if (item.get('type')) {
            // this._children.tree._children.listControl._options._dataOptionsValue.nomenclature.setRoot(item.getKey());
        }
    }
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            nomenclature: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        parentProperty: 'parent',
                        keyProperty: 'id',
                        data: FlatHierarchy.getData(),
                    }),
                    root: 1,
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    displayProperty: 'title',
                    searchParam: 'title',
                    columns: FlatHierarchy.getGridColumns(),
                    keyProperty: 'id',
                },
            },
        };
    }
}
