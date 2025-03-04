/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ComponentType, useEffect, useState } from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';

import type { TWithInteractorProvidedProps } from './withInteractor';
import type { Collection as ICollection } from 'Controls/display';

/**
 * Опции, поставляемые HOC'ом withCollectionVersion.
 * @see withCollectionVersion
 */
export type TWithCollectionVersionProvidedProps = {
    collectionVersion: number;
};

/**
 * HOC позволяющий обернутому компоненту следить за версией коллекции списка.
 * @param Component Оборачиваемый компонент, чаще всего - render спсика.
 */
export function withCollectionVersion<
    TOuter extends TWithInteractorProvidedProps<IAbstractListAPI, IAbstractListState>,
>(Component: ComponentType<TOuter & TWithCollectionVersionProvidedProps>) {
    function Composed(props: TOuter) {
        const collectionVersion = useCollectionVersion(props.viewModelState.collection);
        return <Component {...props} collectionVersion={collectionVersion} />;
    }

    Composed.displayName = `withCollectionVersion(${Component.displayName || Component.name})`;

    return Composed;
}

/**
 * Хук, возвращающий текущую версию коллекции списка.
 * @param collection Коллекция списка.
 */
function useCollectionVersion(collection?: ICollection): number {
    const [collectionVersion, setCollectionVersion] = useState(0);

    useEffect(() => {
        const onCollectionChange = () => {
            setCollectionVersion(collection ? collection.getVersion() : -1);
        };

        collection?.subscribe('onAfterCollectionChange', onCollectionChange);
        return () => {
            collection?.unsubscribe('onAfterCollectionChange', onCollectionChange);
        };
    }, [collection]);

    return collectionVersion;
}

export default withCollectionVersion;
