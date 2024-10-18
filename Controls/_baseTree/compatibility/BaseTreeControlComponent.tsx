import {
    type BaseControl,
    BaseControlComponent,
    TAlaListConnectedHandlers,
    TBaseControlComponentProps,
    TOldBaseControlCompatibility,
    TOnToggleExpansionParams,
} from 'Controls/baseList';
import { TCompatibilityForUndoneAspects } from './types/TCompatibilityForUndoneAspects';
import type {
    TSlicelessBaseControlCompatibility,
    TSlicelessBaseTreeControlCompatibility as _TSlicelessBaseTreeControlCompatibility,
} from 'Controls/listDataOld';
import type {
    BaseTreeControl as TBaseTreeControl,
    IBaseTreeControlOptions,
} from 'Controls/baseTree';
import { BaseTreeControl } from 'Controls/baseTree';
import { TKey } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import { expandCollapse as NotificationCompatibility } from './NotificationCompatibility';
import { isLoaded, loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';

export interface TBaseTreeControlComponentProps extends TBaseControlComponentProps {
    expanderClickCallback?: (key: CrudEntityKey) => boolean;
}

type TSlicelessBaseTreeControlCompatibility = TSlicelessBaseControlCompatibility &
    _TSlicelessBaseTreeControlCompatibility;

export type TOldBaseTreeControlCompatibility = TOldBaseControlCompatibility<
    TCompatibilityForUndoneAspects,
    TSlicelessBaseTreeControlCompatibility
>;

export const BASE_TREE_CONTROL_DEFAULT_OPTIONS = {
    expandByItemClick: false,
    supportExpand: true,
    markItemByExpanderClick: true,
};

type TResolver = {
    resolver?: () => void;
    isLoading?: boolean;
    timers?: [number | undefined, number | undefined];
};

const REDUCERS_LIB_NAME = 'Controls/listWebReducers';

// TODO: Перестать грузить модуль и перейти на прослушивание
//  события о загрузке после реализации задачи:
//  https://online.sbis.ru/opendoc.html?guid=5e21ab7e-d48c-473f-bb38-8ef84fb96dc4&client=3
const onModuleLoaded = (cb: (name: string) => void) => {
    if (isLoaded(REDUCERS_LIB_NAME)) {
        cb(REDUCERS_LIB_NAME);
    } else {
        loadAsync(REDUCERS_LIB_NAME).then(() => {
            cb(REDUCERS_LIB_NAME);
        });
    }
};

const offModuleLoaded = (_cb: (name: string) => void) => {
    // TODO: Отписка от события о загруке, которая понадобится после реализации задачи.
    //  https://online.sbis.ru/opendoc.html?guid=5e21ab7e-d48c-473f-bb38-8ef84fb96dc4&client=3
};

const updateResolverByLoading = (resolver: TResolver, isLoading: boolean) => {
    if (resolver.resolver) {
        if (isLoading) {
            resolver.isLoading = true;
        } else {
            resolveAndCleanUp(resolver);
        }
    }
};

const scheduleResolverResolve = (resolver: TResolver) => {
    const timers: [number | undefined, number | undefined] = [undefined, undefined];
    resolver.timers = timers;

    timers[0] = setTimeout(() => {
        timers[1] = setTimeout(() => {
            resolver.timers = undefined;
            if (resolver.resolver && !resolver.isLoading) {
                resolveAndCleanUp(resolver);
            }
        });
        timers[0] = undefined;
    });
};

const resolveAndCleanUp = (resolver: TResolver) => {
    if (resolver.timers) {
        resolver.timers.forEach((i) => {
            if (typeof i === 'number') {
                clearTimeout(i);
            }
        });
        resolver.timers = undefined;
    }
    if (resolver.resolver) {
        resolver.resolver();
        resolver.resolver = undefined;
    }
    resolver.isLoading = false;
};

export class BaseTreeControlComponent extends BaseControlComponent<
    TBaseTreeControlComponentProps,
    TCompatibilityForUndoneAspects,
    TSlicelessBaseTreeControlCompatibility
> {
    private _expandResolver: TResolver = {};
    private _collapseResolver: TResolver = {};

    private _isDestroyed: boolean = false;
    private _isReducersLoaded = false;
    private _cbWaitingReducers: (() => unknown)[] = [];

    constructor(...args: ConstructorParameters<typeof BaseControlComponent>) {
        super(...args);

        this._onModuleLoaded = this._onModuleLoaded.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<TBaseTreeControlComponentProps>): any {
        if (this.isControlDividedWithSlice && prevProps.loading !== this.props.loading) {
            updateResolverByLoading(this._expandResolver, this.props.loading);
            updateResolverByLoading(this._collapseResolver, this.props.loading);
        }
    }

    componentWillUnmount() {
        this._isDestroyed = true;
        if (this._cbWaitingReducers.length) {
            offModuleLoaded(this._onModuleLoaded);
        }
    }

    private _doAfterReducersLoaded(cb: () => unknown): void {
        this._isReducersLoaded = this._isReducersLoaded || isLoaded(REDUCERS_LIB_NAME);
        if (this._isReducersLoaded) {
            cb();
            return;
        }

        this._cbWaitingReducers.push(cb);

        if (this._cbWaitingReducers.length > 1) {
            return;
        }

        onModuleLoaded(this._onModuleLoaded);
    }

    private _onModuleLoaded(name: string) {
        if (name === REDUCERS_LIB_NAME) {
            this._cbWaitingReducers.forEach((r) => r());
            this._cbWaitingReducers = [];
            this._isReducersLoaded = true;
            offModuleLoaded(this._onModuleLoaded);
        }
    }

    private _resolveIfAllLoaded(resolver: TResolver): void {
        // setTimeout был бы не нужен, если бы над нами никогда не было Wasaby.
        // Здесь проверяется, что вызов разворота строчкой выше не привел к загрузке(дети загружены).
        // В таком случае синхронизаций больше не будет, отстреливаем промис сейчас.
        // На реакт стек бы выглядел this.props.expand -> slice.expand -> this.componentDidUpdate -> эта строка.
        // Но в кейсах, когда используется Wasaby коннектор к слайсу, этот коннектор обновляет детей
        // асинхронно(через requestAnimationFrame), следовательно стек такой
        // this.props.expand -> slice.expand -> эта строка -> this.componentDidUpdate
        // и мы не можем понять, нужно ли отстреливать промис.
        // setTimeout встает за requestAnimationFrame и нормально отрабатывает.
        this._doAfterReducersLoaded(() => {
            scheduleResolverResolve(resolver);
        });
    }

    //#region TAlaListConnectedHandlers
    protected _resetExpansion(
        treeControl: TBaseTreeControl,
        _options: IBaseTreeControlOptions
    ): void {
        if (this.isControlDividedWithSlice) {
            // Чистая схема, прокся в слайс
            this.props.resetExpansion();
        } else {
            // Схема без слайсов
            getDeprecatedCode().OldBaseTreeControlLogic.resetExpandedItems(treeControl);
        }
    }

    protected _isExpanded(
        ...args: [
            key: CrudEntityKey,
            treeControl: TBaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): boolean {
        if (this.isControlDividedWithSlice) {
            const [key] = args;
            // Чистая схема, прокся в слайс
            return this.props.isExpanded(key);
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldBaseTreeControlLogic.isExpanded(...args);
        }
    }

    protected _isExpandAll(
        ...args: [
            keys: TKey[] | undefined,
            treeControl: TBaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): boolean {
        if (this.isControlDividedWithSlice || !isOldLoaded()) {
            // Чистая схема, прокся в слайс
            return this.props.isExpandAll();
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldBaseTreeControlLogic.isExpandAll(...args);
        }
    }

    protected _expand(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): Promise<void> {
        const [key, , treeControl, options] = args;
        const clearArgs = [key, treeControl, options] as const;

        if (this.isControlDividedWithSlice) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            treeControl._displayGlobalIndicator();
            // Эмуляция асинхронной работы метода и поддержка нотификации.
            return Promise.resolve(NotificationCompatibility.beforeItemExpand(...clearArgs))
                .then(() =>
                    new Promise<void>((resolver) => {
                        this._callExpandCollapse('expand', resolver, args);
                    }).then(() => {
                        NotificationCompatibility.afterItemExpand(...clearArgs);
                    })
                )
                .finally(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    NotificationCompatibility.itemCollapse(...clearArgs);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (treeControl._indicatorsController.shouldHideGlobalIndicator()) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        treeControl._indicatorsController.hideGlobalIndicator();
                    }
                });
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldBaseTreeControlLogic.expand(...clearArgs);
        }
    }

    protected _collapse(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): Promise<void> {
        const [key, , treeControl, options] = args;
        const clearArgs = [key, treeControl, options] as const;
        if (this.isControlDividedWithSlice) {
            // Эмуляция асинхронной работы метода и поддержка нотификации.
            return Promise.resolve(NotificationCompatibility.beforeItemCollapse(...clearArgs))
                .then(() =>
                    new Promise<void>((resolver) => {
                        this._callExpandCollapse('collapse', resolver, args);
                    }).then(() => {
                        NotificationCompatibility.afterItemCollapse(...clearArgs);
                    })
                )
                .finally(() => {
                    NotificationCompatibility.itemCollapse(...clearArgs);
                });
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldBaseTreeControlLogic.collapse(...clearArgs);
        }
    }

    private _callExpandCollapse(
        command: 'expand' | 'collapse',
        resolver: () => void,
        [key, params, treeControl, options]: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): void {
        const thisResolver = command === 'expand' ? this._expandResolver : this._collapseResolver;
        thisResolver.resolver = resolver;

        // Мы не можем идти по чистой слайсовой логике и отдать ему ответственность проставить маркер,
        // т.к. в списках с BaseControl смена маркера обвязана событиями, которые поддержаны
        // на уровне совместимости (BaseControlComponent).
        // Слайс же сменит маркер тихо, без отстрела парных событий и без возможности отмены.
        this.props[command](key, { markItem: false });

        const { markItem = true } = params || {};
        if (markItem) {
            this._mark(key, treeControl as unknown as BaseControl, options);
        }
        this._resolveIfAllLoaded(thisResolver);
    }

    protected _toggleExpansion(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ): Promise<void> {
        const [key, , treeControl, options] = args;
        const argsWithoutParams = [key, treeControl, options] as const;

        if (this.isControlDividedWithSlice) {
            // FIXME: Подумать
            //  Зацепил нотификацию именно на expand и collapse,
            //  поэтому не могу просто позвать props.toggleExpansion(...)
            if (this._isExpanded(key, treeControl, options)) {
                return this._collapse(...args);
            } else {
                return this._expand(...args);
            }
        } else {
            return Promise.resolve().then(() => {
                // Схема без слайсов
                const oldTreeLogic = getDeprecatedCode().OldBaseTreeControlLogic;
                if (oldTreeLogic.isExpanded(...argsWithoutParams)) {
                    return oldTreeLogic.collapse(...argsWithoutParams);
                } else {
                    return oldTreeLogic.expand(...argsWithoutParams);
                }
            });
        }
    }

    protected _onExpanderClick(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions,
        ]
    ) {
        const result = this.props.expanderClickCallback?.(args[0]);
        if (result !== false) {
            this._toggleExpansion(...args);
        }
    }

    //#endregion TAlaListConnectedHandlers

    //#region TCompatibilityForUndoneAspects

    private _getExpandedItemsCompatible(
        treeControl: TBaseTreeControl,
        options: IBaseTreeControlOptions
    ): TKey[] | undefined {
        if (this.isControlDividedWithSlice || !isOldLoaded()) {
            // Чистая схема, прокся в слайс
            return options.expandedItems;
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldBaseTreeControlLogic.getExpandedItems(treeControl);
        }
    }

    private _beforeStartDragCompatible(
        key: CrudEntityKey,
        treeControl: BaseTreeControl,
        options: IBaseTreeControlOptions
    ): void {
        if (this.isControlDividedWithSlice) {
            this._collapse(key, undefined, treeControl, options);
        } else {
            // Схема без слайсов
            getDeprecatedCode().OldBaseTreeControlLogic.beforeStatDrag(key, treeControl, options);
        }
    }

    //#endregion TCompatibilityForUndoneAspects

    protected _getAlaListConnectedHandlers(): TAlaListConnectedHandlers {
        return super._getAlaListConnectedHandlers();
    }

    protected _getCompatibilityForUndoneAspects(): TCompatibilityForUndoneAspects {
        return {
            ...super._getCompatibilityForUndoneAspects(),
            beforeStartDragCompatible: this._beforeStartDragCompatible.bind(this),
            getExpandedItemsCompatible: this._getExpandedItemsCompatible.bind(this),
        };
    }

    protected _getSlicelessHandlers(): Partial<TSlicelessBaseTreeControlCompatibility> {
        if (!isLoaded('Controls/listDataOld')) {
            return {};
        }
        return {
            ...super._getSlicelessHandlers(),
            ...getDeprecatedCode().SlicelessBaseTreeControlCompatibility,
        };
    }
}

type TListDataOld = typeof import('Controls/listDataOld');

function getDeprecatedCode(): Pick<
    TListDataOld,
    'SlicelessBaseTreeControlCompatibility' | 'OldBaseTreeControlLogic'
> {
    return loadSync<typeof import('Controls/listDataOld')>('Controls/listDataOld');
}

function isOldLoaded(): boolean {
    return isLoaded('Controls/listDataOld');
}
