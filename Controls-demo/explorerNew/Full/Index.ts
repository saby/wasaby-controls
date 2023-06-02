import { IColumn } from 'Controls/grid';
import { TKey } from 'Controls/interface';
import { Control, TemplateFunction } from 'UI/Base';
import { TExplorerViewMode } from 'Controls/explorer';
import { HierarchicalMemory, Memory } from 'Types/source';
import * as template from 'wml!Controls-demo/explorerNew/Full/Index';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls-demo/explorerNew/Full/Index';

interface IFilter {
    // Параметр фильтра который предназначен для инициализации перезагрузки списка
    // по средствам смены фильтра. Ни как не влияет на набор данных.
    onlyForInitReload: boolean;
}

/**
 * Большая демка для тестирования сложных сценариев использования explorer,
 * когда в несколько шагов меняются несколько опций
 */
export default class Index extends Control {
    protected _template: TemplateFunction = template;

    // region template props
    protected _root: TKey = null;
    protected _columns: IColumn[] = Gadgets.getColumns();
    protected _viewSource: HierarchicalMemory = new HierarchicalMemory({
        keyProperty: 'id',
        parentProperty: 'parent',
        data: Gadgets.getData(),
        filter: (item, query: IFilter) => {
            return true;
        },
    });

    protected _searchValue: string = '';
    protected _deepReload: boolean = true;
    protected _expandByItemClick: boolean = false;
    protected _filter: IFilter = { onlyForInitReload: false };

    protected _viewMode: TExplorerViewMode = 'table';
    protected _useColumns: boolean = false;

    // Источник с данными для выбора режима отображения списка
    protected _viewModeSource: Memory = new Memory({
        keyProperty: 'id',
        data: [
            { id: 'table' },
            { id: 'tile' },
            { id: 'list' },
            { id: 'search' },
        ],
    });

    // Кол-во колонок, отображаемых в представлении с viewMode === 'list'
    // если задано больше одной, то будет отрендерено представление Controls.columns:View
    protected _viewColumnsCount: number = 1;
    // endregion

    // region toolbar handlers
    /**
     * Обработчик пользовательской смены viewMode.
     * Если {@link _viewColumnsCount} > 1, то будет отрендерено представление Controls.columns:View
     */
    protected _onViewModeChange(
        event: SyntheticEvent,
        newViewMode: string
    ): void {
        this._viewMode = newViewMode as TExplorerViewMode;

        if (this._viewMode === 'list') {
            this._useColumns = this._viewColumnsCount > 1;
        }
    }

    /**
     * Пересобирает фильтр меня в нем только значение одного параметра,
     * который не влияет на сортировку данных, но создаст изменение фильтра
     * что вызовет перезагрузку списка.
     */
    protected _changeFilterForInitReload(): void {
        this._filter = { ...this._filter };
        this._filter.onlyForInitReload = !this._filter.onlyForInitReload;
    }
    // endregion
}
