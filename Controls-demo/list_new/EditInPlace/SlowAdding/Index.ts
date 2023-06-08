import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/SlowAdding/SlowAdding';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { editing } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import SlowMemory from './SlowMemory';

function getData() {
    return [
        {
            key: 1,
            beforeBeginEditTitle:
                'Записи не редактируются, только добавление. Добавление начнется с задержкой. ' +
                'Например, долгая валидация на сервере(3 секунды), появится индикатор. При этом редактированию, не был возвращен Promise.',
        },
    ];
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new SlowMemory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _beforeBeginEdit(
        e: SyntheticEvent<null>,
        { item }: { item: Model },
        isAdd: boolean
    ): string | undefined {
        if (!isAdd) {
            return editing.CANCEL;
        }
    }

    protected _addItem(): void {
        this._children.list.beginAdd();
    }
}
