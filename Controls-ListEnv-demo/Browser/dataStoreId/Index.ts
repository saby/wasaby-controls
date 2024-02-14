import { HierarchicalMemory } from 'Types/source';
import { FlatHierarchy } from 'Controls-ListEnv-demo/DemoData/Data';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { connectToDataContext } from 'Controls/context';
import { TFilter } from 'Controls/interface';
import * as template from 'wml!Controls-ListEnv-demo/Browser/dataStoreId/Index';
import * as filter from './searchFilter';
import 'css!Controls-ListEnv-demo/Browser/dataStoreId/Index';

const filterDescription = [
    {
        name: 'discount',
        value: false,
        resetValue: false,
        textValue: '',
        editorTemplateName: 'Controls/filterPanel:BooleanEditor',
        viewMode: 'extended',
        extendedCaption: 'Со скидкой',
    },
];

const source = new HierarchicalMemory({
    parentProperty: 'parent',
    keyProperty: 'id',
    data: FlatHierarchy.getData(),
    filter,
});

class BrowserDemoStoreId extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _columns = FlatHierarchy.getGridColumns();
    protected _filter: TFilter;

    protected _beforeMount(options): void {
        this._filter = options._dataOptionsValue.browserDemo.filter;
    }
}
const connectedDemo = connectToDataContext(BrowserDemoStoreId);
connectedDemo.getLoadConfig = (): Record<string, unknown> => {
    return {
        browserDemo: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source,
                searchParam: 'description',
                keyProperty: 'id',
                displayProperty: 'title',
                parentProperty: 'parent',
                nodeProperty: 'type',
                root: null,
                listAction: 'Controls-ListEnv-demo/Browser/dataStoreId/actions',
                filterDescription,
            },
        },
    };
};
export default connectedDemo;
