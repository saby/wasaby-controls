import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import controlTemplate = require('wml!Controls-demo/BreadCrumbs/Scenarios/Scenarios');

import ScenarioFirst from 'Controls-demo/BreadCrumbs/ScenarioFirst/Index';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ScenarioFirst.getLoadConfig(),
        };
    }
}
