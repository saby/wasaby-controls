/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';

import type { TViewModelProvidedProps } from './ViewModel';
import type { Collection as ICollection } from 'Controls/display';

export type TUseCollectionVersionHook = (collection: ICollection) => number;

export type TCollectionVersionProvidedProps = {
    collectionVersion: number;
};

export function withCollectionVersion<
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
    TOuter,
>(
    Component: React.ComponentType<
        TOuter &
            TViewModelProvidedProps<TAbstractListAPI, TAbstractListState> &
            TCollectionVersionProvidedProps
    >,
    useCollectionVersionHook: TUseCollectionVersionHook
): React.ComponentType<TOuter & TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>> {
    function Composed(
        props: TOuter & TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>
    ) {
        const collectionVersion = useCollectionVersionHook(props.viewModelState.collection);
        return <Component collectionVersion={collectionVersion} {...props} />;
    }

    Composed.displayName = `withCollectionVersion(${Component.displayName || Component.name})`;

    return Composed;
}
