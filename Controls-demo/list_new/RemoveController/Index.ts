import { Control, TemplateFunction } from 'UI/Base';
import { Model } from 'Types/entity';
import { IoC } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import * as cClone from 'Core/core-clone';

import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { ISelectionObject } from 'Controls/interface';
import { IRemovableList } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { default as Memory } from './RemoveDemoSource';
import * as template from 'wml!Controls-demo/list_new/RemoveController/RemoveController';

import 'css!Controls-demo/list_new/RemoveController/RemoveController';

function getData(): { key: number; title: string }[] {
    return cClone([
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
    ]);
}

export default class RemoveControllerDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _itemActions: IItemAction[];
    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];
    protected _currentMessage: string;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markedKey: 1,
                    selectedKeys: [],
                    excludedKeys: [],
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }

    protected _beforeMount(
        options?: {},
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        const removeItemsOnDeleteKeyDown = this._removeItemsOnDeleteKeyDown.bind(this);
        const removeItemOnActionClick = this._removeItemOnActionClick.bind(this);

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
    }

    protected _itemActionsVisibilityCallback(action: IItemAction, item: Model): boolean {
        return action.id !== 'delete';
    }

    protected _removeOnButtonClick(): void {
        const selection = {
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        };
        const list: IRemovableList = this._children.list as undefined as IRemovableList;
        list.removeItemsWithConfirmation(selection, 'Controls/viewCommands:Reload')
            .then(() => {
                this._currentMessage = 'Удалили записи с id ' + selection.selected.join(', ');
            })
            .catch((error) => {
                this._currentMessage = 'Нажата кнопка "Удалить выбранные". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }

    protected _onSelectedKeysChanged(event: SyntheticEvent, keys: []): void {
        this._selectedKeys = keys;
    }

    protected _onExcludedKeysChanged(event: SyntheticEvent, keys: []): void {
        this._excludedKeys = keys;
    }

    private _removeItemsOnDeleteKeyDown(item: Model): void {
        const selection = {
            selected:
                this._selectedKeys && this._selectedKeys.length
                    ? this._selectedKeys
                    : [item.getKey()],
            excluded: this._excludedKeys,
        };
        const list: IRemovableList = this._children.list as undefined as IRemovableList;
        const method: (selection: ISelectionObject) => Promise<void> =
            this._selectedKeys.length || (selection.selected[0] && selection.selected[0] === 5)
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
                this._currentMessage = 'Нажата клавиша "delete". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }

    private _removeItemOnActionClick(item: Model): void {
        const selection: ISelectionObject = {
            selected: [item.getKey()],
            excluded: [],
        };
        const list: IRemovableList = this._children.list as undefined as IRemovableList;
        const method: (
            selection: ISelectionObject,
            viewCommandName?: string
        ) => Promise<void | string> =
            selection.selected[0] && selection.selected[0] === 5
                ? list.removeItemsWithConfirmation.bind(this._children.list)
                : list.removeItems.bind(this._children.list);
        method(selection)
            .then((result) => {
                if (result) {
                    this._currentMessage =
                        'Кликнули по операции "delete". Удалили запись(и) с id ' +
                        selection.selected.join(', ');
                }
            })
            .catch((error) => {
                this._currentMessage = 'Кликнули по операции "delete". Произошла ошибка';
                IoC.resolve('ILogger').error(error);
            });
    }
}
