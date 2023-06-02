import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { IItemPadding as IPadding } from 'Controls/display';
import { Container as ScrollContainer, IScrollState } from 'Controls/scroll';
import { SyntheticEvent } from 'UI/Vdom';
import { CrudEntityKey, Memory } from 'Types/source';
import { Model, relation } from 'Types/entity';

import * as template from 'wml!Controls/_navigation/control/Navigation';
import 'css!Controls/navigation';

export type INavigationViewMode = 'chips' | 'radioGroup';
export enum ENavigationViewMode {
    Chips = 'chips',
    RadioGroup = 'radioGroup',
}

export interface INavigationControlOptions extends IControlOptions {
    items: RecordSet;
    root: CrudEntityKey;
    viewMode: INavigationViewMode;
    level: number;
    keyProperty: string;
    displayProperty: string;
    parentProperty: string;
    nodeProperty: string;
    activeElement: CrudEntityKey;
    padding: IPadding;
    containerPadding: IPadding;
}

export default class Navigation extends Control<INavigationControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        ScrollContainer: ScrollContainer;
    };

    protected _sourceItems: RecordSet | Memory;
    protected _activeElement: CrudEntityKey;
    protected _root: CrudEntityKey;

    private _scrollLeft: number = 0;
    private _hierarchyRelation: relation.Hierarchy;

    // region LiveHooks

    protected _beforeMount(options: INavigationControlOptions): void {
        this._hierarchyRelation = new relation.Hierarchy({ ...options });

        this._resolveActiveElement(options, options.activeElement);
        this._resolveRoot(options, this._activeElement);

        this._prepareItems(options);
    }

    protected _beforeUpdate(options: INavigationControlOptions): void {
        if (
            this._options.keyProperty !== options.keyProperty ||
            this._options.nodeProperty !== options.nodeProperty ||
            this._options.parentProperty !== options.parentProperty
        ) {
            this._hierarchyRelation = new relation.Hierarchy({ ...options });
        }

        let rootChanged = false;
        if (
            this._options.root !== options.root ||
            this._options.level !== options.level ||
            this._options.activeElement !== options.activeElement
        ) {
            rootChanged = this._resolveRoot(options, options.activeElement);
        }

        if (this._options.activeElement !== options.activeElement) {
            this._resolveActiveElement(options, options.activeElement);
        }

        if (
            this._options.items !== options.items ||
            rootChanged ||
            this._options.keyProperty !== options.keyProperty ||
            this._options.parentProperty !== options.parentProperty ||
            this._options.nodeProperty !== options.nodeProperty ||
            this._options.viewMode !== options.viewMode ||
            this._options.displayProperty !== options.displayProperty
        ) {
            this._prepareItems(options);
        }
    }

    protected _afterUpdate(
        oldOptions?: INavigationControlOptions,
        oldContext?: unknown
    ): void {
        if (oldOptions.activeElement !== this._options.activeElement) {
            const activeContainer = this._container.querySelector(
                '.controls-ButtonGroup__button-selected'
            ) as HTMLElement;
            if (activeContainer) {
                // В расчётах необходимо также учитывать правый margin, иначе при подскролле к последнему элементу
                // отступ между элементом и навигационным меню будет отсутствовать (вернее он будет скрыт скролом)
                // https://online.sbis.ru/opendoc.html?guid=6e8388ae-d737-4826-8172-0f2e20fff98a
                const activeContainerMarginRight = parseFloat(
                    getComputedStyle(activeContainer).marginRight
                );
                const parentContainer =
                    activeContainer.offsetParent as HTMLElement;
                if (
                    activeContainer.offsetLeft +
                        activeContainer.offsetWidth +
                        activeContainerMarginRight >
                        this._scrollLeft + parentContainer.offsetWidth ||
                    activeContainer.offsetLeft < this._scrollLeft
                ) {
                    const newScrollPosition =
                        activeContainer.offsetLeft -
                        (parentContainer.offsetWidth -
                            (activeContainer.offsetWidth +
                                activeContainerMarginRight));

                    this._children.ScrollContainer.horizontalScrollTo(
                        newScrollPosition
                    );
                }
            }
        }
    }

    // endregion LiveHooks

    // region Handlers

    protected _scrollStateChangedHandler(
        event: SyntheticEvent,
        state: IScrollState
    ): void {
        this._scrollLeft = state.scrollLeft;
    }

    protected _onSelectedKeyChanged(
        event: SyntheticEvent,
        key: CrudEntityKey
    ): void {
        this._notify('activeElementChanged', [key]);
    }

    // endregion Handlers

    // region Classes

    protected _getLeftPaddingClasses(padding: IPadding): string {
        let result = '';
        if (padding) {
            if (padding.left) {
                result += ` controls-padding_left-${padding.left}`;
            }
        }
        return result;
    }

    protected _getRightPaddingClasses(padding: IPadding): string {
        let result = '';
        if (padding) {
            if (padding.right) {
                result += ` controls-padding_right-${padding.right}`;
            }
        }
        return result;
    }

    // endregion Classes

    private _resolveRoot(
        options: INavigationControlOptions,
        activeElement?: CrudEntityKey
    ): boolean {
        const pathToActiveElement = this._getPathToItem(
            options.items,
            activeElement,
            options.root
        );
        const newRoot = pathToActiveElement[options.level - 1];

        const rootChanged = this._root !== newRoot;
        if (rootChanged) {
            this._root = newRoot;
        }
        return rootChanged;
    }

    private _resolveActiveElement(
        options: INavigationControlOptions,
        activeElementKey: CrudEntityKey
    ): void {
        const path = this._getPathToDepth(
            options.items,
            options.root,
            activeElementKey
        );
        this._activeElement = path[options.level];
    }

    private _getPathToItem(
        items: RecordSet,
        itemKey: CrudEntityKey,
        root: CrudEntityKey
    ): CrudEntityKey[] {
        const path = [];

        if (itemKey !== undefined && itemKey !== null) {
            let parent = items.getRecordById(itemKey);
            do {
                path.unshift(parent.getKey());
                parent = this._hierarchyRelation.getParent(
                    parent,
                    items
                ) as Model | null;
            } while (parent !== null);
        }
        path.unshift(root);

        return path;
    }

    /**
     * Строит путь в глубину иерархии до конца. Всегда берется первый ребенок узла.
     * @param items Рекордсет
     * @param root Корень
     * @param startItemKey Используется для построения начала пути. Чтобы взять не первых детей узлов, а необходимых.
     * @private
     */
    private _getPathToDepth(
        items: RecordSet,
        root: CrudEntityKey,
        startItemKey?: CrudEntityKey
    ): CrudEntityKey[] {
        let path: CrudEntityKey[];

        if (startItemKey !== undefined && startItemKey !== null) {
            path = this._getPathToItem(items, startItemKey, root);
        } else {
            path = [root];
        }

        const lastPathItemKey = path[path.length - 1];
        let child = this._hierarchyRelation.getChildren(
            lastPathItemKey,
            items
        )[0] as Model;
        while (child) {
            path.push(child.getKey());
            child = this._hierarchyRelation.getChildren(
                child,
                items
            )[0] as Model;
        }

        return path;
    }

    private _prepareItems(options: INavigationControlOptions): void {
        const items = [];

        options.items.forEach((item, index) => {
            if (
                item.get(options.parentProperty) === this._root &&
                item.get(options.nodeProperty) === true
            ) {
                items.push({
                    [options.keyProperty]: item.get(options.keyProperty),
                    [options.displayProperty]: item.get(
                        options.displayProperty
                    ),
                    iconOptions: item.get('iconOptions'),
                    iconSize: item.get('iconSize'),
                    iconTemplate: item.get('iconTemplate'),
                });
            }
        });

        this._sourceItems = new RecordSet({
            keyProperty: options.keyProperty,
            rawData: items,
        });
    }
}
