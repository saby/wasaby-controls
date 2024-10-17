import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import * as Template from 'wml!Controls-demo/gridNew/Ladder/TrackedPropertiesWithStickyBlocks/Template';
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
            displayProperty: 'date',
            width: 'max-content',
            align: 'right',
        },
        {
            displayProperty: 'name',
            width: '1fr',
        },
    ];
    protected _header: object[] = [
        {
            title: 'date',
        },
        {
            title: 'name',
        },
    ];
    protected _ladderProperties: string[] = ['date'];
    protected _trackedProperties: ITrackedPropertiesItem[] = [
        {
            propertyName: 'date',
            template: MonthTemplate,
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            LadderTrackedPropertiesWithSticky: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    multiSelectVisibility: 'visible',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
