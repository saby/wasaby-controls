/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';
import { GridSelectionContext } from '../gridSelectionContext/GridSelectionContext';
import { RowSelectionContext, IRowSelectionContext } from './RowSelectionContext';
import { TItemKey } from '../../../shared/types';
import useVersion from '../../shared/useVersion';
import { IBorderRadius } from 'Controls-Lists/_dynamicGrid/selection/components/SelectionHighlight';

export interface IRowSelectionContextProviderProps {
    children: JSX.Element;
    itemKey: TItemKey;
    borderRadius: IBorderRadius;
}

export function RowSelectionContextProvider(props: IRowSelectionContextProviderProps): JSX.Element {
    const isMountedRef = React.useRef<boolean>(false);
    const gridContext = React.useContext(GridSelectionContext);
    const rowSelectionModel = gridContext.getRowSelectionModel(props.itemKey);
    const contextRefForHandlersOnly = React.useRef<IRowSelectionContext>();
    const [version, incrementVersion] = useVersion();

    React.useLayoutEffect(() => {
        if (isMountedRef.current) {
            incrementVersion();
        }
    }, [rowSelectionModel]);

    const getMultiSelectAccessibility = React.useCallback<
        IRowSelectionContext['getMultiSelectAccessibility']
    >(
        (columnKey) => {
            return gridContext.multiSelectAccessibilityCallback(props.itemKey, columnKey);
        },
        [props.itemKey, gridContext.multiSelectAccessibilityCallback]
    );

    const isSelected = React.useCallback<IRowSelectionContext['isSelected']>(
        (columnKey) => {
            return gridContext.contextRefForHandlersOnly.current.isSelected(
                props.itemKey,
                columnKey
            );
        },
        [props.itemKey]
    );

    const handleSelection = React.useCallback<IRowSelectionContext['handleSelection']>(
        (columnKey) => {
            return gridContext.contextRefForHandlersOnly.current.handleSelection(
                props.itemKey,
                columnKey
            );
        },
        [props.itemKey]
    );

    const getRowSelectionModel = React.useCallback<
        IRowSelectionContext['getRowSelectionModel']
    >(() => {
        return gridContext.contextRefForHandlersOnly.current.getRowSelectionModel(props.itemKey);
    }, [props.itemKey]);

    const getCellsSelectionModel = React.useCallback<
        IRowSelectionContext['getCellsSelectionModel']
    >(
        (columnKey) => {
            return gridContext.contextRefForHandlersOnly.current.getCellsSelectionModel(
                props.itemKey,
                columnKey
            );
        },
        [props.itemKey]
    );

    const getBoundingSelectionKeys = React.useCallback<
        IRowSelectionContext['getBoundingSelectionKeys']
    >(
        (columnKey) => {
            return gridContext.contextRefForHandlersOnly.current.getBoundingSelectionKeys(
                props.itemKey,
                columnKey
            );
        },
        [props.itemKey]
    );

    React.useLayoutEffect(() => {
        isMountedRef.current = true;
    }, []);

    const contextValue = React.useMemo<IRowSelectionContext>(() => {
        const value: IRowSelectionContext = {
            contextRefForHandlersOnly,
            isEnabled: gridContext.isEnabled,
            isSelectionInitialized: gridContext.isSelectionInitialized,
            itemsSpacing: gridContext.itemsSpacing,
            columnsSpacing: gridContext.columnsSpacing,
            itemKey: props.itemKey,
            borderRadius: props.borderRadius,
            isSelected,
            handleSelection,
            getRowSelectionModel,
            getCellsSelectionModel,
            getBoundingSelectionKeys,
            getMultiSelectAccessibility,
        };
        contextRefForHandlersOnly.current = value;
        return value;
    }, [
        props.itemKey,
        gridContext.isEnabled,
        gridContext.isSelectionInitialized,
        gridContext.itemsSpacing,
        gridContext.columnsSpacing,

        isSelected,
        handleSelection,
        getRowSelectionModel,
        getCellsSelectionModel,
        getBoundingSelectionKeys,
        getMultiSelectAccessibility,

        version,
    ]);

    return <RowSelectionContext.Provider value={contextValue} children={props.children} />;
}

const RowSelectionContextProviderMemo = React.memo((props: IRowSelectionContextProviderProps) => {
    const gridContext = React.useContext(GridSelectionContext);
    if (gridContext && gridContext.isEnabled) {
        return <RowSelectionContextProvider {...props} />;
    } else {
        return props.children;
    }
});

export default RowSelectionContextProviderMemo;
