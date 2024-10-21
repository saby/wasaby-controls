/**
 * @kaizen_zone e0faa54f-0242-4b8d-a3c5-10c9d5cf59b8
 */
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import type { GridCollection } from 'Controls/grid';
import type { ListSlice } from 'Controls/dataFactory';

/**
 * Хук для отслеживания версии коллекции
 * @private
 */
export function useCollectionVersion(storeId: string): number {
    const ctx = React.useContext(DataContext);
    const slice = ctx?.[storeId] as unknown as ListSlice;

    const collection = slice.collection as unknown as GridCollection;

    const [collectionVersion, setCollectionVersion] = React.useState(0);

    React.useEffect(() => {
        const onCollectionChange = () => {
            setCollectionVersion(collection.getVersion());
        };

        collection.subscribe('onAfterCollectionChange', onCollectionChange);
        return () => {
            collection.unsubscribe('onAfterCollectionChange', onCollectionChange);
        };
    }, [collection, slice]);

    return collectionVersion;
}
