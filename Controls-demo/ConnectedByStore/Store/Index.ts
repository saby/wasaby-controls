import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ConnectedByStore/Store/Index';
import { IFilterItem } from 'Controls/filter';
import { HierarchicalMemory } from 'Types/source';
import { TKey } from 'Controls/interface';
import panelSource from 'Controls-demo/ConnectedByBrowser/listActions';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { RecordSet } from 'Types/collection';
import Store from 'Controls/Store';
import 'Controls-demo/ConnectedByBrowser/MultiSelect';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import { IContextOptionsValue } from 'Controls/context';
import 'css!Controls-demo/ConnectedByBrowser/Index';

interface IOptions extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _listSource: HierarchicalMemory = null;
    protected _filterSource: IFilterItem[] = null;
    protected _panelSource: Memory = new Memory({
        data: panelSource,
        keyProperty: 'id',
    });
    protected _root: TKey = null;
    protected _viewMode: string = 'table';
    protected _callbackViewMode: string = null;
    protected _callbackOperationsButton: string = null;
    protected _prefetchResult: unknown = null;
    protected _toolbarItems: RecordSet = new RecordSet({
        rawData: [
            {
                id: 'viewMode',
                showType: showType.TOOLBAR,
                icon: 'icon-ArrangeList',
                '@parent': true,
                parent: null,
            },
            {
                id: 'table',
                title: 'Список',
                icon: 'icon-ArrangeList',
                '@parent': false,
                parent: 'viewMode',
                showType: showType.TOOLBAR,
            },
            {
                id: 'tile',
                title: 'Плитка',
                icon: 'icon-ArrangePreview',
                '@parent': false,
                parent: 'viewMode',
                showType: showType.TOOLBAR,
            },
            {
                id: 'search',
                title: 'Поиск',
                icon: 'icon-ArrangePreview',
                '@parent': false,
                parent: 'viewMode',
                showType: showType.TOOLBAR,
            },
        ],
        keyProperty: 'id',
    });
    protected _nomenclatureHeader: IHeaderCell[] = [
        { caption: 'Название' },
        { caption: 'Страна' },
        { caption: 'Наличие' },
    ];
    protected _columns: IColumn[] = [
        { displayProperty: 'title', width: '300px' },
        { displayProperty: 'country', width: '' },
        { displayProperty: 'available', width: '' },
    ];
    protected _expandedOperationsPanel: boolean = false;

    protected _beforeMount(options: IOptions): void {
        this._prefetchResult =
            options._dataOptionsValue.prefetchData.nomenclature;
    }

    protected _afterMount(): void {
        this._callbackViewMode = Store.onPropertyChanged(
            'viewMode',
            (value: string) => {
                this._viewMode = value;
            }
        );

        this._callbackOperationsButton = Store.onPropertyChanged(
            'operationsPanelExpanded',
            (value: boolean) => {
                this._expandedOperationsPanel = value;
            }
        );
    }

    protected _itemClick(event: Event, item: Model): void {
        const itemId = item.get('id');
        if (itemId !== 'viewMode') {
            Store.dispatch('viewMode', itemId);
        }
    }

    protected _beforeUnmount(): void {
        Store.unsubscribe(this._callbackViewMode);
        Store.unsubscribe(this._callbackOperationsButton);
    }
}
