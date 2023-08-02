import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/StickyCallback/Default';
import { Memory } from 'Types/source';
import { IHeader } from 'Controls-demo/types';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeader[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _ladderProperties: string[] = ['ladder'];

    protected _beforeMount(): void {
        this._header.push({ title: 'Лесенка' });
        this._columns.push({ width: '50px', displayProperty: 'ladder' });
    }

    protected _stickyCallback(item: Model): string | undefined {
        const country = item.get('country');
        return country === 'Китай' || country === 'Казахстан' ? 'topBottom' : undefined;
    }

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
