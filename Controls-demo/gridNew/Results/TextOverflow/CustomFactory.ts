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
        // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
        adapter: items.getAdapter(),

        // Устанавливаем тип полей строки итогов.
        format: [
            {
                name: 'square',
                type: 'real',
            },
            {
                name: 'population',
                type: 'real',
            },
            {
                name: 'populationDensity',
                type: 'real',
            },
        ],
    });

    results.set('population', 8996143455623660205559.49);
    results.set('square', 19358447234235616.8749);
    results.set('populationDensity', 5654645645645645645.8749);

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

class ExtendedSlice extends ListSlice {
    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        modifyLoadedData(items);
        return super._dataLoaded(items, direction, nextState);
    }

    resetMetaData(): void {
        modifyLoadedData(this.state.items);
    }
}

const slice = ExtendedSlice;

export { loadData, slice };
