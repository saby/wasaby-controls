import * as React from 'react';
import HierarchySliceContext from './HierarchySliceContext/HierarchySliceContext';
import NodeContext from './ISolatedNodeContext';

/**
 *
 * @param path
 */
export default function useData(path: string[]): unknown {
    const rootContext = React.useContext(HierarchySliceContext);
    const nodeContext = React.useContext(NodeContext);

    return React.useMemo(() => {
        const dataContext = rootContext.store.getDataContext();
        return dataContext.getAPI(nodeContext.path).getValue(path);
    }, [path, nodeContext]);
}
