import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { CrudEntityKey, Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import { IItemAction } from 'Controls/interface';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';

import * as template from 'wml!Controls-demo/Browser/Remove/Template';

const data = [
    {
        key: '0',
        title: 'Удаляется при помощи действия в operationsPanel',
        itemActions: [],
    },
    {
        key: '1',
        title: 'Удаляется при помощи действия в itemActions',
        itemActions: [
            {
                id: 'delete',
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'Удалить',
            },
        ],
    },
];

const listActions = [
    {
        id: 'remove',
        '@parent': false,
        icon: 'icon-Erase',
        title: 'Удаление',
        iconStyle: 'danger',
        actionName: 'Controls/actions:Remove',
        actionOptions: {
            name: 'Удалить',
        },
        parent: null,
        showType: showType.MENU_TOOLBAR,
    },
];

export default class Demo extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: CrudEntityKey[] = [];
    protected _listSource: Memory = new Memory({
        keyProperty: 'key',
        data,
    });
    protected _panelSource: Memory = new Memory({
        data: listActions,
        keyProperty: 'id',
    });
    protected _expandedOperationsPanel: boolean = false;

    protected _onPanelItemClick(
        event: SyntheticEvent,
        item: Model,
        nativeEvent: Event,
        selection: object
    ): void {
        if (item.getKey() === 'remove') {
            this._children.list
                .removeItemsWithConfirmation(selection, {
                    target: nativeEvent.target,
                })
                .then(() => {
                    this._selectedKeys = [];
                });
        }
    }

    protected _onActionClick(
        e: unknown,
        action: IItemAction,
        item: Model,
        container: HTMLDivElement,
        nativeEvent: MouseEvent
    ): void {
        if (action.id === 'delete') {
            this._children.list.removeItemsWithConfirmation(
                { selected: [item.getKey()], excluded: [] },
                {
                    target: nativeEvent.target,
                }
            );
        }
    }

    protected _selectedKeysChanged(e: unknown, keys: CrudEntityKey[]): void {
        if (keys !== this._selectedKeys && (this._selectedKeys.length === 0 || keys.length === 0)) {
            this._expandedOperationsPanel = true;
        }
        this._selectedKeys = keys;
    }
}
