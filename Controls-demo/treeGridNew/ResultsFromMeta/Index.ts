import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/ResultsFromMeta';

import ResultsFromMetaCustomResultsCells from 'Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/Index';
import ResultsFromMetaCustomResultsRow from 'Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsRow/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ResultsFromMetaCustomResultsCells.getLoadConfig(),
            ...ResultsFromMetaCustomResultsRow.getLoadConfig(),
        };
    }
}
