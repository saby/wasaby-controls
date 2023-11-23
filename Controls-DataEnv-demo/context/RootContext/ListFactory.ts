import { AbstractSlice } from 'Controls-DataEnv/slice';

interface IListItem {
    id: string;
    name: string;
    active: boolean;
}

interface IListSliceState {
    filter: {
        active: boolean;
    };
    items: IListItem[];
}

const LIST_ITEMS: IListItem[] = [
    {
        id: '1',
        name: 'Активный элемент',
        active: true,
    },
    {
        id: '2',
        name: 'Неактивный элемент',
        active: false,
    },
];

class ListSlice extends AbstractSlice<IListSliceState> {
    protected _initState(loadResult: IListSliceState, config: unknown): IListSliceState {
        return {
            filter: loadResult.filter,
            items: loadResult.items,
        };
    }

    protected _beforeApplyState(
        nextState: IListSliceState
    ): Promise<IListSliceState> | IListSliceState {
        if (nextState.filter.active !== this.state.filter.active) {
            nextState.items = LIST_ITEMS.filter((item) => {
                return item.active === nextState.filter.active;
            });
            return nextState;
        }
        return nextState;
    }
}

export default {
    slice: ListSlice,
    async loadData(config) {
        return {
            items: LIST_ITEMS.filter((item) => {
                return item.active === config.filter.active;
            }),
            filter: config.filter,
        };
    },
};
