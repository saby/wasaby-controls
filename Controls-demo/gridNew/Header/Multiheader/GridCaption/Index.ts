import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaption';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaptionHeaderCell';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { MultiHeader } from 'Controls-demo/gridNew/DemoHelpers/Data/MultiHeader';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _header: IHeaderCell[] = MultiHeader.getHeader2();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().slice(1);

    protected _beforeMount(): void {
        // eslint-disable-next-line
        this._header[0].template =
            'wml!Controls-demo/gridNew/Header/Multiheader/GridCaption/GridCaptionHeaderCell';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiheaderGridCaption: {
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
