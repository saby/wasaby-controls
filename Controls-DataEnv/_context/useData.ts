import * as React from 'react';
import SliceContext from './FlatSliceContext/SliceContext';
import HierarchySliceContext from './HierarchySliceContext/HierarchySliceContext';
import { ISOLATED_ROOT_NAME_FIELD } from './Constants';

/**
 *
 * @param path
 */
export default function useData(path: string[]): unknown {
    const sliceContext = React.useContext(SliceContext);
    const rootContext = React.useContext(HierarchySliceContext);

    return React.useMemo(() => {
        const isolatedNodeName: string = sliceContext?.[
            ISOLATED_ROOT_NAME_FIELD
        ] as unknown as string;

        const dataContext = rootContext.store.getDataContext();

        if (isolatedNodeName) {
            dataContext.setCurrentNode(isolatedNodeName);
        }

        return dataContext.get(path);
    }, [path, sliceContext, rootContext]);
}
