import {
    type BaseControl,
    BaseControlComponent,
    TAlaListConnectedHandlers,
    TBaseControlComponentProps,
    TOldBaseControlCompatibility,
    TOnToggleExpansionParams,
    TSlicelessBaseControlCompatibility,
} from 'Controls/baseList';
import { TCompatibilityForUndoneAspects } from './types/TCompatibilityForUndoneAspects';
import {
    OldTreeLogic,
    SlicelessBaseTreeCompatibility,
    TSlicelessBaseTreeCompatibility,
} from './SlicelessBaseTreeCompatibility';
import type {
    BaseTreeControl as TBaseTreeControl,
    IBaseTreeControlOptions,
} from 'Controls/baseTree';
import { BaseTreeControl } from 'Controls/baseTree';
import { TKey } from 'Controls/interface';
import { CrudEntityKey } from 'Types/source';
import { expandCollapse as NotificationCompatibility } from './NotificationCompatibility';

export interface TBaseTreeControlComponentProps extends TBaseControlComponentProps {
    expanderClickCallback?: (key: CrudEntityKey) => boolean;
}

type TSlicelessBaseTreeControlCompatibility = TSlicelessBaseControlCompatibility &
    TSlicelessBaseTreeCompatibility;

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
};

export class BaseTreeControlComponent extends BaseControlComponent<
    TBaseTreeControlComponentProps,
    TCompatibilityForUndoneAspects,
    TSlicelessBaseTreeControlCompatibility
> {
    private _expandResolver: TResolver = {};
    private _collapseResolver: TResolver = {};

    private _isDestroyed: boolean = false;

    componentDidUpdate(prevProps: Readonly<TBaseTreeControlComponentProps>): any {
        if (this.isControlDividedWithSlice && prevProps.loading !== this.props.loading) {
            this._updateResolverByLoading(this._expandResolver, this.props.loading);
            this._updateResolverByLoading(this._collapseResolver, this.props.loading);
        }
    }

    componentWillUnmount() {
        this._isDestroyed = true;
    }

    private _updateResolverByLoading(relolver: TResolver, isLoading: boolean): void {
        if (relolver.resolver) {
            if (isLoading) {
                relolver.isLoading = true;
            } else {
                relolver.resolver();
                relolver.resolver = undefined;
                relolver.isLoading = false;
            }
        }
    }

    private _resolveIfAllLoaded(relolver: TResolver): void {
        // setTimeout был бы не нужен, если бы над нами никогда не было Wasaby.
        // Здесь проверяется, что вызов разворота строчкой выше не привел к загрузке(дети загружены).
        // В таком случае синхронизаций больше не будет, отстреливаем промис сейчас.
        // На реакт стек бы выглядел this.props.expand -> slice.expand -> this.componentDidUpdate -> эта строка.
        // Но в кейсах, когда используется Wasaby коннектор к слайсу, этот коннектор обновляет детей
        // асинхронно(через requestAnimationFrame), следовательно стек такой
        // this.props.expand -> slice.expand -> эта строка -> this.componentDidUpdate
        // и мы не можем понять, нужно ли отстреливать промис.
        // setTimeout встает за requestAnimationFrame и нормально отрабатывает.
        setTimeout(() => {
            setTimeout(() => {
                if (relolver.resolver && !relolver.isLoading) {
                    relolver.resolver();
                }
            });
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
            getDeprecatedCode().OldTreeLogic.resetExpandedItems(treeControl);
        }
    }

    protected _isExpanded(
        ...args: [
            key: CrudEntityKey,
            treeControl: TBaseTreeControl,
            options: IBaseTreeControlOptions
        ]
    ): boolean {
        if (this.isControlDividedWithSlice) {
            const [key] = args;
            // Чистая схема, прокся в слайс
            return this.props.isExpanded(key);
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldTreeLogic.isExpanded(...args);
        }
    }
    protected _isExpandAll(
        ...args: [
            keys: TKey[] | undefined,
            treeControl: TBaseTreeControl,
            options: IBaseTreeControlOptions
        ]
    ): boolean {
        if (this.isControlDividedWithSlice) {
            // Чистая схема, прокся в слайс
            return this.props.isExpandAll();
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldTreeLogic.isExpandAll(...args);
        }
    }

    protected _expand(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions
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
            return getDeprecatedCode().OldTreeLogic.expand(...clearArgs);
        }
    }

    protected _collapse(
        ...args: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions
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
            return getDeprecatedCode().OldTreeLogic.collapse(...clearArgs);
        }
    }

    private _callExpandCollapse(
        command: 'expand' | 'collapse',
        resolver: () => void,
        [key, params, treeControl, options]: [
            key: CrudEntityKey,
            params: TOnToggleExpansionParams | undefined,
            treeControl: BaseTreeControl,
            options: IBaseTreeControlOptions
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
            options: IBaseTreeControlOptions
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
                const oldTreeLogic = getDeprecatedCode().OldTreeLogic;
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
            options: IBaseTreeControlOptions
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
        if (this.isControlDividedWithSlice) {
            // Чистая схема, прокся в слайс
            return options.expandedItems;
        } else {
            // Схема без слайсов
            return getDeprecatedCode().OldTreeLogic.getExpandedItems(treeControl);
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
            getDeprecatedCode().OldTreeLogic.beforeStatDrag(key, treeControl, options);
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
        return {
            ...super._getSlicelessHandlers(),
            ...getDeprecatedCode().SlicelessBaseTreeCompatibility,
        };
    }
}

function getDeprecatedCode(): typeof import('./SlicelessBaseTreeCompatibility') {
    // TODO -> return isLoaded('...') ? loadSync('...') : {};
    return {
        OldTreeLogic,
        SlicelessBaseTreeCompatibility,
    };
}
