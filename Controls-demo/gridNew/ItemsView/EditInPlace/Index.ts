import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { RecordSet } from 'Types/collection';
import { Control, TemplateFunction } from 'UI/Base';
import {
    IColumn,
    IItemAddOptions,
    IItemEditOptions,
    TBeforeBeginEditEventResult,
} from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import * as Template from 'wml!Controls-demo/gridNew/ItemsView/EditInPlace/Index';
import * as editingCellText from 'wml!Controls-demo/gridNew/ItemsView/EditInPlace/editingCellText';
import * as editingCellNumber from 'wml!Controls-demo/gridNew/ItemsView/EditInPlace/editingCellNumber';

/**
 * Демо пример показывает как реализовать редактирование по месту в таблице
 * работающей без использования источника данных.
 *
 * Для возможности добавления записей обязательным условием является наличие обработчика
 * события beforeBeginEdit, который должен создать и вернуть инстанс добавляемой записи.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _columns: IColumn[];

    // Список отображаемых записей
    protected _items: RecordSet;

    // Стартовая id для генерации новых записей
    private _fakeId: number = 100;

    protected _beforeMount(): void {
        this._columns = Countries.getColumnsWithFixedWidths().map(
            (column, index) => {
                if (index === 0) {
                    return column;
                }

                // eslint-disable-next-line no-magic-numbers
                column.template =
                    index < 3 ? editingCellText : editingCellNumber;
                return column;
            }
        );

        this._items = new RecordSet({
            keyProperty: 'key',
            // eslint-disable-next-line no-magic-numbers
            rawData: Countries.getData().slice(0, 5),
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
                    number: this._items.getCount() + 1,
                    country: '',
                    capital: '',
                    population: 0,
                    square: 0,
                    populationDensity: 0,
                },
            }),
        };
    }
}
