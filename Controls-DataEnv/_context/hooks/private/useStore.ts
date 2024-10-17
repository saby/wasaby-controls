import { IDataContextConfigs } from 'Controls-DataEnv/dataFactory';
import { useContext, useRef, useMemo, useEffect } from 'react';
import useContextNode from 'Controls-DataEnv/_context/hooks/useContextNode';
import RootContext from '../../contexts/HierarchySliceContext';
import {
    CONTEXT_STORE_FIELD,
    CONTEXT_NODE_PATH,
    STORE_ROOT_NODE_KEY,
} from 'Controls-DataEnv/_context/Constants';
import { applied } from 'Types/entity';
import Store, { IHierarchicalStoreProps } from 'Controls-DataEnv/_context/store/Store';
import { getWasabyContext } from 'UICore/Contexts';

export default function useStore(
    dataContextConfigs: IDataContextConfigs,
    onChange: IHierarchicalStoreProps['onChange'],
    getSlicesConfig: IHierarchicalStoreProps['getSlicesConfig'],
    getSlicesContextNodeName: IHierarchicalStoreProps['getSlicesContextNodeName']
): {
    store: Store;
    rootKey: string;
} {
    const rootContext = useContext(RootContext);
    const wasabyContext = useContext(getWasabyContext());
    const contextNode = useContextNode();
    const rootNodeConfigRef = useRef<IDataContextConfigs>();
    const parentPath = contextNode[CONTEXT_NODE_PATH] || [];
    const rootKey = useMemo(() => {
        return rootContext && parentPath.length
            ? `${applied.Guid.create()}__root`
            : STORE_ROOT_NODE_KEY;
    }, []);
    const currentRootPath = useMemo(() => {
        return [...parentPath, rootKey];
    }, []);

    const storeRef = useRef<Store>();

    const store = useMemo(() => {
        if (rootContext && parentPath.length) {
            return rootContext[CONTEXT_STORE_FIELD];
        } else {
            const storeProps: IHierarchicalStoreProps = {
                //@ts-ignore
                dataConfigs: dataContextConfigs,
                onChange,
                router: wasabyContext.Router,
                getSlicesConfig,
                getSlicesContextNodeName,
            };
            return new Store(storeProps);
        }
    }, [
        onChange,
        wasabyContext.Router,
        dataContextConfigs,
        getSlicesConfig,
        getSlicesContextNodeName,
    ]);

    storeRef.current = store;

    const rootConfigs = useMemo(() => {
        //@ts-ignore
        const rootConfigs = dataContextConfigs.contextConfigs || dataContextConfigs;

        return rootConfigs.hasOwnProperty(STORE_ROOT_NODE_KEY)
            ? rootConfigs[STORE_ROOT_NODE_KEY]
            : rootConfigs;
    }, [dataContextConfigs]);

    if (!rootNodeConfigRef.current) {
        if (parentPath.length) {
            store.createRoot(
                parentPath,
                rootKey,
                //@ts-ignore
                rootConfigs,
                onChange
            );
        }
    } else if (rootContext && rootNodeConfigRef.current !== dataContextConfigs) {
        store.updateNode(
            currentRootPath, //@ts-ignore
            rootConfigs
        );
    }

    rootNodeConfigRef.current = dataContextConfigs;

    useEffect(() => {
        return () => {
            store.destroyNode(currentRootPath);
        };
    }, []);

    return { store, rootKey };
}
