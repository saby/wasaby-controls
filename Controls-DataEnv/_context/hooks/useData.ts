import * as React from 'react';
import HierarchySliceContext from '../contexts/HierarchySliceContext';
import NodeContext from '../contexts/ISolatedNodeContext';
import { CONTEXT_STORE_FIELD } from '../Constants';

/**
 *
 * @param path
 */
export default function useData(path: string[]): unknown {
    const rootContext = React.useContext(HierarchySliceContext);
    const nodeContext = React.useContext(NodeContext);

    return React.useMemo(() => {
        const dataContext = rootContext[CONTEXT_STORE_FIELD].getDataContext();
        return dataContext.getAPI(nodeContext.path).getValue(path);
    }, [path, nodeContext]);
}
