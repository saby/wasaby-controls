import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/IterativeLoadTimeout/IterativeLoadTimeout';
import PortionedSearchMemory from 'Controls-ListEnv-demo/Search/List/DataHelpers/PortionedSearchMemory';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchingIterativeLoadTimeout: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new PortionedSearchMemory({
                        direction: 'down',
                        keyProperty: 'key',
                    }),
                    searchParam: 'title',
                    iterativeLoadTimeout: 10,
                    navigation: {
                        source: 'position',
                        view: 'infinity',
                        sourceConfig: {
                            field: 'key',
                            position: 0,
                            direction: 'forward',
                            limit: 20,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    }
}