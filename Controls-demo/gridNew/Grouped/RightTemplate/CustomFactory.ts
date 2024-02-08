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

function modifyLoadedData(items: RecordSet): void {
    items.setMetaData({
        groupResults: {
            'Догадкин Владимир': 2,
            'Кесарева Дарья': 5.0,
            'Корбут Антон': 1.0,
            'Крайнов Дмитрий': 4.0,
        },
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