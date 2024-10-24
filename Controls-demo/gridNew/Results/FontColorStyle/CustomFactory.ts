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

function modifyLoadedData(items: RecordSet): void {
    const results = new Model({
        // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
        adapter: items.getAdapter(),

        // Устанавливаем тип полей строки итогов.
        format: [
            { name: 'success', type: 'real' },
            { name: 'link', type: 'real' },
            { name: 'primary', type: 'real' },
            { name: 'secondary', type: 'real' },
            { name: 'readonly', type: 'real' },
            { name: 'unaccented', type: 'real' },
            { name: 'warning', type: 'real' },
            { name: 'danger', type: 'real' },
        ],

        // Устанавливаем значения полей
        rawData: {
            success: '30.6',
            link: '30.1',
            primary: '30.6',
            secondary: '30.5',
            readonly: '30',
            unaccented: '30.1',
            warning: '300000',
            danger: '3000000',
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
