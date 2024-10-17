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
            methodName: 'removeItemsWithConfirmation',
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

const DEL_BUTTON_OK = 'Нажата клавиша "delete". Удалили запись(и) с id {0}';
const DEL_BUTTON_ERROR = 'Нажата клавиша "delete". Произошла ошибка';
const BULK_OK = 'Удалили записи с id {0}';
const BULK_ERROR = 'Нажата кнопка "Удалить выбранные". Произошла ошибка';
const SINGLE_OK = 'Кликнули по операции "delete". Удалили запись(и) с id {0}';
const SINGLE_ERROR = 'Кликнули по операции "delete". Произошла ошибка';

interface IHandleActionsParams {
    selection: ISelectionObject;
    methodName: string;
    target: HTMLElement;
    okMsg: string;
    errMsg: string;
    viewCommandName?: string;
}

export default class RemoveControllerDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _itemActions: IItemAction[];
    protected _selectedKeys: number[] = [];
    protected _excludedKeys: number[] = [];
    protected _currentMessage: string;

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

    protected _onSelectedKeysChanged(event: SyntheticEvent, keys: []): void {
        this._selectedKeys = keys;
    }

    protected _onExcludedKeysChanged(event: SyntheticEvent, keys: []): void {
        this._excludedKeys = keys;
    }

    protected _removeOnButtonClick(e: SyntheticEvent): void {
        const selection = {
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        };
        const methodName = 'removeItemsWithConfirmation';
        this._handleAction({
            selection,
            methodName,
            target: e.nativeEvent.target as HTMLElement,
            okMsg: BULK_OK,
            errMsg: BULK_ERROR,
            viewCommandName: 'Controls/viewCommands:Reload',
        });
    }

    private _removeItemsOnDeleteKeyDown(
        item: Model,
        itemContainer: HTMLDivElement,
        nativeEvent: MouseEvent
    ): void {
        const selection = {
            selected:
                this._selectedKeys && this._selectedKeys.length
                    ? this._selectedKeys
                    : [item.getKey()],
            excluded: this._excludedKeys,
        };
        const methodName =
            selection.selected.length > 1 ? 'removeItemsWithConfirmation' : item.get('methodName');
        this._handleAction({
            selection,
            methodName,
            target: nativeEvent.target,
            okMsg: DEL_BUTTON_OK,
            errMsg: DEL_BUTTON_ERROR,
            viewCommandName: 'Controls/viewCommands:Reload',
        });
    }

    private _removeItemOnActionClick(
        item: Model,
        itemContainer: HTMLDivElement,
        nativeEvent: MouseEvent
    ): void {
        const selection: ISelectionObject = {
            selected: [item.getKey()],
            excluded: [],
        };
        const methodName = item.get('methodName');
        this._handleAction({
            selection,
            methodName,
            target: nativeEvent.target,
            okMsg: SINGLE_OK,
            errMsg: SINGLE_ERROR,
        });
    }

    private _handleAction({
        selection,
        methodName = 'removeItems',
        target,
        okMsg,
        errMsg,
        viewCommandName,
    }: IHandleActionsParams) {
        const list: IRemovableList = this._children.list as unknown as IRemovableList;
        const method: (
            selection: ISelectionObject,
            config: object | string | undefined
        ) => Promise<void> = list[methodName].bind(list);
        const config =
            methodName === 'removeItems'
                ? viewCommandName
                : {
                      target,
                      viewCommandName,
                  };
        method(selection, config)
            .then(() => {
                this._currentMessage = okMsg.replace(/\{0\}/, selection.selected.join(', '));
            })
            .catch((error) => {
                this._currentMessage = errMsg;
                IoC.resolve('ILogger').error(error);
            });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RemoveController: {
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
}
