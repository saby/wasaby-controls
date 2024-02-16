import { Control, TemplateFunction } from 'UI/Base';
import { data } from 'Controls-ListEnv-demo/Search/Tree/DataHelpers/Devices';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import CustomSource from './CustomSource';
import * as Template from 'wml!Controls-ListEnv-demo/Search/Tree/Search/Search';

function getData() {
    return data;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiselectionSearch: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new CustomSource({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    searchParam: 'title',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
