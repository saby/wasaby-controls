/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import type { TreeGridCollection } from 'Controls/treeGrid';
import { MultiSelectAccessibility } from 'Controls/display';
import type { TOffsetSize } from 'Controls/interface';
import { useHandler } from 'Controls/Hooks/useHandler';
import { GridSelectionContext, IGridSelectionContext } from './GridSelectionContext';
import {
    TCellsMultiSelectAccessibilityCallback,
    TOnSelectionChangedCallback,
    TOnBeforeSelectionChangeCallback,
    TCellsMultiSelectVisibility,
} from '../../shared/interface';
import { ISelection, SelectionModel } from '../../SelectionModel';
import type { TColumnKeys } from '../../shared/types';
import useVersion from '../../shared/useVersion';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

export interface IGridSelectionContextProviderProps {
    children: JSX.Element;
    collectionRef?: React.MutableRefObject<TreeGridCollection>;
    columns: TColumnKeys;
    multiSelectVisibility: TCellsMultiSelectVisibility;
    multiSelectAccessibilityCallback?: TCellsMultiSelectAccessibilityCallback;
    selection: ISelection;
    onSelectionChanged?: TOnSelectionChangedCallback;
    onBeforeSelectionChange?: TOnBeforeSelectionChangeCallback;
    itemsSpacing: TOffsetSize;
    columnsSpacing: TOffsetSize;
}

function multiSelectDefaultAccessibilityCallback() {
    return MultiSelectAccessibility.enabled;
}

export function GridSelectionContextProvider(
    props: IGridSelectionContextProviderProps,
    forwardedRef: React.ForwardedRef<unknown>
): JSX.Element {
    const isMountedRef = React.useRef<boolean>(false);
    const contextRefForHandlersOnly = React.useRef<IGridSelectionContext>();
    const [version, incrementVersion] = useVersion();

    const [isSelectionInitialized, setIsSelectionInitialized] = React.useState(false);

    const initializeSelection = React.useCallback(() => {
        if (!isSelectionInitialized) {
            loadAsync('Controls/checkbox').then(() => {
                setIsSelectionInitialized(true);
            });
        }
    }, [isSelectionInitialized]);

    const selectionRef = React.useRef<ISelection>();

    const selectionModel = React.useMemo(() => {
        const c = new SelectionModel({
            columns: props.columns,
            collectionRef: props.collectionRef,
            selection: props.selection || {},
        });

        selectionRef.current = c.getSelection();

        return c;
    }, []);

    React.useLayoutEffect(() => {
        return () => {
            selectionModel.destroy();
        };
    }, []);

    // Вызов нотификации об изменении выделения, статический обработчик.
    const notifyBeforeSelectionChanged = useHandler(
        React.useCallback(
            (oldSelectionGetter: () => ISelection, newSelectionGetter: () => ISelection) => {
                return props.onBeforeSelectionChange
                    ? props.onBeforeSelectionChange(oldSelectionGetter(), newSelectionGetter())
                    : newSelectionGetter();
            },
            [props.onBeforeSelectionChange]
        )
    );

    // Вызов нотификации об изменении выделения, статический обработчик.
    const notifySelectionChanged = useHandler(
        React.useCallback(
            (selection: ISelection) => {
                if (props.onSelectionChanged) {
                    props.onSelectionChanged(selection);
                }
            },
            [props.onSelectionChanged]
        )
    );

    // Обновилось выделение в опциях.
    React.useLayoutEffect(() => {
        if (selectionModel.updateSelection(props.selection)) {
            incrementVersion();
            selectionRef.current = selectionModel.getSelection();
            // При изменении опции выделения не нотифицируем об изменениях.
        }
    }, [props.selection]);

    // Обновились колонки, выделение не может поменяться, т.к. в DynamicGrid
    // это всегда просто сдвиг колонок. Стили выделений обновятся, но набор - нет.
    React.useLayoutEffect(() => {
        if (isMountedRef.current) {
            selectionModel.updateColumns(props.columns);
            incrementVersion();
        }
    }, [props.columns]);

    const multiSelectAccessibilityCallback =
        React.useMemo<TCellsMultiSelectAccessibilityCallback>(() => {
            return (
                props.multiSelectAccessibilityCallback || multiSelectDefaultAccessibilityCallback
            );
        }, [props.multiSelectAccessibilityCallback]);

    const getBoundingSelectionKeys = React.useCallback<
        IGridSelectionContext['getBoundingSelectionKeys']
    >((itemKey, columnKey) => selectionModel.getBoundingSelectionKeys(itemKey, columnKey), []);

    const isSelected = React.useCallback<IGridSelectionContext['isSelected']>(
        (itemKey, columnKey) => selectionModel.isSelected(itemKey, columnKey),
        []
    );

    const getRowSelectionModel = React.useCallback<IGridSelectionContext['getRowSelectionModel']>(
        (itemKey) => selectionModel.getRowSelectionModel(itemKey),
        []
    );

    const getCellsSelectionModel = React.useCallback<
        IGridSelectionContext['getCellsSelectionModel']
    >((itemKey, columnKey) => selectionModel.getCellsSelectionModel(itemKey, columnKey), []);

    const handleSelection = React.useCallback<IGridSelectionContext['handleSelection']>(
        (itemKey, columnKey) => {
            const newSelection = notifyBeforeSelectionChanged(
                () => SelectionModel.clone(selectionModel.getSelection()),
                () =>
                    SelectionModel.mergeSelectionsWithToggle(selectionModel.getSelection(), {
                        [itemKey]: [columnKey],
                    })
            );
            if (selectionModel.updateSelection(newSelection)) {
                incrementVersion();
                selectionRef.current = selectionModel.getSelection();
                notifySelectionChanged(selectionRef.current);
            }
        },
        []
    );

    const showCellsSelection = React.useCallback<IGridSelectionContext['showCellsSelection']>(
        (itemKey, columnKey) => {
            selectionModel.toggleSelectionVisibility(itemKey, columnKey, false);
            incrementVersion();
        },
        []
    );

    const hideCellsSelection = React.useCallback<IGridSelectionContext['hideCellsSelection']>(
        (itemKey, columnKey) => {
            selectionModel.toggleSelectionVisibility(itemKey, columnKey, true);
            incrementVersion();
        },
        []
    );

    const changeSelection = React.useCallback<IGridSelectionContext['changeSelection']>(
        (oldPartialPlainSelection, newPartialPlainSelection) => {
            const newSelection = notifyBeforeSelectionChanged(
                () => SelectionModel.clone(selectionModel.getSelection()),
                () =>
                    SelectionModel.mergeSelections(
                        SelectionModel.removeSelections(
                            selectionModel.getSelection(),
                            oldPartialPlainSelection
                        ),
                        SelectionModel.filterSelections(
                            newPartialPlainSelection,
                            (itemKey, columnKey) =>
                                multiSelectAccessibilityCallback(itemKey, columnKey) ===
                                MultiSelectAccessibility.enabled
                        )
                    )
            );

            if (selectionModel.updateSelection(newSelection)) {
                incrementVersion();
                selectionRef.current = selectionModel.getSelection();
                notifySelectionChanged(selectionRef.current);
            }
        },
        []
    );

    React.useLayoutEffect(() => {
        isMountedRef.current = true;
    }, []);

    const contextValue = React.useMemo<IGridSelectionContext>(() => {
        const value: IGridSelectionContext = {
            contextRefForHandlersOnly,

            itemsSpacing: props.itemsSpacing,
            columnsSpacing: props.columnsSpacing,
            isEnabled: props.multiSelectVisibility !== 'hidden',
            multiSelectAccessibilityCallback,

            isSelectionInitialized,
            initializeSelection,

            handleSelection,
            isSelected,
            getRowSelectionModel,
            getCellsSelectionModel,
            showCellsSelection,
            hideCellsSelection,
            getBoundingSelectionKeys,
            changeSelection,
        };
        contextRefForHandlersOnly.current = value;
        return value;
    }, [
        props.multiSelectVisibility,
        props.itemsSpacing,
        props.columnsSpacing,
        isSelectionInitialized,
        initializeSelection,
        multiSelectAccessibilityCallback,
        version,
    ]);

    return (
        <GridSelectionContext.Provider value={contextValue}>
            {React.cloneElement(props.children as JSX.Element, {
                forwardedRef,
            })}
        </GridSelectionContext.Provider>
    );
}

const GridSelectionContextProviderMemo = React.memo(React.forwardRef(GridSelectionContextProvider));

export default GridSelectionContextProviderMemo;
