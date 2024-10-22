import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { lists } from './data';
import WithResults from './WithResults';

import controlTemplate = require('wml!Controls-demo/BreadCrumbs/ScenarioFirst/ScenarioFirst');
import 'css!Controls-demo/BreadCrumbs/Scenarios/Scenarios';

export default class ScenarioFirst extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _columns = lists[0].columns;
    protected _columns1 = lists[1].columns;
    protected _columns2 = lists[2].columns;
    protected _columns3 = lists[3].columns;
    protected _header1 = lists[1].header;
    protected _header2 = lists[2].header;
    protected _header3 = lists[3].header;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            BreadCrumbsScenarioFirst0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'department',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[0].data,
                    }),
                    root: 12221,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
            BreadCrumbsScenarioFirst1: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[1].data,
                    }),
                    root: 121111,
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
            ...WithResults.getLoadConfig(),
            BreadCrumbsScenarioFirst3: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        data: lists[3].data,
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                },
            },
        };
    }
}
