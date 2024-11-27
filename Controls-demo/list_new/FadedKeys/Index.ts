import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/FadedKeys/Template';
import { PreviewTemplate as TileItemTemplate } from 'Controls/tile';
import { ItemTemplate as ListItemTemplate } from 'Controls/list';
import { IColumn, ItemTemplate as GridItemTemplate } from 'Controls/grid';
import { ItemTemplate as TreeGridItemTemplate } from 'Controls/treeGrid';
import { ItemTemplate as ColumnsItemTemplate } from 'Controls/columns';
import * as explorerImages from 'Controls-demo/Explorer/ExplorerImagesLayout';
import { CrudEntityKey, Memory } from 'Types/source';
import { IItemAction } from 'Controls/interface';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return [
        {
            key: 1,
            'parent@': null,
            title: 'Файл 1. Проверяем работу механизма fadedKeys.',
            image: explorerImages[4],
            author: 'Алексей',
        },
        {
            key: 2,
            'parent@': null,
            title: 'Файл 2. Проверяем работу механизма fadedKeys.',
            image: explorerImages[4],
            author: 'Борис',
        },
        {
            key: 3,
            'parent@': null,
            title: 'Файл 3. Проверяем работу механизма fadedKeys.',
            image: explorerImages[4],
            author: 'Вадим',
        },
    ];
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _viewNameSource: Memory;
    protected _tileTemplate: TemplateFunction = TileItemTemplate;
    protected _listTemplate: TemplateFunction = ListItemTemplate;
    protected _gridTemplate: TemplateFunction = GridItemTemplate;
    protected _treeGridTemplate: TemplateFunction = TreeGridItemTemplate;
    protected _columnsTemplate: TemplateFunction = ColumnsItemTemplate;
    protected _itemTemplate: Function = ListItemTemplate;
    protected _viewName: string = 'Controls/list:View';
    protected _viewMode: 'list' | 'table' = 'table';
    protected _fadedKeys: CrudEntityKey[] = [2];
    protected _itemActions: IItemAction[];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'key',
            width: '50px',
        },
        {
            displayProperty: 'title',
            width: '1fr',
        },
        {
            displayProperty: 'author',
            width: '1fr',
        },
    ];

    protected _beforeMount(): void {
        this._viewNameSource = new Memory({
            keyProperty: 'key',
            data: [
                { key: 'Controls/list:View' },
                { key: 'Controls/grid:View' },
                { key: 'Controls/tile:View' },
                { key: 'Controls/columns:View' },
                { key: 'Controls/explorer:View' },
            ],
        });
        this._itemActions = [
            {
                id: 'cut',
                title: 'Вырезать',
                icon: 'icon-Scissors',
                handler: (item: Model) => {
                    const key = item.getKey();
                    const index = this._fadedKeys.findIndex((itemKey) => {
                        return key === itemKey;
                    });
                    const newFadedKeys = [...this._fadedKeys];
                    if (index !== -1) {
                        newFadedKeys.splice(index, 1);
                    } else {
                        newFadedKeys.push(key);
                    }
                    this._fadedKeys = newFadedKeys;
                },
            },
        ];
    }

    protected _switchView(_: Event, newViewName: string): void {
        const oldViewName = this._viewName;
        this._viewName = newViewName;
        const slice = this._options._dataOptionsValue.FadedKeys;
        switch (newViewName) {
            case 'Controls/list:View':
                this._itemTemplate = this._listTemplate;
                break;
            case 'Controls/tile:View':
                this._itemTemplate = this._tileTemplate;
                break;
            case 'Controls/grid:View':
                this._itemTemplate = this._gridTemplate;
                break;
            case 'Controls/columns:View':
                this._itemTemplate = this._columnsTemplate;
                break;
            case 'Controls/explorer:View':
                this._itemTemplate = this._treeGridTemplate;
                break;
        }
        if (newViewName === 'Controls/explorer:View') {
            slice.setState({
                viewMode: this._viewMode,
            });
        } else if (oldViewName === 'Controls/explorer:View') {
            slice.setState({
                viewMode: undefined,
            });
        }
    }

    protected _changeViewMode(): void {
        const slice = this._options._dataOptionsValue.FadedKeys;
        if (this._viewMode === 'list') {
            this._viewMode = 'table';
            this._itemTemplate = this._treeGridTemplate;
            this._fadedKeys = [1, 3];
        } else {
            this._viewMode = 'list';
            this._itemTemplate = this._listTemplate;
            this._fadedKeys = [1];
        }
        slice.setState({
            viewMode: this._viewMode,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            FadedKeys: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                },
            },
        };
    }
});
