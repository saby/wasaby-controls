import { RecordSet } from 'Types/collection';
import {
    List,
    ListSlice,
    IListState,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
    IListLoadResult,
} from 'Controls/dataFactory';
import { IRouter } from 'Router/router';
import { SyntheticEvent } from 'UICommon/Events';

function modifyLoadedData(items: RecordSet, reloadsCount: number): void {
    items.each((item) => {
        item.set(
            'title',
            `Запись с идентификатором ${item.get('key')}.  Количество перезагрузок: ${reloadsCount}`
        );
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

export interface IExtendedSliceState extends IListState {
    reloadsCount: number;
}

export class ExtendedSlice extends ListSlice<IExtendedSliceState> {
    // TODO Пока список не умеет догружать данные через слайс.
    private _dataLoadCallback(event: SyntheticEvent, items: RecordSet): void {
        modifyLoadedData(items, this.state.reloadsCount);
    }

    protected _initState(
        loadResult: IListLoadResult,
        initConfig: IListDataFactoryArguments
    ): IExtendedSliceState {
        const result = super._initState(loadResult, initConfig);
        result.sourceController.subscribe('dataLoad', this._dataLoadCallback.bind(this));
        result.reloadsCount = 0;
        return result;
    }
}

const slice = ExtendedSlice;

export { loadData, slice };
