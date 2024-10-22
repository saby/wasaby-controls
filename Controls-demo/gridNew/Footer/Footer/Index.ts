// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/gridNew/Footer/Footer/Footer';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const COLUMNS_COUNT = 4;
const DATA_ITEMS_COUNT = 7;

function getData() {
    return Countries.getData(DATA_ITEMS_COUNT);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumnsWithFixedWidths(COLUMNS_COUNT);
    protected _footerCfg: unknown[] = [];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Footer: {
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
