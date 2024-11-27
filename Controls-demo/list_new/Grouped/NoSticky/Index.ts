import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

import { getGroupedCatalog as getData } from '../../DemoHelpers/Data/Groups';

import * as Template from 'wml!Controls-demo/list_new/Grouped/NoSticky/NoSticky';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedNoSticky0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
