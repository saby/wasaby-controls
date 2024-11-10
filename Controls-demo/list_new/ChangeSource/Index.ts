import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { TKey } from 'Controls/interface';
import { IItemAction } from 'Controls/itemActions';
import {
    getContactsCatalogWithActions,
    getFewCategories as getData,
} from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

import { getActionsWithSVG as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

import * as controlTemplate from 'wml!Controls-demo/list_new/ChangeSource/ChangeSource';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

/**
 * Демка для тестирования случая, когда меняют source + itemActions + ItemActionsProperty.
 * Не должно быть ошибок в консоли.
 */
class Demo extends Control<IProps> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: TKey[] = [];
    protected _excludedKeys: TKey[] = [];
    protected _itemActionsProperty: string;
    protected _itemActions: IItemAction[] = getItemActions();

    _toggleEnableActionProperty(): void {
        this._itemActionsProperty =
            this._itemActionsProperty === undefined ? 'itemActions' : undefined;
        this._itemActions = this._itemActionsProperty === undefined ? getItemActions() : undefined;
        if (this._itemActionsProperty === undefined) {
            this._options._dataOptionsValue.ChangeSource.setState({
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            });
        } else {
            this._options._dataOptionsValue.ChangeSource.setState({
                source: new Memory({
                    keyProperty: 'key',
                    data: getContactsCatalogWithActions(),
                }),
            });
        }
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ChangeSource: {
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
    },
});
