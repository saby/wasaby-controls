import { Control, TemplateFunction } from 'UI/Base';
import { data } from 'Controls-ListEnv-demo/Search/Tree/DataHelpers/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from 'Controls-ListEnv-demo/Search/DataHelpers/ExpandedSource';
import * as Template from 'wml!Controls-ListEnv-demo/Search/Tree/SelectionType/SelectionType';

function getData() {
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiselectionSelectionType: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    root: null,
                    searchParam: 'title',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
