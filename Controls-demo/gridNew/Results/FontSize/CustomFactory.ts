import { RecordSet } from 'Types/collection';
import {
    List,
    ListSlice,
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult
} from 'Controls/dataFactory';
import { Direction } from 'Controls/interface';
import { Model } from 'Types/entity';
import { IRouter } from 'Router/router';

function modifyLoadedData(items: RecordSet): void {
    const results = new Model({
        // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
        adapter: items.getAdapter(),

        // Устанавливаем тип полей строки итогов.
        format: [
            { name: 'M', type: 'real' },
            { name: 'L', type: 'real' },
            { name: 'XL', type: 'real' },
            { name: '$2XL', type: 'real' },
            { name: '$3XL', type: 'real' },
            { name: '$4XL', type: 'real' },
            { name: '$5XL', type: 'real' },
        ],

        // Устанавливаем значения полей
        rawData: {
            M: '30.6',
            L: '30.1',
            XL: '30.6',
            $2XL: '30.5',
            $3XL: '30',
            $4XL: '30.1',
            $5XL: '300000',
        },
    });

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
