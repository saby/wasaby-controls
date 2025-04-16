/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
//# region ENV
import { ComponentType, FunctionComponent, memo, RefObject } from 'react';
import type { IComponentPropsWithReadonly } from 'Controls/interface';
//# endregion ENV
//# region Интерфейсы
import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import type { IAbstractRenderEventHandlers } from './interface/IAbstractRenderEventHandlers';
import type {
    IAbstractComponentEventHandlers,
    IAbstractViewCommandHandlers,
    IConnectableToSlice,
} from 'Controls/listsCommonLogic';
import type { IAbstractRenderProps } from './interface/IAbstractRender';
import type { IAbstractComponentAPI } from './interface/IAbstractComponentAPI';
//# endregion Интерфейсы
// region Утилитарные HoC'и
import withRenderEventHandlers, {
    TUseRenderEventHandlersHook,
    TWithRenderEventHandlersProvidedProps,
} from './HoC/withRenderEventHandlers';
import withCollectionVersion, {
    TWithCollectionVersionProvidedProps,
} from './HoC/withCollectionVersion';
import withInteractorCommands, {
    TUseInteractorCommandsHook,
    TWithInteractorCommandsProvidedProps,
} from './HoC/withInteractorCommands';
import withInteractor, {
    TUseInteractorHook,
    TWithInteractorProvidedProps,
} from './HoC/withInteractor';
import withFocusRoot from './HoC/withFocusRoot';
import withHotKeysListener from './HoC/withHotKeysListener';
import withRenderRefs, { TWithRenderRefsProvidedProps } from './HoC/withRenderRefs';
import withRenderFeatures, {
    TFeaturesProps,
    TInnerComponentProps,
} from './RenderFeatures/withRenderFeatures';
import type { TUseInteractorCommandsHookProps } from 'Controls/listsCommonLogic';
// endregion Утилитарные HoC'и ===
// region Хуки получения данных для HoC'ов.
import useInteractor from './hooks/useInteractor';
import useInteractorCommands from './hooks/useInteractorCommands';
import useRenderEventHandlers from './hooks/useRenderEventHandlers';
import { useTheme } from 'UI/Contexts';

// endregion

interface IRenderWrapperRequiredProps extends IConnectableToSlice {
    theme?: string;
}

export interface IAbstractListComponentProps
    extends IAbstractComponentEventHandlers,
        TUseInteractorCommandsHookProps,
        IComponentPropsWithReadonly,
        IRenderWrapperRequiredProps,
        Omit<TFeaturesProps, 'collectionVersion'> {
    ref?: RefObject<IAbstractComponentAPI | undefined>;
}

/**
 * Каркас любого списочного компонента.
 * Компонент списка это Render списка, обернутый в Render-фитчи и подключенный к интерактору.
 *
 * Используется луковая архитектура для раздиления ответственности и большей модульности.
 * Далее по коду собирается компонент списка, изнутри наружу, т.е. сначала Render
 * оборачиваетсся в самую низкоуровневую обертку. Затем получившийся компонент оборачивается в более
 * высокоуровневую и так далее, пока не получится публичный компонент.
 *
 * Обертки делятся на два типа: Core и RenderFeatures.
 *
 * RenderFeatures это обертки, которые поставляют определенный функционал в списке, например
 * DND, виртуальное скроллирование, операции над записью и т.п.
 * Функционал каждой такой обертки представлен отдельной функциональной зоной со своим ответственным.
 * К таким оберткам выставляются широки требования касательно переиспользуемости кода.
 *
 * Core это низкоуровневые каркасные и ядерные обертки, обеспечивают
 * 1) корректную работу в экосистеме Saby,
 * 2) оркестрируют различные RenderFeatures
 *
 * @param Render
 * @param useViewModelHook
 * @param useViewCommandHandlersHook
 * @param useRenderEventHandlersHook
 */

export const getAbstractListComponent = <
    TComponentProps extends IAbstractListComponentProps = IAbstractListComponentProps,
    TViewCommandHandlers extends IAbstractViewCommandHandlers = IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers = IAbstractRenderEventHandlers,
    TListAPI extends IAbstractListAPI = IAbstractListAPI,
    TListState extends IAbstractListState = IAbstractListState,
>(
    Render: ComponentType<IAbstractRenderProps>,
    {
        useViewModelHook = useInteractor,
        useViewCommandHandlersHook = useInteractorCommands,
        useRenderEventHandlersHook = useRenderEventHandlers,
    }: {
        useViewModelHook?: TUseInteractorHook<TListAPI, TListState>;
        useViewCommandHandlersHook?: TUseInteractorCommandsHook<
            TListAPI,
            TListState,
            TViewCommandHandlers
        >;
        useRenderEventHandlersHook?: TUseRenderEventHandlersHook<
            TListAPI,
            TListState,
            TRenderEventHandlers,
            TViewCommandHandlers
        >;
    } = {}
) => {
    function RenderWrapper(
        props: TWithInteractorProvidedProps<TListAPI, TListState> &
            TWithCollectionVersionProvidedProps &
            TWithRenderEventHandlersProvidedProps<TRenderEventHandlers> &
            TWithInteractorCommandsProvidedProps<TViewCommandHandlers> &
            TWithRenderRefsProvidedProps &
            IRenderWrapperRequiredProps &
            TInnerComponentProps<TListAPI, TListState, TViewCommandHandlers>
    ) {
        const { viewModelState } = props;

        if (!viewModelState.collection) {
            return null;
        }

        const needShowEmptyTemplate = !!viewModelState.emptyView && viewModelState.needShowStub;

        /* Прокидка всех пропсов нужна, т.к. необходимо прокидывать опции от публичного копонента */
        return (
            <Render
                {...props}
                collection={viewModelState.collection}
                // ref={props.renderContainerRef}
                collectionVersion={props.collectionVersion}
                {...props.viewModelState}
                {...props.renderEventHandlers}
                needShowEmptyTemplate={needShowEmptyTemplate}
                // 1. В списках с BaseControl создаётся собственный фокус-элемент ("fakeFocusElement").
                // 2. В "чистом списке" фокусировка происходит прямо на записи списка.
                // Эти два поведения конфликтуют и для их разграничения введён параметр "innerFocusElement".
                innerFocusElement={true}
                viewTriggerProps={props.viewTriggerProps}
            />
        );
    }

    // Оборачиваем Render в HOC, поставляющий обработчики событий Render'a.
    // Обработчики вызывают View-команды и контекстны методы фич.
    // View-команды - более умные обработчики, которые в свою очередь вызывают команды withInteractor.
    // View-команды ориетированы на работу с данными, в то время как обработчики событий Render'a
    // отвечают за специфическое для рендера поведение.
    const RenderWithEventHandlers = withRenderEventHandlers(
        RenderWrapper,
        useRenderEventHandlersHook
    );

    // Обрачиваем Render в доступные ему фитчи.
    const RenderWithFeatures = withRenderFeatures(RenderWithEventHandlers);

    // Оборачиваем Render в HoC для отслеживания версии коллекции.
    const ReactiveRender = withCollectionVersion(RenderWithFeatures);

    // Подключаем Render к системе фокусов.
    // ВНИМАНИЕ! Данная обертка родит div, именно он должен использоваться как корневой div компонента.
    const RenderWithFocusRoot = withFocusRoot(ReactiveRender);

    // Подключаем Render к системе отслеживания нажатия горячих клавиш (HotKeys).
    const RenderWithHotKeys = withHotKeysListener(((props) => {
        return <RenderWithFocusRoot {...props} />;
    }) as typeof RenderWithFocusRoot);

    // Оборачиваем Render с обработчиками событий в HOC, поставляющий View-команды.
    // View-команды(более умные обработчики, которые в свою очередь вызывают команды withInteractor).
    // Сразу же отдаем в HotKeys необходимые ему обработчики.
    const ConnectedToCommands = withInteractorCommands(
        ((props) => {
            const themeFromContext = useTheme(props);
            const theme = themeFromContext ?? 'default';

            const className =
                `controls_list_theme-${theme} ` +
                `controls_toggle_theme-${theme} ` +
                'controls-BaseControl ' +
                'controls-BaseControl_hover_enabled' +
                (props.className ? ` ${props.className}` : '');

            const {
                onViewKeyDownArrowUp,
                onViewKeyDownArrowDown,
                onViewKeyDownArrowLeft,
                onViewKeyDownArrowRight,
                onViewKeyDownDel,
                onViewKeyDownBackSpace,
                onViewKeyDownSpace,
                onViewKeyDownEnter,
            } = props.viewCommandHandlers;
            return (
                <RenderWithHotKeys
                    {...props}
                    className={className}
                    onArrowUp={onViewKeyDownArrowUp}
                    onArrowDown={onViewKeyDownArrowDown}
                    onArrowLeft={onViewKeyDownArrowLeft}
                    onArrowRight={onViewKeyDownArrowRight}
                    onDel={onViewKeyDownDel}
                    onBackSpace={onViewKeyDownBackSpace}
                    onSpace={onViewKeyDownSpace}
                    onEnter={onViewKeyDownEnter}
                />
            );
        }) as typeof RenderWithFocusRoot,
        useViewCommandHandlersHook
    );

    // Подключаем Render с View-командами к withInteractor и возвращаем публичный компонент.
    const ConnectedComponent = withInteractor(ConnectedToCommands, useViewModelHook);

    // Создаем и прокидывем вниз все необходимые Ref
    return memo(
        withRenderRefs(ConnectedComponent) as unknown as FunctionComponent<TComponentProps>
    );
};
