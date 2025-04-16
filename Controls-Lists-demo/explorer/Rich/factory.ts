import { factory, ListSlice, IListState, IListDataFactory } from 'Controls-DataEnv/list';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

class Slice extends ListSlice {
    protected async _beforeApplyState(nextStateProp: IListState): Promise<IListState> {
        const nextState = await super._beforeApplyState(nextStateProp);

        if (nextState.viewMode === 'tile') {
            await loadAsync('Controls-Lists-demo/explorer/Rich/TileItemTemplate');
        }

        return nextState;
    }
}

const richFactory: IListDataFactory = {
    ...factory,
};

richFactory.slice = Slice;

export default richFactory;
