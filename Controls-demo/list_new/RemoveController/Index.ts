import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';
import { IoC } from 'Env/Env';
import * as cClone from 'Core/core-clone';

import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { ISelectionObject } from 'Controls/interface';
import { IRemovableList } from 'Controls/list';

import { RemoveDemoSource } from './RemoveDemoSource';
import * as template from 'wml!Controls-demo/list_new/RemoveController/RemoveController';

import 'css!Controls-demo/list_new/RemoveController/RemoveController';

const data: { key: number; title: string }[] = [
    {
        key: 0,
        title: 'Стандартное удаление записи',
    },
    {
        key: 1,
        title: 'Стандартное удаление записи',
    },
    {
        key: 2,
        title: 'Стандартное удаление записи',
    },
    {
        key: 3,
        title: 'Стандартное удаление записи',
    },
    {
        key: 4,
        title: 'Стандартное удаление записи',
    },
    {
        key: 5,
        title: 'Удаление записи с вопросом',
    },
    {
        key: 6,
        title: 'Удаление записи с ошибкой',
    },
    {
        key: 7,
        title: 'Долгое удаление записи',
    },
    {
        key: 8,
        title: 'Удаление последней записи',
    },
];

export default class RemoveControllerDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _viewSource: RemoveDemoSource;
    protected _itemActions: IItemAction[];
    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];
    protected _markedKey: CrudEntityKey;
    protected _currentMessage: string;

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new RemoveDemoSource({
            keyProperty: 'key',
            data: cClone(data),
        });
        const removeItemsOnDeleteKeyDown =
            this._removeItemsOnDeleteKeyDown.bind(this);
        const removeItemOnActionClick =
            this._removeItemOnActionClick.bind(this);

        this._itemActions = [
            {
                id: 'delete',
                handler: removeItemsOnDeleteKeyDown,
            },
            {
                id: 'deleteAction',
                icon: 'icon-Erase',
                iconStyle: 'danger',
                showType: TItemActionShowType.TOOLBAR,
                handler: removeItemOnActionClick,
            },
        ];

        this._markedKey = 1;
    }

    protected _itemActionsVisibilityCallback(
        action: IItemAction,
        item: Model
    ): boolean {
        return action.id !== 'delete';
    }

    private _removeItemsOnDeleteKeyDown(item: Model): void {
        const selection = {
            selected:
                this._selectedKeys && this._selectedKeys.length
                    ? this._selectedKeys
                    : [item.getKey()],
            excluded: this._excludedKeys,
        };
        const list: IRemovableList = this._children
            .list as undefined as IRemovableList;
        const method: (selection: ISelectionObject) => Promise<void> =
            this._selectedKeys.length ||
            (selection.selected[0] && selection.selected[0] === 5)
                ? list.removeItemsWithConfirmation.bind(this._children.list)
                : list.removeItems.bind(this._children.list);

        method(selection)
            .then(() => {
                this._children.list.reload();
                this._currentMessage =
                    'Нажата клавиша "delete". Удалили запись(и) с id ' +
                    selection.selected.join(', ');
            })
            .catch((error) => {
                this._currentMessage =
                    'Нажата клавиша "delete". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }

    private _removeItemOnActionClick(item: Model): void {
        const selection: ISelectionObject = {
            selected: [item.getKey()],
            excluded: [],
        };
        const list: IRemovableList = this._children
            .list as undefined as IRemovableList;
        const method: (
            selection: ISelectionObject,
            viewCommandName: string
        ) => Promise<void | string> =
            selection.selected[0] && selection.selected[0] === 5
                ? list.removeItemsWithConfirmation.bind(this._children.list)
                : list.removeItems.bind(this._children.list);
        method(selection, null)
            .then((result) => {
                if (result) {
                    this._children.list.reload();
                    this._currentMessage =
                        'Кликнули по операции "delete". Удалили запись(и) с id ' +
                        selection.selected.join(', ');
                }
            })
            .catch((error) => {
                this._currentMessage =
                    'Кликнули по операции "delete". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }

    protected _removeOnButtonClick(): void {
        const selection = {
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        };
        const list: IRemovableList = this._children
            .list as undefined as IRemovableList;
        list.removeItemsWithConfirmation(
            selection,
            'Controls/viewCommands:Reload'
        )
            .then(() => {
                this._currentMessage =
                    'Удалили записи с id ' + selection.selected.join(', ');
            })
            .catch((error) => {
                this._currentMessage =
                    'Нажата кнопка "Удалить выбранные". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }
}
