import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/VerticalAlign/VerticalAlign';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Header/Multiheader/VerticalAlign/VerticalAlignHeaderCell';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { MultiHeader } from 'Controls-demo/gridNew/DemoHelpers/Data/MultiHeader';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _header: IHeaderCell[] = MultiHeader.getHeader3();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().slice(1);

    protected _beforeMount(): void {
        // eslint-disable-next-line
        this._header[0].template =
            'wml!Controls-demo/gridNew/Header/Multiheader/VerticalAlign/VerticalAlignHeaderCell';
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
