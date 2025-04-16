import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/list_new/ColumnsView/Group/Index';
import { Memory } from 'Types/source';
import { View } from 'Controls/columns';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 1,
            title: 'MacBook Pro',
            brand: 'apple',
            longBrandName: 'apple',
        },
        {
            key: 2,
            title: 'Apple iPad Pro 2016',
            brand: 'apple',
            longBrandName: 'apple',
        },
        {
            key: 3,
            title: 'iPhone X Max',
            brand: 'apple',
            longBrandName: 'apple',
        },
        {
            key: 4,
            title: 'ASUS X751SA-TY124D',
            brand: 'asus',
            longBrandName: 'asus',
        },
        {
            key: 5,
            title: 'ASUS X541SA-XO056D',
            brand: 'asus',
            longBrandName: 'asus',
        },
        {
            key: 6,
            title: 'ASUS Zenbook F-234',
            brand: 'asus',
            longBrandName:
                'AsusTek Computer Inc. stylised as ASUSTeK' +
                ' (Public TWSE: 2357 LSE: ASKD), based in Beitou District, Taipei, Taiwan',
        },
        {
            key: 7,
            title: 'ACER One 10 S1002-15GT',
            brand: 'acer',
            longBrandName: 'acer',
        },
        {
            key: 8,
            title: 'ACER Aspire F 15 F5-573G-51Q7',
            brand: 'acer',
            longBrandName: 'acer',
        },
        {
            key: 9,
            title: 'HP 250 G5 (W4N28EA)',
            brand: 'hp',
            longBrandName: 'hp',
        },
    ];
}

export default class Index extends Control {
    protected _template: TemplateFunction = template;
    protected _children: {
        columnsView: View;
    };
    protected _itemActions: object[];
    private _lastKey: number = 9;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsViewGroup: {
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

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'delete',
                showType: 2,
                handler: this.deleteHandler.bind(this),
            },
        ];
    }

    protected _add(e: SyntheticEvent, brand: string): void {
        const items = this._children.columnsView.getItems();

        this._lastKey += 1;
        const newData = new Model({
            keyProperty: 'key',
            rawData: {
                key: this._lastKey,
                title: `${brand} ${this._lastKey}`,
                brand,
                longBrandName: 'apple',
            },
        });

        items.add(newData);
    }

    private deleteHandler(item: Model): void {
        this._children.columnsView.getItems().remove(item);
    }
}
