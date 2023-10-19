import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UI/Vdom';
import { View } from 'Controls/treeGrid';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import * as Template from 'wml!Controls-demo/treeGridNew/ReloadItem/Index';
import { default as Source, getData } from 'Controls-demo/treeGridNew/ReloadItem/Source';
import { IItemAction } from 'Controls/interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

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
class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _children: {
        grid: View;
    };
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
        {
            displayProperty: 'count',
        },
    ];
    // eslint-disable-next-line no-magic-numbers
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

    _onActionClick(event: SyntheticEvent, action: IItemAction, item: Model): void {
        this._options._dataOptionsValue.ReloadItem.source.setNeedUpdateDate();
        this._children.grid.reloadItem(item.getKey(), {
            hierarchyReload: this._hierarchyReload,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ReloadItem: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Source({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    expandedItems: [1, 11],
                },
            },
        };
    },
});
