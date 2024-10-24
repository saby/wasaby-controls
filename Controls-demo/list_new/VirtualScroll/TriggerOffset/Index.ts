import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/VirtualScroll/TriggerOffset/Template';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData(): object[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((key) => {
        return {
            key,
            height: ((key % 5) + 1) * 100,
            title: 'Запись с ключом ' + key,
        };
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _itemsState: object[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
        (key) => {
            return {
                rendered: false,
            };
        }
    );

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollTriggerOffset: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    activeElement: 7,
                    navigation: {
                        view: 'infinity',
                    },
                },
            },
        };
    }

    private _itemMount(_: unknown, key: number): void {
        const itemsState = [...this._itemsState];
        itemsState[key].rendered = true;
        this._itemsState = itemsState;
    }

    private _itemUnmount(_: unknown, key: number): void {
        const itemsState = [...this._itemsState];
        itemsState[key].rendered = false;
        this._itemsState = itemsState;
    }
}
