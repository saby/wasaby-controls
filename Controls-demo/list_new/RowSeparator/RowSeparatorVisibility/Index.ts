import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/list_new/RowSeparator/RowSeparatorVisibility/RowSeparatorVisibility';

export default class extends Control {
    static _styles: string[] = ['DemoStand/Controls-demo'];
    protected _template: TemplateFunction = Template;
    protected _rowSeparatorVisibility: string;

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

    protected _setRowSeparatorVisibility(e: SyntheticEvent, value: string): void {
        this._rowSeparatorVisibility = value;
    }
}
