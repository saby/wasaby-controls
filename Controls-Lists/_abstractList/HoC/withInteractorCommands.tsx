/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ComponentType } from 'react';
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { IAbstractViewCommandHandlers } from '../interface/IAbstractViewCommandHandlers';
import type { IAbstractComponentEventHandlers } from '../interface/IAbstractComponentEventHandlers';
import type { TWithInteractorProvidedProps } from './withInteractor';
import type { IConnectableToSlice } from '../interface/IConnectableToSlice';

//# region Тип хука
/**
 * Параметры хука, получающего View-команды.
 */
export type TUseInteractorCommandsHookProps = IConnectableToSlice & {
    changeRootByItemClick?: boolean;
    expandByItemClick?: boolean;
};

/**
 * Тип хука, получающего View-команды.
 */
export type TUseInteractorCommandsHook<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
> = (
    viewModelAPI: TListAPI,
    viewModelState: TListState,
    // TODO: Сделать эти обработчики тоже переопределяемми.
    componentEventHandlers: IAbstractComponentEventHandlers,
    props: TUseInteractorCommandsHookProps
) => TViewCommandHandlers;
//# endregion Тип хука

/**
 * Опции, поставлямые HoC'ом withInteractorCommands.
 * Содержит "умные" команды, которые можно навесить на события рендера.
 * Поставляется в виде объекта, чтобы все команды были собраны в одном месте
 * и в рендер не приходилось спредить все опции.
 * @see withInteractorCommands
 */
export type TWithInteractorCommandsProvidedProps<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
> = {
    viewCommandHandlers: TViewCommandHandlers;
};

/**
 * HOC, поставляющий View-команды - "умные" обработчики, которые в свою очередь вызывают команды withInteractor.
 * View-команды предоставляют более широкие реакции на пользовательские действия.
 *
 * View-команды ориетированы на работу с данными, в отличие от обработчиков событий Render'a,
 * которые отвечают только за специфическое для рендера поведение.
 *
 * @param Component Оборачиваемый компонент.
 * @param useInteractorCommands Хук получающий View-команды.
 * @see TWithInteractorCommandsProvidedProps
 * @see TUseInteractorCommandsHook
 * */
export function withInteractorCommands<
    TListAPI extends IAbstractListAPI,
    TListState extends IAbstractListState,
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TOuter extends TWithInteractorProvidedProps<TListAPI, TListState>,
>(
    Component: ComponentType<TOuter & TWithInteractorCommandsProvidedProps<TViewCommandHandlers>>,
    useInteractorCommands: TUseInteractorCommandsHook<TListAPI, TListState, TViewCommandHandlers>
) {
    // Возвращаем компонент, который принимает только опции для настройки визуальных действий,
    // прикладные обработчики событий, а также состояние интерактора и API для его модификации.
    function Composed(
        props: TOuter & TUseInteractorCommandsHookProps & IAbstractComponentEventHandlers
    ) {
        const { changeRootByItemClick, expandByItemClick, onItemClick, ...cleanProps } = props;
        const handlers = useInteractorCommands(
            props.viewModelAPI,
            props.viewModelState,
            props,
            props
        );
        return <Component {...(cleanProps as TOuter)} viewCommandHandlers={handlers} />;
    }

    Composed.displayName = `withInteractorCommands(${Component.displayName || Component.name})`;

    return Composed;
}

export default withInteractorCommands;
