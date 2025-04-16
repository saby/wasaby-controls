/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { ComponentType, useEffect } from 'react';
import type { IConnectableToSlice } from 'Controls/listsCommonLogic';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';

//# region Тип хука для получения данных интерактора
/**
 * Тип хука, который умеет добывать состояние интерактора и API для его модификации.
 * @see TWithInteractorProvidedProps
 */
export type TUseInteractorHook<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
> = (
    ...args: [storeId: IConnectableToSlice['storeId']]
) => TWithInteractorProvidedProps<TListAPI, TListState>;
//# endregion Тип хука для получения данных интерактора

/**
 * Опции, поставлямые HoC'ом withInteractor.
 * Содержит состояние интерактора и API для его модификации.
 */
export type TWithInteractorProvidedProps<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
> = {
    viewModelAPI: TListAPI;
    viewModelState: TListState;
};

/**
 * HOC, который подключает дочерний компонент к интерактору.
 * @param Component Оборачиваемый компонент.
 * @param useViewModelHook Хук, который умеет добывать состояние интерактора и API для его модификации.
 * @see TUseInteractorHook
 */
export function withInteractor<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TOuter extends IConnectableToSlice,
>(
    Component: ComponentType<TOuter & TWithInteractorProvidedProps<TListAPI, TListState>>,
    useViewModelHook: TUseInteractorHook<TListAPI, TListState>
) {
    // Возвращаем компонент, который принимает только storeId.
    function Composed(props: TOuter) {
        // Внутри него получаем состояние интерактора и API для его модификации.
        // Делаем это черех переданный хук.
        const { viewModelState, viewModelAPI } = useViewModelHook(props.storeId);

        const { connect, disconnect } = viewModelAPI;

        useEffect(() => {
            connect();
            return () => {
                disconnect();
            };
        }, [connect, disconnect]);

        if (!viewModelState || !viewModelAPI) {
            return null;
        }

        return <Component {...props} viewModelState={viewModelState} viewModelAPI={viewModelAPI} />;
    }

    Composed.displayName = `withInteractor(${Component.displayName || Component.name})`;

    return Composed;
}

export default withInteractor;
