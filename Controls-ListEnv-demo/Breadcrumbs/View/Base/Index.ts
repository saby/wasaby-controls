import { Model } from 'Types/entity';
import { getCatalogData } from 'Controls-ListEnv-demo/Breadcrumbs/View/resources/Data';
import { SyntheticEvent } from 'Vdom/Vdom';
import { HierarchicalMemory } from 'Types/source';
import { Control, TemplateFunction } from 'UI/Base';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import * as template from 'wml!Controls-ListEnv-demo/Breadcrumbs/View/Base/Index';
import { connectToDataContext } from 'Controls/context';

class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _root: number = 11;

    protected _onItemClick(event: SyntheticEvent, item: Model): void {
        if (item.get('node')) {
            this._options._dataOptionsValue.viewData.setRoot(item.getKey());
            this._root = item.getKey();
        }
    }
}
const ContextClass = connectToDataContext(Index);
ContextClass.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        viewData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new HierarchicalMemory({
                    data: getCatalogData(),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    filter,
                }),
                keyProperty: 'id',
                displayProperty: 'title',
                parentProperty: 'parent',
                nodeProperty: 'node',
                root: 11,
            },
        },
    };
};

export default ContextClass;
