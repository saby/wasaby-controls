import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ConnectedByBrowser/Index';
import { IFilterItem } from 'Controls/filter';
import { HierarchicalMemory } from 'Types/source';
import { getFlatList } from 'Controls-demo/ConnectedByBrowser/Data';
import { TKey } from 'Controls/interface';
import * as filter from 'Controls-demo/ConnectedByBrowser/DataFilter';
import panelSource from './listActions';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Memory } from 'Types/source';
import { showType } from 'Controls/toolbars';
import './MultiSelect';
import 'css!Controls-demo/ConnectedByBrowser/Index';

const COUNT_ITEMS = 5;

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

    protected _itemClick(event: Event, item: Model): void {
        const itemId = item.get('id');
        if (itemId !== 'viewMode') {
            this._viewMode = itemId;
        }
    }

    protected _beforeMount(): void | Promise<void> {
        this._listSource = new HierarchicalMemory({
            keyProperty: 'id',
            data: getFlatList(['США', 'Южная Корея', 'Тайвань'], COUNT_ITEMS),
            parentProperty: 'parent',
            filter,
        });

        this._filterSource = [
            {
                name: 'inStock',
                value: null,
                resetValue: null,
                textValue: '',
                viewMode: 'extended',
                editorTemplateName: 'Controls/filterPanel:BooleanEditor',
                editorOptions: {
                    filterValue: true,
                    extendedCaption: 'В наличии',
                },
            },
        ];
    }

    protected _expandedChangedHandler(): void {
        this._expandedOperationsPanel = !this._expandedOperationsPanel;
    }
}
