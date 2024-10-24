import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    List,
    ListSlice,
    IListState,
    IListLoadResult,
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls/dataFactory';
import { Direction } from 'Controls/interface';
import { IRouter } from 'Router/router';

interface IExtendedSliceState extends IListState {
    needResults: boolean;
}

function modifyLoadedData(items: RecordSet): void {
    const meta = items.getMetaData();
    items.setMetaData({
        ...meta,
        results: Model.fromObject(
            {
                discr: 10,
                price: 10,
            },
            items.getAdapter()
        ),
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

class ExtendedSlice extends ListSlice<IExtendedSliceState> {
    protected _initState(
        loadResult: IListLoadResult,
        initConfig: IListDataFactoryArguments
    ): IExtendedSliceState {
        const state = super._initState(loadResult, initConfig);
        state.needResults = true;
        return state;
    }

    protected _dataLoaded(
        items: RecordSet,
        direction: Direction,
        nextState: IExtendedSliceState
    ): Partial<IExtendedSliceState> | Promise<Partial<IExtendedSliceState>> {
        if (nextState.needResults) {
            modifyLoadedData(items);
        }
        return super._dataLoaded(items, direction, nextState);
    }

    setNeedResults(needResults: boolean): void {
        this.setState({
            needResults,
        });
        this.reload();
    }
}

const slice = ExtendedSlice;

export { loadData, slice };
