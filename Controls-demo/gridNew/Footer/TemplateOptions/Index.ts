// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as Template from 'wml!Controls-demo/gridNew/Footer/TemplateOptions/Index';
import 'wml!Controls-demo/gridNew/Footer/TemplateOptions/FooterCellTemplate';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 7);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumns().slice(0, 4);
    protected _footerCfg: unknown[] = [];

    protected _beforeMount(): void {
        this._columns.forEach((c, index) => {
            this._footerCfg.push({
                template: 'wml!Controls-demo/gridNew/Footer/TemplateOptions/FooterCellTemplate',
                templateOptions: {
                    myVar: index,
                },
            });
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FooterTemplateOptions: {
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
