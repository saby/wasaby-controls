import AbstractSlice from 'Controls-DataEnv/_slice/AbstractSlice';

/**
 * Слайс имплементирующий поведение по умолчанию для фабрик данных.
 * Используется в случае, когда в фабрике данных не указан slice.
 * @public
 */
export default class Slice<State = unknown> extends AbstractSlice<State> {
    protected _initState(loadResult: unknown, _config: unknown): State {
        return loadResult as State;
    }
}
