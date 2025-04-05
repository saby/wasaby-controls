import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/AddButton/AddButton';
import { Memory } from 'Types/source';
import 'wml!Controls-demo/gridNew/Header/AddButton/FirstHeaderCellTemplate';
import 'wml!Controls-demo/gridNew/Header/AddButton/Cell';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _gridCaption: string = 'Характеристики стран';
    private _header: IHeaderCell[] = Countries.getHeader().slice(1);
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().slice(1);

    protected _beforeMount(): void {
        this._header.forEach((hColumn) => {
            // eslint-disable-next-line
            hColumn.template = 'wml!Controls-demo/gridNew/Header/AddButton/Cell';
        });

        this._header[0] = {
            ...this._header[0],
            // eslint-disable-next-line
            template: 'wml!Controls-demo/gridNew/Header/AddButton/FirstHeaderCellTemplate',
            captionForGrid: this._gridCaption,
        };
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HeaderAddButton: {
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
