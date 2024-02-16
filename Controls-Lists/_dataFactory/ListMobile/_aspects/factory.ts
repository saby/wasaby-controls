import type { IListAspects } from 'Controls/dataFactory';

import { AspectsNames } from 'Controls/dataFactory';
import { expandCollapseStateManagerFactory } from 'Controls/expandCollapseListAspect';
import { itemsStateManagerFactory } from 'Controls/itemsListAspect';
import { pathStateManagerFactory } from 'Controls/pathListAspect';
import { flatSelectionStateManagerFactory } from 'Controls/flatSelectionAspect';
import { rootStateManagerFactory } from 'Controls/rootListAspect';
import { markerStateManagerFactory } from 'Controls/markerListAspect';

export function createAspects(): IListAspects {
    const aspectsMap: IListAspects = new Map();
    return aspectsMap
        .set(AspectsNames.Items, itemsStateManagerFactory())
        .set(AspectsNames.Marker, markerStateManagerFactory())
        .set(AspectsNames.Selection, flatSelectionStateManagerFactory())
        .set(AspectsNames.Path, pathStateManagerFactory())
        .set(AspectsNames.ExpandCollapse, expandCollapseStateManagerFactory())
        .set(AspectsNames.Root, rootStateManagerFactory());
}
