/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { TemplateFunction, IControlOptions, Control } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/ContainerNew/Container';
import { SyntheticEvent } from 'UI/Events';
import { descriptor, Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { ListSlice, IListSliceErrorConfig } from 'Controls/dataFactory';
import { RegisterClass } from 'Controls/event';
import { IContextValue } from 'Controls/context';
import { TVisibility as TMarkerVisibility } from 'Controls/marker';
import {
    ISortingOptions,
    IPromiseSelectableOptions,
    IHierarchyOptions,
    IExpandedItemsOptions,
    ISourceOptions,
    IFilterOptions,
    Direction,
    TKey,
    TSortingOptionValue,
    INavigation,
} from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IColumn } from 'Controls/grid';
import { TExplorerViewMode } from 'Controls/explorer';
import { Logger } from 'UI/Utils';
import type { ErrorViewConfig, ErrorController } from 'Controls/error';
import { processError, getErrorConfig } from 'Controls/_baseList/Error/errorHelpers';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

export interface IListContainerOptions extends IControlOptions {
    storeId: string;
    _dataOptionsValue: IContextValue;
    preloadRoot?: boolean;
}

interface IViewOptions
    extends ISortingOptions,
        IPromiseSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        IFilterOptions,
        IExpandedItemsOptions {
    markerVisibility: TMarkerVisibility;
    sourceController: SourceController;
    root: string;
    breadCrumbsItems: Model[];
    loading: boolean;
    items: RecordSet;
    columns?: IColumn[];
    viewMode?: TExplorerViewMode;
    multiSelectVisibility?: string;
    searchValue: string;
    backButtonCaption?: string;
    displayProperty?: string;
    navigation?: INavigation;
    expanderVisibility?: 'hasChildren' | 'visible';
    hasChildrenProperty: string;
    searchStartingWith?: string;
}

type TViewOptions = keyof IViewOptions;

type TRootLoadPromise = Record<string, Promise<RecordSet | Error>>;

const VIEW_OPTIONS: TViewOptions[] = [
    'markerVisibility',
    'sorting',
    'selectedKeys',
    'excludedKeys',
    'displayProperty',
    'parentProperty',
    'backButtonCaption',
    'nodeProperty',
    'expandedItems',
    'searchValue',
    'breadCrumbsItems',
    'root',
    'source',
    'filter',
    'viewMode',
    'multiSelectVisibility',
    'sourceController',
    'loading',
    'columns',
    'viewMode',
    'navigation',
    'hasChildrenProperty',
    'expanderVisibility',
    'searchStartingWith',
];

function validateOptionsOnContainer(options: IListContainerOptions): void {
    // columns пока не проверяем, потому что его задают на списке в сотрудниках и отчётности
    // и пока непонятно, всегда ли columns должны задаваться в загрузчике
    const excludedOptions = ['columns'];

    VIEW_OPTIONS.forEach((optionName) => {
        if (options[optionName] !== undefined && !excludedOptions.includes(optionName)) {
            Logger.error(`Передаётся опция ${optionName} для списка со storeId: ${options.storeId}.
                          Опцию ${optionName} необходимо задавать на уровне загрузчика данных`);
        }
    });
}

export default class ListContainer extends Control<IListContainerOptions> {
    protected _template: TemplateFunction = template;
    private _listSlice: ListSlice;
    private _viewOptions: IViewOptions;
    private _command: string;
    private _selectedTypeRegister: RegisterClass;
    private _rootLoadPromise: TRootLoadPromise = {};
    private _errorConfig: ErrorViewConfig;
    private _errorController: ErrorController;
    private _operationsPanelVisible: boolean = false;

    constructor(options: IListContainerOptions) {
        super(options);

        this._rootChanged = this._rootChanged.bind(this);
        this._beforeRootChanged = this._beforeRootChanged.bind(this);
        this._expandedItemsChanged = this._expandedItemsChanged.bind(this);
        this._selectedKeysCountChanged = this._selectedKeysCountChanged.bind(this);
        this._selectedKeysChanged = this._selectedKeysChanged.bind(this);
        this._markedKeyChanged = this._markedKeyChanged.bind(this);
        this._excludedKeysChanged = this._excludedKeysChanged.bind(this);
        this._sortingChanged = this._sortingChanged.bind(this);
        this._registerHandler = this._registerHandler.bind(this);
    }

    protected _beforeMount(options: IListContainerOptions): void {
        validateOptionsOnContainer(options);
        this._listSlice = ListContainer.getSlice(options);
        ListContainer.validateSlice(this._listSlice, options.storeId);
        this._viewOptions = this._getViewOptionsFromSlice();

        if (this._listSlice.errorConfig) {
            this._showError();
        }
    }

    protected _registerHandler(
        event: Event,
        registerType: string,
        component: unknown,
        callback: Function,
        config: object
    ): void {
        this._getSelectionTypeRegister().register(event, registerType, component, callback, config);
    }

    protected _getSelectionTypeRegister(): RegisterClass {
        if (!this._selectedTypeRegister) {
            this._selectedTypeRegister = new RegisterClass({
                register: 'selectedTypeChanged',
            });
        }
        return this._selectedTypeRegister;
    }

    protected _selectedKeysCountChanged(count: number, isAllSelected: boolean): void {
        this._listSlice.setSelectionCount(count, isAllSelected, this._options.storeId);
    }

    protected _beforeUpdate(options: IListContainerOptions): void {
        const listSlice = ListContainer.getSlice(options);
        // до 4000, может быть случай, когда контекст уже обновился, а контейнер еще нет и скорее всего будет дестроиться
        if (
            !listSlice &&
            this._listSlice &&
            options.storeId === this._options.storeId &&
            this._listSlice.isDestroyed()
        ) {
            return;
        }
        ListContainer.validateSlice(listSlice, options.storeId);
        if (this._command !== listSlice.command) {
            this._command = listSlice.command;
            if (this._command) {
                this._executeCommand(listSlice);
            }
        }

        if (this._operationsPanelVisible !== listSlice.state.operationsPanelVisible) {
            this._operationsPanelVisible = listSlice.state.operationsPanelVisible;
            if (this._operationsPanelVisible) {
                this.activate();
            }
        }

        if (listSlice !== this._listSlice) {
            this._listSlice = listSlice;
        }

        if (this._isViewOptionsChanged(listSlice)) {
            this._viewOptions = this._getViewOptionsFromSlice();
        }

        if (this._listSlice.errorConfig) {
            this._showError();
        } else if (this._isErrorVisible()) {
            this._hideError();
        }
    }

    protected _executeCommand(slice: ListSlice): void {
        this._getSelectionTypeRegister().start(slice.command);
        slice.onExecutedCommand();
    }

    protected _rootChanged(root: TKey): void {
        if (this._rootLoadPromise[root]) {
            this._rootLoadPromise[root].then((items) => {
                this._listSlice.unobserveChanges();
                this._listSlice.sourceController.setRoot(root);
                this._listSlice.observeChanges();
                this._listSlice.setItems(items, root);
            });
            delete this._rootLoadPromise[root];
        } else {
            this._listSlice.setRoot(root);
        }
    }

    protected _expandedItemsChanged(expandedItems: TKey[]): void {
        this._listSlice.setExpandedItems(expandedItems);
    }

    protected _loadToDirection(event: SyntheticEvent, direction: Direction, key: TKey): void {
        event.stopPropagation();
        this._listSlice.load(direction, key);
    }

    protected _selectedKeysChanged(keys: TKey[]): void {
        this._listSlice.setSelectedKeys(keys);
    }

    protected _excludedKeysChanged(keys: TKey[]): void {
        this._listSlice.setExcludedKeys(keys);
    }

    protected _sortingChanged(sorting: TSortingOptionValue): void {
        this._listSlice.setSorting(sorting);
    }

    protected _viewModeChanged(event: SyntheticEvent, viewMode: TExplorerViewMode): void {
        event.stopPropagation();
        this._listSlice.setState({
            viewMode,
        });
    }

    protected _markedKeyChanged(markedKey: TKey): void {
        this._listSlice.setState({
            markedKey,
        });
    }

    private _getViewOptionsFromSlice(): IViewOptions {
        const options = {};

        VIEW_OPTIONS.forEach((optionName) => {
            options[optionName] = this._listSlice[optionName];
        });

        return options as IViewOptions;
    }

    private _isViewOptionsChanged(listSlice: ListSlice): boolean {
        return !!VIEW_OPTIONS.find((optionName) => {
            return !isEqual(this._viewOptions[optionName], listSlice[optionName]);
        });
    }

    private _showError(): void {
        if (!this._errorConfig) {
            this._getErrorController().then((errorController) => {
                const sliceErrConfig = this._listSlice.errorConfig as IListSliceErrorConfig;
                const errorViewConfig = getErrorConfig(
                    { ...sliceErrConfig, root: this._listSlice.root },
                    sliceErrConfig.error
                );
                processError(errorController, errorViewConfig, this._options.theme).then(
                    (errorViewConfig) => {
                        if (errorViewConfig) {
                            this._errorConfig = errorViewConfig;
                        }
                    }
                );
            });
        }
    }

    private _hideError(): void {
        this._errorConfig = null;
    }

    private _isErrorVisible(): boolean {
        return !!this._errorConfig;
    }

    private _getErrorController(): Promise<ErrorController> {
        if (this._errorController) {
            return Promise.resolve(this._errorController);
        } else {
            return loadAsync<typeof import('Controls/error')>('Controls/error').then(
                ({ ErrorController }) => {
                    return (this._errorController = new ErrorController({}));
                }
            );
        }
    }

    protected _beforeRootChanged(root: TKey): void {
        if (this._options.preloadRoot) {
            if (!this._rootLoadPromise[root]) {
                this._rootLoadPromise[root] = this._listSlice.load(
                    undefined,
                    root,
                    undefined,
                    false
                );
            }
        }
    }

    private static getSlice({ _dataOptionsValue, storeId }: IListContainerOptions): ListSlice {
        return _dataOptionsValue.getStoreData(storeId) as ListSlice;
    }

    private static validateSlice(slice: unknown, storeId: string): void {
        if (!slice) {
            Logger.error(`Для списка указано неверное значение опции storeId.
                         В контексте по переданному ${storeId} не удалось найти слайс.
                         Проверьте конфигурацию загрузки данных, а так же соответствие ключа загрузчика и storeId`);
        } else if (!slice['[IListSlice]']) {
            Logger.error(`Найден неверный слайс в списке со storeId: ${storeId}.
                         Список работает только списочным слайсом
                         или его наследником (см. Controls/dataFactory:List).`);
        }
    }

    static defaultProps = {
        preloadRoot: true,
    };

    static getOptionTypes(): object {
        return {
            storeId: descriptor(String).required(),
        };
    }
}
