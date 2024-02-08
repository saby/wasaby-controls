import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { EventUtils } from 'UI/Events';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IItemAction, ISelectionObject } from 'Controls/interface';
import { itemActions, listData, panelData } from './Data';
import 'wml!Controls-demo/OperationsPanelNew/Templates/PersonInfo';

import * as template from 'wml!Controls-demo/treeGridNew/MoveController/OperationsPanelBrowser/Template';

import 'css!Controls-demo/OperationsPanelNew/Index';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';

export default class ListWithoutMarker extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _excludedKeys: string[] = [];
    protected _notifyHandler: Function = EventUtils.tmplNotify;
    protected _itemActions: IItemAction[] = itemActions;
    protected _panelSource: Memory = new Memory({
        keyProperty: 'id',
        data: panelData,
    });
    protected _columns: object[] = [
        {
            template: 'wml!Controls-demo/OperationsPanelNew/Templates/PersonInfo',
        },
    ];
    protected _viewSource: ExpandedSource = new ExpandedSource({
        keyProperty: 'key',
        data: listData,
    });

    protected _onActionClick(
        e: SyntheticEvent,
        itemAction: IItemAction,
        item: Model,
        itemContainer: HTMLDivElement,
        nativeEvent: SyntheticEvent
    ): void {
        if (itemAction.id === 'move' || itemAction.id === 'move_menu') {
            this._children.list.moveItemsWithDialog(
                {
                    selected: [item.getKey()],
                    excluded: [],
                },
                {
                    target: nativeEvent.target,
                }
            );
        }
    }

    protected _onPanelItemClick(
        event: SyntheticEvent,
        item: Model,
        nativeEvent: Event,
        selection: object
    ): void {
        const itemId = item.get('id');
        if (itemId === 'move' || itemId === 'move_menu') {
            this._children.list.moveItemsWithDialog(selection, {
                target: nativeEvent.target,
            });
        }
    }
}
