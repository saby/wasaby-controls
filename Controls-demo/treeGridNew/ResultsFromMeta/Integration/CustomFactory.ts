import { RecordSet } from 'Types/collection';
import {
    List,
    ListSlice,
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls/dataFactory';
import { Direction } from 'Controls/interface';
import { Model } from 'Types/entity';
import { IRouter } from 'Router/router';

function generateResults(items: RecordSet): Model {
    const results = new Model({
        adapter: items.getAdapter(),
        format: [
            {
                name: 'title',
                type: 'real',
            },
            {
                name: 'rating',
                type: 'real',
            },
            {
                name: 'price',
                type: 'real',
            },
        ],
    });

    results.set('title', 4.58);
    results.set('rating', 8.4);
    results.set('price', 1554);

    return results;
}

function modifyLoadedData(items: RecordSet): void {
    const results = generateResults(items);
    items.setMetaData({
        ...items.getMetaData(),
        results,
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

export class ExtendedSlice extends ListSlice {
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
