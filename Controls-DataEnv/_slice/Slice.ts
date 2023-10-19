import AbstractSlice from 'Controls-DataEnv/_slice/AbstractSlice';

export default class Slice<State = unknown> extends AbstractSlice<State> {
    protected _initState(loadResult: unknown, config: unknown): State {
        return loadResult as State;
    }
}
