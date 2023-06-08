import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';

import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/searchBreadcrumbsGrid/BackgroundStyle/BaackgroundStyle';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: unknown[];
    protected _header: object[] = [
        {
            title: 'Наименование',
        },
        {
            title: 'Код',
        },
        {
            title: 'Цена',
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: Gadgets.getSearchData(true),
        });

        this._columns = Gadgets.getSearchColumns();
    }
}
