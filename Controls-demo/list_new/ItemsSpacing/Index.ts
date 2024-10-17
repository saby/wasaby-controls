import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { TOffsetSize } from 'Controls/interface';
import { Control, TemplateFunction } from 'UI/Base';
import { generateData } from '../DemoHelpers/DataCatalog';
import * as template from 'wml!Controls-demo/list_new/ItemsSpacing/Index';
import 'css!DemoStand/Controls-demo';
import { groupConstants } from 'Controls/display';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return generateData({
        keyProperty: 'key',
        count: 300,
        beforeCreateItemCallback: (item: { key: number; title: string; group: string }) => {
            item.title = `Запись с ключом ${item.key}.`;
            item.group =
                item.key < 10 ? groupConstants.hiddenGroup : 'group ' + Math.trunc(item.key / 10);
        },
    });
}

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _itemsSpacing: TOffsetSize = 'm';

    protected _itemsSpacingSource: RecordSet = new RecordSet({
        rawData: [
            { id: '3xs' },
            { id: '2xs' },
            { id: 'xs' },
            { id: 's' },
            { id: 'st' },
            { id: 'm' },
            { id: 'l' },
            { id: 'xl' },
            { id: '2xl' },
            { id: '3xl' },
        ],
        keyProperty: 'id',
    });

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemsSpacing: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
                        source: 'page',
                        view: 'infinity',
                        sourceConfig: {
                            pageSize: 10,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
