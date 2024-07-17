/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TKey } from 'Controls/_interface/IItems';
import { RecordSet } from 'Types/collection';
import { TSortingOptionValue } from 'Controls/_interface/ISorting';
import { withWasabyEventObject } from 'UICore/Events';
import { Control } from 'UICore/Base';
import { process } from 'Controls/error';
import { IGetHandlersProps } from './IGetHandlersProps';
import * as React from 'react';
import type { RegisterClass } from 'Controls/event';

interface IGetHandlersOldProps extends IGetHandlersProps {
    selectedTypeRegister: RegisterClass;
}

function getHandlersOld(
    props: IGetHandlersOldProps & {
        rootLoadingRef: React.MutableRefObject<Record<TKey, boolean | unknown>>;
    }
) {
    const { slice, selectedTypeRegister, rootLoadingRef, storeId } = props;
    return {
        onRootChanged(root: TKey): void {
            if (rootLoadingRef.current[root]) {
                rootLoadingRef.current[root]
                    .then((items: RecordSet) => {
                        slice.unobserveChanges();
                        slice.state.sourceController.setRoot(root);
                        slice.observeChanges();
                        slice.setItems(items, root);
                    })
                    .finally(() => {
                        delete rootLoadingRef.current[root];
                    });
            } else {
                slice.changeRoot(root);
            }
        },
        onBeforeRootChanged(root: TKey): void {
            if (props.preloadRoot && !rootLoadingRef.current[root]) {
                rootLoadingRef.current[root] = slice.load(undefined, root, undefined, false);
            }
        },
        onSelectedKeysChanged(selectedKeys: TKey[]): void {
            slice.setState({
                selectedKeys,
            });
        },
        onExcludedKeysChanged(excludedKeys: TKey[]): void {
            slice.setState({
                excludedKeys,
            });
        },
        onListSelectedKeysCountChanged(count: number | null, isAllSelected: boolean): void {
            slice.setSelectionCount(count, isAllSelected, storeId);
        },
        onExpandedItemsChanged(expandedItems: TKey[]): void {
            slice.setState({
                expandedItems,
            });
        },
        onMarkedKeyChanged(markedKey: TKey): void {
            slice.setState({
                markedKey,
            });
        },
        onSortingChanged(sorting: TSortingOptionValue): void {
            slice.setState({
                sorting,
            });
        },
        onRegister: withWasabyEventObject(
            (
                event: Event,
                registerType: string,
                component: Control,
                callback: Function,
                config: object
            ): void => {
                selectedTypeRegister.register(event, registerType, component, callback, config);
            }
        ),
        onLoadExpandedItem(nodeKey: TKey): Promise<RecordSet | Error> | void {
            if (!slice.hasLoaded(nodeKey)) {
                return slice.load(void 0, nodeKey);
            }
        },
        onDataError(errorConfig: { error: Error }): void {
            if (errorConfig.error) {
                process(errorConfig);
            }
        },
    };
}

export function useHandlersOld({
    storeId,
    slice,
    context,
    changeRootByItemClick,
    selectedTypeRegister,
}: IGetHandlersOldProps) {
    const rootLoadingRef = React.useRef({});

    return React.useMemo(
        () =>
            getHandlersOld({
                storeId,
                slice,
                selectedTypeRegister,
                context,
                changeRootByItemClick,
                rootLoadingRef,
            }),
        [storeId, slice, selectedTypeRegister, context, changeRootByItemClick]
    );
}
