import { ListSlice } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { expandCollapseStateManagerFactory } from 'Controls/listAspects';
import { pathStateManagerFactory } from 'Controls/listAspects';
import { hierarchySelectionStateManagerFactory } from 'Controls/listAspects';
import { rootStateManagerFactory } from 'Controls/listAspects';
import { markerStateManagerFactory } from 'Controls/listAspects';

function stringify(obj: unknown): string {
    return JSON.stringify(obj, null, '\t');
}

function getRecordSetDescription(rs: RecordSet) {
    return {
        module: rs._moduleName,
        length: rs.getCount(),
    };
}

function getModelDescription(m: Model) {
    return {
        module: m._moduleName,
        rawData: m.getRawData(),
    };
}

export default function (slice: ListSlice): string {
    const logState = {
        items: slice.state.items,
        ...expandCollapseStateManagerFactory().getNextState(slice.state, []),
        ...markerStateManagerFactory().getNextState(slice.state, []),
        ...pathStateManagerFactory().getNextState(slice.state, []),
        ...rootStateManagerFactory().getNextState(slice.state, []),
        ...hierarchySelectionStateManagerFactory().getNextState(slice.state, []),
    };

    if (logState.collection) {
        logState.collection = logState.collection._moduleName;
    }

    Object.keys(logState).forEach((propName) => {
        const value = logState[propName];
        if (value instanceof RecordSet) {
            logState[propName] = getRecordSetDescription(value);
        } else if (value instanceof Model) {
            logState[propName] = getModelDescription(value);
        } else if (value instanceof Array) {
            logState[propName] = value.map((i) =>
                i instanceof Model ? getModelDescription(i) : i
            );
        } else if (value instanceof Map) {
            logState[propName] = [...value.entries()];
        }
    });

    return stringify(logState);
}
