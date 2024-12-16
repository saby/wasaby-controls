/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import type { Collection as ICollection } from 'Controls/display';

export function useCollectionVersion(collection: ICollection): number {
    const [collectionVersion, setCollectionVersion] = React.useState(0);

    React.useEffect(() => {
        const onCollectionChange = () => {
            setCollectionVersion(collection.getVersion());
        };

        collection.subscribe('onAfterCollectionChange', onCollectionChange);
        return () => {
            collection.unsubscribe('onAfterCollectionChange', onCollectionChange);
        };
    }, [collection]);

    return collectionVersion;
}
