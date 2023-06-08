import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/Toolbar/Toolbar';
import * as editingCellNumber from 'wml!Controls-demo/gridNew/EditInPlace/Toolbar/editingCellNumber';
import * as editingCellText from 'wml!Controls-demo/gridNew/EditInPlace/Toolbar/editingCellText';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { showType } from 'Controls/toolbars';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _viewSource: Memory;
    protected _fakeItemId: number;
    protected _columns: IColumn[];
    protected _itemActions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-Erase icon-error',
            title: 'Удалить',
            style: 'bordered',
            showType: showType.MENU_TOOLBAR,
            handler: this._removeItem.bind(this),
        },
        {
            id: 2,
            icon: 'icon-Phone icon-success',
            title: 'Позвонить',
            style: 'bordered',
            showType: showType.MENU_TOOLBAR,
        },
    ];

    protected _beforeMount(): void {
        this._columns = Countries.getColumnsWithFixedWidths().map(
            (column, index) => {
                const resultColumn = column;
                // eslint-disable-next-line
                if (index !== 0) {
                    // eslint-disable-next-line
                    resultColumn.template =
                        index < 3 ? editingCellText : editingCellNumber;
                }
                return resultColumn;
            }
        );
        // eslint-disable-next-line
        const data = Countries.getData().slice(0, 5);
        this._fakeItemId = data[data.length - 1].id;
        this._viewSource = new Memory({ keyProperty: 'key', data });
    }

    _beforeBeginEdit(
        e: SyntheticEvent<null>,
        options: { item: Model },
        isAdd: boolean
    ): { item: Model } | void {
        if (isAdd) {
            const key = ++this._fakeItemId;
            return {
                item: new Model({
                    keyProperty: 'key',
                    rawData: {
                        key,
                        number: key + 1,
                        country: null,
                        capital: null,
                        population: null,
                        square: null,
                        populationDensity: null,
                    },
                }),
            };
        }
    }

    private _beginAdd(): void {
        this._children.grid.beginAdd();
    }

    private _removeItem(item: Model): void {
        this._viewSource.destroy([item.getKey()]).then(() => {
            this._children.grid.reload();
        });
    }
}
