import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import controlTemplate = require('wml!Controls-TabsLayout-demo/colored/GridView/ColoredTabTmpl/ColoredTab');

interface IColoredTabOptions extends IControlOptions {
    itemsReadyCallback: Function;
    selectedKeys: string[];
    excludedKeys: string[];
    tabName: string;
}

export default class ContainerBaseDemo extends Control<IColoredTabOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _selectedKeys: string[];
    protected _excludedKeys: string[];
    protected _items: RecordSet;

    protected _beforeMount(options: IColoredTabOptions): void {
        this._selectedKeys = options.selectedKeys || [];
        this._excludedKeys = options.excludedKeys || [];
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _selectedKeysChangedHandler(
        event: SyntheticEvent<Event>,
        values: string[],
        added: string[],
        deleted: string[]
    ): void {
        // eslint-disable-line
        event.stopPropagation();
        this._selectedKeys = values;
        this._notify('selectedKeysTabChanged', [values, added, deleted, this._options.tabName], {
            bubbling: true,
        });
    }

    protected _excludedKeysChangedHandler(
        event: SyntheticEvent<Event>,
        values: string[],
        added: string[],
        deleted: string[]
    ): void {
        // eslint-disable-line
        event.stopPropagation();
        this._excludedKeys = values;
        this._notify('excludedKeysTabChanged', [values, added, deleted, this._options.tabName], {
            bubbling: true,
        });
    }

    /**
     *
     * @param event
     * @param count
     * @param selectedAll
     * @private
     */
    protected _listSelectedKeysCountChangedHandler(
        event: SyntheticEvent<Event>,
        count: number | null,
        selectedAll: boolean
    ): void {
        // eslint-disable-line
        event.stopPropagation();
        this._notify(
            'listSelectedKeysCountTabChanged',
            [count, selectedAll, this._options.tabName],
            { bubbling: true }
        );
    }

    protected _itemClickHandler(event: SyntheticEvent, item: Model): void {
        event.stopPropagation();
        this._notify('itemClick', [item], { bubbling: true });
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        if (items && items.getCount()) {
            this._items = items;
            this._options.itemsReadyCallback(items);
        }
    }

    protected _itemActivateHandler(event: SyntheticEvent): void {
        event.stopPropagation();
    }

    static _styles: string[] = [
        'Controls-TabsLayout-demo/colored/GridView/ColoredTabTmpl/ColoredTab',
    ];
}
