/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import ListAction from 'Controls/_actions/ListActions/ListAction';
import { IListActionOptions } from 'Controls/_actions/interface/IListAction';
import { TKey } from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import * as rk from 'i18n!Controls';
import { USER } from 'ParametersWebAPI/Scope';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { IBrowserSlice } from 'Controls/context';
import { Logger } from 'UI/Utils';
import { object } from 'Types/util';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';

export interface IViewModeItem {
    title: string;
    icon: string;
    viewName: string;
}

export interface IViewModeActionOptions extends IListActionOptions {
    items: IViewModeItem[];
    listId: string;
    propStorageId?: string;
}

export interface IViewModeActionExecuteArguments
    extends IViewModeActionOptions,
        IActionExecuteParams {}

export const DEFAULT_VIEW_MODES = [
    {
        id: 'tile',
        title: rk('Плитка'),
        icon: 'icon-ArrangePreview',
        viewName: 'Controls/treeTile',
    },
    {
        id: 'table',
        title: rk('Таблица'),
        icon: 'icon-Table',
        viewName: 'Controls/treeGrid',
    },
    {
        id: 'list',
        title: rk('Список'),
        icon: 'icon-ArrangeList',
        viewName: 'Controls/list',
    },
];

export default class ViewModeAction extends ListAction<
    IViewModeActionOptions,
    IViewModeActionExecuteArguments
> {
    private _items: RecordSet = null;
    private _selectedItem: Model = null;

    constructor(options: IViewModeActionOptions) {
        super(options);
        let currentViewMode = this._getSlice().viewMode;
        if (currentViewMode === 'search') {
            currentViewMode = this._getSlice().previousViewMode;
        }
        const items = object.clone(options.items || DEFAULT_VIEW_MODES);
        items.forEach((item) => {
            item.parent = this.id;
        });
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: items,
        });
        const item = this._items.getRecordById(currentViewMode);
        if (item) {
            this._selectedItem = item;
            this.icon = this._selectedItem.get('icon');
            this.tooltip = this._selectedItem.get('title');
            this.title = this._selectedItem.get('title');
        }
    }

    protected _loadViewMode(templateName: string, callback: Function): void {
        if (isLoaded(templateName)) {
            callback();
        } else {
            loadAsync(templateName)
                .then(() => {
                    callback();
                })
                .catch(() => {
                    Logger.error(`viewMode ${templateName} не смог загрузиться`);
                    callback();
                });
        }
    }

    updateContext(newContext): void {
        const slice = newContext[this._options.listId];
        const viewModeChanged = this._selectedItem?.getKey() !== slice.viewMode;
        if (viewModeChanged && this._items.getRecordById(slice.viewMode)) {
            const item = this._items.getRecordById(slice.viewMode);
            if (item) {
                this._selectedItem = item;
                this.icon = this._selectedItem.get('icon');
                this.tooltip = this._selectedItem.get('title');
                this.title = this._selectedItem.get('title');
            }
        }
    }

    protected _getSlice(): IBrowserSlice {
        return this._options.context[this._options.listId] as IBrowserSlice;
    }

    getValue(): TKey[] {
        if (this._selectedItem) {
            return [this._selectedItem.getKey()];
        }
        return [];
    }

    getChildren(root: TKey): Promise<RecordSet> {
        return Promise.resolve(this._items);
    }

    execute(options: IViewModeActionExecuteArguments): void {
        const toolbarItem = options.toolbarItem;
        if (toolbarItem.getKey() === this.id) {
            return;
        }
        this._selectedItem = toolbarItem;
        this.icon = toolbarItem.get('icon');
        this.tooltip = toolbarItem.get('title');
        this.title = toolbarItem.get('title');
        const viewName = toolbarItem.get('viewName');
        if (!viewName) {
            Logger.error(
                `Для вьюмода ${toolbarItem.getKey()} не указан шаблон списка в свойстве viewName, возможны проблемы`
            );
        } else {
            this._loadViewMode(viewName, () => {
                const slice = this._getSlice();
                if (slice.setViewMode) {
                    slice.setViewMode(toolbarItem.getKey());
                } else {
                    Logger.error(
                        `Данные списка ${this._options.listId} отсутствуют в контексте. Проверьте корректность данных предзагрузки или опции экшена`
                    );
                }
            });
        }
        if (this._options.propStorageId) {
            USER.set(this._options.propStorageId, toolbarItem.getKey());
        }
    }
}
Object.assign(ViewModeAction.prototype, {
    id: 'viewMode',
    'parent@': true,
});
