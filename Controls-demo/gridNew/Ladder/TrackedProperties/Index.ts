import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/TrackedProperties/Template';
import * as MonthTemplate from 'wml!Controls-demo/gridNew/Ladder/TrackedProperties/MonthTemplate';
import { TrackedProperties } from 'Controls-demo/gridNew/DemoHelpers/Data/TrackedProperties';
import { ITrackedPropertiesItem } from 'Controls/interface';
import 'css!DemoStand/Controls-demo';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = TrackedProperties;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: object[] = [
        {
            displayProperty: 'month',
            width: 'max-content',
        },
        {
            displayProperty: 'day',
            width: 'max-content',
        },
        {
            displayProperty: 'name',
            width: '1fr',
        },
    ];
    protected _header: object[] = [
        {
            title: 'mon',
        },
        {
            title: 'day',
        },
        {
            title: 'nam',
        },
    ];
    protected _ladderProperties: string[] = ['month', 'day'];
    protected _trackedProperties: ITrackedPropertiesItem[] = [
        {
            propertyName: 'month',
            template: MonthTemplate,
        },
        {
            propertyName: 'day',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
