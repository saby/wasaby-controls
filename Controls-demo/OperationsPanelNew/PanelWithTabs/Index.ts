import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/OperationsPanelNew/PanelWithTabs/PanelWithTabs';
import 'wml!Controls-demo/OperationsPanelNew/Templates/PersonInfo';
import { Memory, HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { ITabButtonItem } from 'Controls/tabs';
import TreeMemory = require('Controls-demo/List/Tree/TreeMemory');
import {
    getPanelData,
    getListData,
    getTileData,
} from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { Model } from 'Types/entity';
import { Confirmation } from 'Controls/popup';

export default class extends Control {
    protected _template: TemplateFunction = template;
    protected _panelSource: Memory = null;
    protected _viewSource: TreeMemory = null;
    protected _viewSourceDynamic: HierarchicalMemory = null;
    protected _gridColumns: object[] = null;
    protected _selectedKeys: string[] = null;
    protected _excludedKeys: string[] = null;
    protected _selectedTab: string = 'tile';
    protected _expandedOperationsPanel: boolean = true;
    protected _children: {
        popupOpener: Confirmation;
    };
    protected _tabs: RecordSet<ITabButtonItem> = new RecordSet({
        keyProperty: 'key',
        rawData: [
            {
                key: 'tile',
                title: 'Плитка',
            },
            {
                key: 'list',
                title: 'Лист',
            },
        ],
    });

    _beforeMount(): void {
        this._selectedKeys = [];
        this._excludedKeys = [];
        this._panelSource = new Memory({
            keyProperty: 'id',
            data: getPanelData(),
        });
        this._viewSourceDynamic = new HierarchicalMemory({
            keyProperty: 'id',
            parentProperty: 'parent',
            data: getTileData(),
        });
        this._gridColumns = [
            {
                template:
                    'wml!Controls-demo/OperationsPanelNew/Templates/PersonInfo',
            },
        ];
        this._viewSource = new TreeMemory({
            keyProperty: 'id',
            data: getListData(),
        });
    }

    _panelItemClick(
        event: Event,
        item: Model,
        nativeEvent: Event,
        selection: unknown[]
    ): void {
        const itemId = item.get('id');
        if (
            !['sum', 'merge', 'print', 'PDF', 'Excel'].includes(itemId) ||
            this._children.baseAction.validate(selection)
        ) {
            switch (itemId) {
                case 'PDF':
                case 'Excel':
                    this._showPopup('Выгрузка в ' + itemId);
                    break;
                case 'print':
                    this._showPopup('Печать', selection);
                    break;
                case 'plainList':
                    this._showPopup('Развернуть без подразделений');
                    break;
                case 'sum':
                    this._showPopup('Суммирование');
                    break;
                case 'merge':
                    this._showPopup('Объединение');
                    break;
            }
        }
    }

    _showPopup(text: string, selection?: unknown[]): void {
        const selectedRecord =
            !this._selectedKeys.length && selection
                ? getListData().find((item) => {
                      return item.id === selection.selected[0];
                  })
                : '';

        this._children.popupOpener.open({
            message:
                text + `${selectedRecord ? ` ${selectedRecord.name}` : ''}`,
            type: 'ok',
        });
    }

    protected _expandedChangedHandler(e: Event, expanded: boolean): void {
        this._expandedOperationsPanel = expanded;
    }

    static _styles: string[] = ['Controls-demo/OperationsPanelNew/Index'];
}
