import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FromMeta/FromMeta';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ResultsFromMetaCustomResultsRow from 'Controls-demo/gridNew/Results/FromMeta/CustomResultsRow/Index';
import ResultsFromMetaCustomResultsCells from 'Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ResultsFromMetaCustomResultsRow.getLoadConfig(),
            ...ResultsFromMetaCustomResultsCells.getLoadConfig(),
        };
    }
}
