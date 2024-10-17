import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/WithEditing/WithEditing';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/ColumnScroll/WithEditing/_cellEditor';
import { IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: unknown = Countries.getColumnsWithWidths().map((cur, i) => {
        if (i > 1) {
            return {
                ...cur,
                template: 'wml!Controls-demo/gridNew/ColumnScroll/WithEditing/_cellEditor',
            };
        }
        return cur;
    });

    protected _header: IHeaderCell[] = Countries.getHeader();

    protected _beforeMount(): void {
        this._columns[2].width = '100px';
        this._columns[3].width = '100px';
        this._columns[4].width = '100px';
        this._columns[5].width = '200px';
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollWithEditing: {
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
