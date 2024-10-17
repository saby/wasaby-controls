import { RecordSet } from 'Types/collection';
import {
    List,
    ListSlice,
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls/dataFactory';
import { Direction } from 'Controls/interface';
import { IRouter } from 'Router/router';

function hasSingleGroupNode(items: RecordSet): boolean {
    let count = 0;
    items.each((item) => {
        if (item.get('nodeType') === 'group') {
            count++;
        }
    });
    return count === 1;
}

function modifyLoadedData(items: RecordSet): void {
    const meta = items.getMetaData();
    items.setMetaData({
        ...meta,
        singleGroupNode: hasSingleGroupNode(items),
    });
}

function loadData(
    config: IListDataFactoryArguments,
    dependenciesResults: {},
    Router: IRouter
): Promise<IListDataFactoryLoadResult> {
    return List.loadData(config, dependenciesResults, Router).then(
        (loadResult: IListDataFactoryLoadResult) => {
            modifyLoadedData(loadResult.data);
            return loadResult;
        }
    );
}

class ExtendedSlice extends ListSlice {
    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        modifyLoadedData(items);
        return super._dataLoaded(items, direction, nextState);
    }
}

const slice = ExtendedSlice;

export { loadData, slice };
