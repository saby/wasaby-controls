import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsPosition/ResultsPosition';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ResultsPositionBottom from 'Controls-demo/gridNew/Results/ResultsPosition/Bottom/Index';
import ResultsPositionTop from 'Controls-demo/gridNew/Results/ResultsPosition/Top/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ResultsPositionBottom.getLoadConfig(),
            ...ResultsPositionTop.getLoadConfig(),
        };
    }
}
