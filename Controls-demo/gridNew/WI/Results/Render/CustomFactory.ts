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
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IRouter } from 'Router/router';

function generateResults(items: RecordSet, resIndex: number): Model {
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

    const data = Countries.getResults().full[resIndex];

    results.set('population', data.population);
    results.set('square', data.square);
    results.set('populationDensity', data.populationDensity);

    return results;
}

function modifyLoadedData(items: RecordSet, resIndex: number): void {
    const results = generateResults(items, resIndex);
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
            modifyLoadedData(loadResult.data, 0);
            return loadResult;
        }
    );
}

export class ExtendedSlice extends ListSlice {
    private _resultIndex: number = 0;
    protected _partialResultsIndex: number = 0;

    // Перегенерировать и обновить результаты в метаданных при перезагрузке списка
    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ): Partial<IListState> | Promise<Partial<IListState>> {
        modifyLoadedData(items, this._getResultIndex());
        return super._dataLoaded(items, direction, nextState);
    }

    // Перегенерировать и установить метаданные в RecordSet напрямую
    resetMetaData(): void {
        modifyLoadedData(this.state.items, this._getResultIndex());
    }

    // Перегенерировать только одно поле в результатах
    resetSingleMetaResultsField(field: string): void {
        const results = this.state.items.getMetaData().results;
        results.set(field, Countries.getResults().partial[this._partialResultsIndex]);
        this._partialResultsIndex =
            ++this._partialResultsIndex % Countries.getResults().partial.length;
    }

    private _getResultIndex(): number {
        return ++this._resultIndex % Countries.getResults().full.length;
    }
}

const slice = ExtendedSlice;

export { loadData, slice };
