import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { View } from 'Controls/treeGrid';
import { TKey } from 'Controls/_interface/IItems';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/_grid/display/interface/IColumn';
import * as Template from 'wml!Controls-demo/treeGridNew/ReloadItem/Index';
import { getData, Source } from 'Controls-demo/treeGridNew/ReloadItem/Source';
import { IItemAction } from 'Controls/interface';

/**
 * Демо пример демонстрирует функционал обновления записи в дереве.
 * У каждой записи есть действие при клике на которое для этой записи вызывается метод reloadItem.
 *
 * Если включено иерархическое обновление, то при клике по иконке обновления записи счетчик обновлений инкрементится
 * у все родительских узлов и их дочерних элементов + так же будет инкриминирован счетчик у всех дочерних элементов,
 * кроме элементов, находящихся в схлопнутых узлах. Так же будут пересчитаны и обновлены итоги.
 *
 * Если иерархическое обновление выключено, то счетчик обновлений будет обновлен только у самой записи и итоги в этом
 * случае не пересчитываются и не обновляются.
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _children: {
        grid: View;
    };
    protected _viewSource: Source;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
        {
            displayProperty: 'count',
        },
    ];
    // eslint-disable-next-line no-magic-numbers
    protected _expandedItems: TKey[] = [1, 11];
    protected _itemActions: object[] = [
        {
            id: 'message',
            icon: 'icon-Refresh',
            showType: 2,
            iconStyle: 'secondary',
            tooltip: 'Обновить',
        },
    ];
    protected _hierarchyReload: boolean = true;

    protected _beforeMount(): void {
        this._viewSource = new Source({
            data: getData(),
            keyProperty: 'id',
            parentProperty: 'parent',
            filter: (): boolean => {
                return true;
            },
        });
    }

    _onActionClick(
        event: SyntheticEvent,
        action: IItemAction,
        item: Model
    ): void {
        this._viewSource.setNeedUpdateDate();
        this._children.grid.reloadItem(item.getKey(), {
            hierarchyReload: this._hierarchyReload,
        });
    }
}
