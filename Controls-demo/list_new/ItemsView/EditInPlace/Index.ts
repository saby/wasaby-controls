import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { RecordSet } from 'Types/collection';
import { Control, TemplateFunction } from 'UI/Base';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';
import * as Template from 'wml!Controls-demo/list_new/ItemsView/EditInPlace/Index';
import {
    IItemAddOptions,
    IItemEditOptions,
    TBeforeBeginEditEventResult,
} from 'Controls/list';

/**
 * Демо пример показывает как реализовать редактирование по месту в плоском списке
 * работающем без использования источника данных.
 *
 * Для возможности добавления записей обязательным условием является наличие обработчика
 * события beforeBeginEdit, который должен создать и вернуть инстанс добавляемой записи.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    // Список отображаемых записей
    protected _items: RecordSet;

    // Стартовая id для генерации новых записей
    private _fakeId: number = 100;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'key',
            rawData: getData(),
        });
    }

    protected _beforeBeginEdit(
        e: SyntheticEvent,
        options: IItemAddOptions | IItemEditOptions,
        isAdd: Boolean
    ): TBeforeBeginEditEventResult {
        if (!isAdd) {
            return;
        }

        return {
            item: new Model({
                keyProperty: 'key',
                rawData: {
                    key: ++this._fakeId,
                    title: '',
                    description: '',
                    byDemand: '',
                    tplPath: '',
                    cursor: 'default',
                    checkbox: false,
                    hovered: false,
                    value: '',
                },
            }),
        };
    }
}
