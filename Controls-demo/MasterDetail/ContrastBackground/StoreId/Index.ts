import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/MasterDetail/ContrastBackground/StoreId/Index';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';

interface IOptions extends IControlOptions {
    _dataOptionsValue: unknown;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _prefetchDataDetail: unknown = null;
    protected _prefetchResultMaster: unknown = null;
    protected _prefetchResultDetail: unknown = null;
    protected _gridColumns: object[] = [
        {
            displayProperty: 'name',
            width: '70%',
        },
        {
            displayProperty: 'count',
            width: '30%',
        },
    ];

    protected _beforeMount(options: IOptions): void {
        this._prefetchResultDetail = options._dataOptionsValue.detail;
    }

    protected _itemClickHandler(event: SyntheticEvent<MouseEvent>, item: Model): void {
        const itemName = item.get('name');
        if (itemName) {
            this._prefetchResultDetail.setFilter({ name: itemName });
        }
    }

    static _styles: string[] = ['DemoStand/Controls-demo', 'Controls-demo/MasterDetail/Demo'];
}
