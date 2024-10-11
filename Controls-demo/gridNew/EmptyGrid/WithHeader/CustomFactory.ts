import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    List,
    ListSlice,
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls/dataFactory';
import { Direction } from 'Controls/interface';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IRouter } from 'Router/router';

function modifyLoadedData(items: RecordSet): void {
    const results = new Model({
        // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
        adapter: items.getAdapter(),

        // Устанавливаем тип полей строки итогов.
        format: [
            {
                name: 'population',
                type: 'real',
            },
            {
                name: 'square',
                type: 'real',
            },
            {
                name: 'populationDensity',
                type: 'real',
            },
        ],
    });
    const data = Countries.getResults().full[0];

    results.set('population', data.population);
    results.set('square', data.square);
    results.set('populationDensity', data.populationDensity);

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
}

const slice = ExtendedSlice;

export { loadData, slice };
