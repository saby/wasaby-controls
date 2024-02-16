import * as React from 'react';
import {
    TOnToggleExpansionParams,
    BaseControlEmulationCompatibility,
    TBaseControlEmulationCompatibilityProps,
    TBaseControlEmulationCompatibility,
} from 'Controls/baseList';
import { helpers } from 'Controls/listsCommonLogic';
import type { TKey } from 'Controls/interface';
import { expandCollapse as NotificationCompatibility } from './NotificationCompatibility';
import { BaseTreeControl, IBaseTreeControlOptions } from '../BaseTreeControl';

// TODO: Удалить статический импорт, после того как контейнер для работы в схеме без слайсов будет вынесен из списков.
import { SlicelessBaseTreeCompatibility, OldTreeLogic } from './SlicelessBaseTreeCompatibility';
// import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

function getSlicelessBaseTreeCompatibility(): typeof import('Controls/_baseTree/compatibility/SlicelessBaseTreeCompatibility') {
    // if (!isLoaded('Controls/_baseTree/compatibility/SlicelessBaseTreeCompatibility')) {
    //     throw Error('Слой совместимости списков без Slice не был предзагружен перед построением!');
    // }
    // return loadSync<
    //     typeof import('Controls/_baseTree/compatibility/SlicelessBaseTreeCompatibility')
    // >('Controls/_baseTree/compatibility/SlicelessBaseTreeCompatibility');
    return {
        SlicelessBaseTreeCompatibility,
        OldTreeLogic,
    };
}

export type TBaseTreeControlEmulationCompatibilityProps =
    TBaseControlEmulationCompatibilityProps & {};

export type TBaseControlEmulationCompatibilityRef = React.ForwardedRef<HTMLDivElement>;

export const BASE_TREE_CONTROL_DEFAULT_OPTIONS = {
    expandByItemClick: false,
    supportExpand: true,
    markItemByExpanderClick: true,
};

type TCompatibleArgs<T extends unknown[] = []> = [...T, BaseTreeControl, IBaseTreeControlOptions];

type TCompatibleArgsWithKey = TCompatibleArgs<[TKey]>;
type TCompatibleOnExpanderClickArgs = TCompatibleArgs<[TKey, TOnToggleExpansionParams | undefined]>;
type TCompatibleArgsWithOptionalKeys = TCompatibleArgs<[TKey[] | undefined]>;
type TClearCompatibilityProps = {
    isExpanded(...arg0: TCompatibleArgsWithKey[]): boolean;
    isExpandAll(...arg0: TCompatibleArgsWithOptionalKeys[]): boolean;
    expand(...arg0: TCompatibleArgsWithKey): Promise<void>;
    collapse(...arg0: TCompatibleArgsWithKey): Promise<void>;
    toggleExpansion(...arg0: TCompatibleOnExpanderClickArgs): void;
    resetExpansion(...arg0: TCompatibleArgs): void;
    onExpanderClick(...arg0: TCompatibleOnExpanderClickArgs): void;
    getExpandedItemsCompatible(...arg0: TCompatibleArgs): TKey[];
    beforeStatDragCompatible(...arg0: TCompatibleArgsWithKey): void;
};

export type TBaseTreeControlEmulationCompatibility = typeof SlicelessBaseTreeCompatibility &
    TBaseControlEmulationCompatibility &
    TClearCompatibilityProps;

const TreeOwnBaseControlEmulationCompatibility = React.forwardRef(
    (
        props: TBaseTreeControlEmulationCompatibilityProps & {
            realContent: JSX.Element;
        },
        ref: TBaseControlEmulationCompatibilityRef
    ): JSX.Element => {
        const isControlDividedWithSlice = React.useMemo(
            () => helpers.isControlDividedWithSlice(props),
            [props]
        );

        const expandResolver = React.useRef<{ resolver?: () => void; isLoading?: boolean }>({});
        const collapseResolver = React.useRef<{ resolver?: () => void; isLoading?: boolean }>({});

        React.useEffect(() => {
            if (isControlDividedWithSlice) {
                if (expandResolver.current.resolver) {
                    if (props.loading) {
                        expandResolver.current.isLoading = true;
                    } else {
                        expandResolver.current.resolver();
                        expandResolver.current.resolver = undefined;
                        expandResolver.current.isLoading = false;
                    }
                }

                if (collapseResolver.current.resolver) {
                    if (props.loading) {
                        collapseResolver.current.isLoading = true;
                    } else {
                        collapseResolver.current.resolver();
                        collapseResolver.current.resolver = undefined;
                        collapseResolver.current.isLoading = false;
                    }
                }
            }
        }, [isControlDividedWithSlice, props.loading]);

        const isExpanded = React.useCallback(
            (...args: TCompatibleArgsWithKey): boolean => {
                if (isControlDividedWithSlice) {
                    // Чистая схема, прокся в слайс
                    return props.isExpanded(args[0]);
                } else {
                    // Схема без слайсов
                    return getSlicelessBaseTreeCompatibility().OldTreeLogic.isExpanded(...args);
                }
            },
            [isControlDividedWithSlice, props]
        );

        const expand = React.useCallback(
            (
                key: TKey,
                params: TOnToggleExpansionParams | undefined,
                treeControl: BaseTreeControl,
                options: IBaseTreeControlOptions
            ) => {
                const clearArgs = [key, treeControl, options] as const;

                if (isControlDividedWithSlice) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    treeControl._displayGlobalIndicator();
                    // Эмуляция асинхронной работы метода и поддержка нотификации.
                    return Promise.resolve(NotificationCompatibility.beforeItemExpand(...clearArgs))
                        .then(() =>
                            new Promise<void>((resolver) => {
                                expandResolver.current.resolver = resolver;
                                props.expand(key, params);
                                // TODO: объяснить про микротаски при wasaby от вызова expand через wasabyCompatibility.
                                //  + объяснить что это вообще такое за код, что решает.
                                setTimeout(() => {
                                    if (
                                        expandResolver.current.resolver &&
                                        !expandResolver.current.isLoading
                                    ) {
                                        expandResolver.current.resolver();
                                    }
                                });
                            }).then(() => {
                                NotificationCompatibility.afterItemExpand(...clearArgs);
                            })
                        )
                        .finally(() => {
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
                    return getSlicelessBaseTreeCompatibility().OldTreeLogic.expand(...clearArgs);
                }
            },
            [isControlDividedWithSlice, props]
        );

        const collapse = React.useCallback(
            (
                key: TKey,
                params: TOnToggleExpansionParams | undefined,
                treeControl: BaseTreeControl,
                options: IBaseTreeControlOptions
            ): Promise<void> => {
                const clearArgs = [key, treeControl, options] as const;
                if (isControlDividedWithSlice) {
                    // Эмуляция асинхронной работы метода и поддержка нотификации.
                    return Promise.resolve(
                        NotificationCompatibility.beforeItemCollapse(...clearArgs)
                    )
                        .then(() =>
                            new Promise<void>((resolve) => {
                                // Чистая схема, прокся в слайс
                                collapseResolver.current.resolver = resolve;
                                props.collapse(key, params);
                                // TODO: объяснить про микротаски при wasaby от вызова expand через wasabyCompatibility.
                                //  + объяснить что это вообще такое за код, что решает.
                                setTimeout(() => {
                                    if (
                                        collapseResolver.current.resolver &&
                                        !collapseResolver.current.isLoading
                                    ) {
                                        collapseResolver.current.resolver();
                                    }
                                });
                            }).then(() => {
                                NotificationCompatibility.afterItemCollapse(...clearArgs);
                            })
                        )
                        .finally(() => {
                            NotificationCompatibility.itemCollapse(...clearArgs);
                        });
                } else {
                    // Схема без слайсов
                    return getSlicelessBaseTreeCompatibility().OldTreeLogic.collapse(...clearArgs);
                }
            },
            [isControlDividedWithSlice, props]
        );

        const toggleExpansion = React.useCallback(
            (
                key: TKey,
                params: TOnToggleExpansionParams | undefined,
                treeControl: BaseTreeControl,
                options: IBaseTreeControlOptions
            ) => {
                const clearArgs = [key, treeControl, options] as const;

                if (isControlDividedWithSlice) {
                    // FIXME: Подумать
                    //  Зацепил нотификацию именно на expand и collapse,
                    //  поэтому не могу просто позвать props.toggleExpansion(...)
                    if (isExpanded(...clearArgs)) {
                        return collapse(key, params, treeControl, options);
                    } else {
                        return expand(key, params, treeControl, options);
                    }
                } else {
                    return Promise.resolve().then(() => {
                        // Схема без слайсов
                        const oldTreeLogic = getSlicelessBaseTreeCompatibility().OldTreeLogic;
                        if (oldTreeLogic.isExpanded(...clearArgs)) {
                            return oldTreeLogic.collapse(...clearArgs);
                        } else {
                            return oldTreeLogic.expand(...clearArgs);
                        }
                    });
                }
            },
            [collapse, expand, isControlDividedWithSlice, isExpanded]
        );

        const compatibility = React.useMemo<TClearCompatibilityProps>(
            () => ({
                getExpandedItemsCompatible(...[treeControl, options]: TCompatibleArgs) {
                    if (isControlDividedWithSlice) {
                        // Чистая схема, прокся в слайс
                        return options.expandedItems;
                    } else {
                        // Схема без слайсов
                        return getSlicelessBaseTreeCompatibility().OldTreeLogic.getExpandedItems(
                            treeControl
                        );
                    }
                },
                // Действие перед началом драга записи. Требуется свернуть запись.
                beforeStatDragCompatible(
                    key: TKey,
                    treeControl: BaseTreeControl,
                    options: IBaseTreeControlOptions
                ): void {
                    if (isControlDividedWithSlice) {
                        collapse(key, undefined, treeControl, options);
                    } else {
                        // Схема без слайсов
                        getSlicelessBaseTreeCompatibility().OldTreeLogic.beforeStatDrag(
                            key,
                            treeControl,
                            options
                        );
                    }
                },
                isExpandAll(...args: TCompatibleArgsWithOptionalKeys): boolean {
                    if (isControlDividedWithSlice) {
                        // Чистая схема, прокся в слайс
                        return props.isExpandAll();
                    } else {
                        // Схема без слайсов
                        return getSlicelessBaseTreeCompatibility().OldTreeLogic.isExpandAll(
                            ...args
                        );
                    }
                },
                isExpanded,
                expand: (
                    key: TKey,
                    treeControl: BaseTreeControl,
                    options: IBaseTreeControlOptions
                ) => expand(key, {}, treeControl, options),
                collapse: (
                    key: TKey,
                    treeControl: BaseTreeControl,
                    options: IBaseTreeControlOptions
                ) => collapse(key, {}, treeControl, options),
                resetExpansion(...[treeControl]: TCompatibleArgs): void {
                    if (isControlDividedWithSlice) {
                        // Чистая схема, прокся в слайс
                        props.resetExpansion();
                    } else {
                        // Схема без слайсов
                        getSlicelessBaseTreeCompatibility().OldTreeLogic.resetExpandedItems(
                            treeControl
                        );
                    }
                },
                onExpanderClick: toggleExpansion,
                toggleExpansion,

                ...(!helpers.isControlDividedWithSlice(props)
                    ? getSlicelessBaseTreeCompatibility().SlicelessBaseTreeCompatibility
                    : {}),
            }),
            [isControlDividedWithSlice, collapse, props]
        );

        return React.cloneElement(props.realContent, {
            forwardedRef: ref,
            ...props,
            ...compatibility,
            children: undefined,
        });
    }
);

export const BaseTreeControlEmulationCompatibility = React.forwardRef(
    (
        props: TBaseTreeControlEmulationCompatibilityProps,
        ref: TBaseControlEmulationCompatibilityRef
    ) => {
        return (
            <BaseControlEmulationCompatibility {...props} ref={ref}>
                {/* realContent предотвращает, зацикливание рендеринга из-за коллизии имен при React.cloneElement (children) */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <TreeOwnBaseControlEmulationCompatibility {...props} realContent={props.children} />
            </BaseControlEmulationCompatibility>
        );
    }
);

TreeOwnBaseControlEmulationCompatibility.displayName =
    'Controls/baseTree:TreeOwnBaseControlEmulationCompatibility';
BaseTreeControlEmulationCompatibility.displayName =
    'Controls/baseTree:BaseTreeControlEmulationCompatibility';

export default BaseTreeControlEmulationCompatibility;
