/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { FocusRoot } from 'UI/Focus';

import type { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';

import type { IAbstractComponentEventHandlers } from './interface/IAbstractComponentEventHandlers';
import type { IAbstractRenderProps } from './interface/IAbstractRender';
import type { IAbstractViewCommandHandlers } from './interface/IAbstractViewCommandHandlers';
import type { IAbstractRenderEventHandlers } from './interface/IAbstractRenderEventHandlers';

import { HotKeysContainer } from './HotKeysContainer';
import { ScrollControllerWrapper } from './ScrollControllerWrapper';
import { ItemActionsContextProvider } from 'Controls/itemActions';

// region HoC'и для подключения Render'a к ViewModel и обогащения его интерактивностью. ===
import { withViewModel, TViewModelProvidedProps, TUseViewModelHook } from './HoC/ViewModel';
import { withCollectionVersion, TCollectionVersionProvidedProps } from './HoC/CollectionVersion';
import {
    withViewCommandHandlers,
    TUseViewCommandHandlersHook,
    TUseViewCommandHandlersProps,
} from './HoC/ViewCommandHandlers';
import { withRenderEventHandlers, TUseRenderEventHandlersHook } from './HoC/RenderEventHandlers';
// endregion

// region Хуки получения данных для HoC'ов.
import { useViewModel } from './hooks/useViewModel';
import { useViewCommandHandlers } from './hooks/useViewCommandHandlers';
import { useRenderEventHandlers } from './hooks/useRenderEventHandlers';
import { useCollectionVersion } from './hooks/useCollectionVersion';
// endregion

export interface IAbstractListComponentProps
    extends IAbstractComponentEventHandlers,
        TUseViewCommandHandlersProps {
    className?: string;
    theme?: string;
    dataQa?: string;
    'data-qa'?: string;
}

type TComposedProps<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
> = IAbstractListComponentProps &
    TViewModelProvidedProps<TAbstractListAPI, TAbstractListState> &
    TViewCommandHandlers &
    TRenderEventHandlers &
    TCollectionVersionProvidedProps;

type TRenderWrapperComponentProps<
    TViewCommandHandlers extends IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers,
    TAbstractListAPI extends IAbstractListAPI,
    TAbstractListState extends IAbstractListState,
> = TComposedProps<
    TViewCommandHandlers,
    TRenderEventHandlers,
    TAbstractListAPI,
    TAbstractListState
> & {
    Render: React.ComponentType<
        IAbstractRenderProps &
            TComposedProps<
                TViewCommandHandlers,
                TRenderEventHandlers,
                TAbstractListAPI,
                TAbstractListState
            >
    >;
};

// FIXME: Убрать спред опций, выделить интерфейс опций рендера и передавать исключительно их.
//  Остальные опции, например.
/**
 * Каркас любого списка.
 * Компонент оборачивает переданный рендер в функциональные обертки.
 * К таким оберткам относятся: DND, виртуальный скролл, FocusRoot, HotKeysContainer и т.п.
 */
const RenderWrapperComponent = React.forwardRef(
    (
        {
            theme = 'default',
            Render,
            ...props
        }: TRenderWrapperComponentProps<
            IAbstractViewCommandHandlers,
            IAbstractRenderEventHandlers,
            IAbstractListAPI,
            IAbstractListState
        >,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.JSX.Element => {
        const rootClassName =
            `controls_list_theme-${theme} ` +
            `controls_toggle_theme-${theme} ` +
            'controls-BaseControl_hover_enabled' +
            (props.className ? ` ${props.className}` : '');

        const needShowEmptyTemplate =
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !!props.viewModelState.emptyView && !!props.viewModelState.needShowStub;

        return (
            <HotKeysContainer
                ref={ref}
                onViewKeyDownArrowDown={props.onViewKeyDownArrowDown}
                onViewKeyDownArrowUp={props.onViewKeyDownArrowUp}
                onViewKeyDownArrowLeft={props.onViewKeyDownArrowLeft}
                onViewKeyDownArrowRight={props.onViewKeyDownArrowRight}
                onViewKeyDownDel={props.onViewKeyDownDel}
                onViewKeyDownEnter={props.onViewKeyDownEnter}
                onViewKeyDownSpace={props.onViewKeyDownSpace}
            >
                <FocusRoot
                    as="div"
                    className={rootClassName}
                    data-qa={props.dataQa || props['data-qa']}
                    ref={ref}
                    autofocus={true}
                >
                    <ScrollControllerWrapper collection={props.viewModelState.collection}>
                        <ItemActionsContextProvider
                            collection={props.viewModelState.collection}
                            itemHandlers={props.itemHandlers}
                            onActionClickNew={props.onActionClick}
                            contextMenuConfig={undefined}
                        >
                            <Render
                                {...props}
                                {...props.viewModelState}
                                itemHandlers={props.itemHandlers}
                                className={rootClassName}
                                needShowEmptyTemplate={needShowEmptyTemplate}
                                // 1. В списках с BaseControl создаётся собственный фокус-элемент ("fakeFocusElement").
                                // 2. В "чистом списке" фокусировка происходит прямо на записи списка.
                                // Эти два поведения конфликтуют и для их разграничения введён параметр "innerFocusElement".
                                innerFocusElement={true}
                            />
                        </ItemActionsContextProvider>
                    </ScrollControllerWrapper>
                </FocusRoot>
            </HotKeysContainer>
        );
    }
);

export const getAbstractListComponent = <
    TComponentProps extends IAbstractListComponentProps = IAbstractListComponentProps,
    TViewCommandHandlers extends IAbstractViewCommandHandlers = IAbstractViewCommandHandlers,
    TRenderEventHandlers extends IAbstractRenderEventHandlers = IAbstractRenderEventHandlers,
    TAbstractListAPI extends IAbstractListAPI = IAbstractListAPI,
    TAbstractListState extends IAbstractListState = IAbstractListState,
>(
    Render: TRenderWrapperComponentProps<
        IAbstractViewCommandHandlers,
        IAbstractRenderEventHandlers,
        IAbstractListAPI,
        IAbstractListState
    >['Render'],
    {
        useViewModelHook = useViewModel,
        useViewCommandHandlersHook = useViewCommandHandlers,
        useRenderEventHandlersHook = useRenderEventHandlers,
    }: {
        useViewModelHook?: TUseViewModelHook<TAbstractListAPI, TAbstractListState>;
        useViewCommandHandlersHook?: TUseViewCommandHandlersHook<TViewCommandHandlers>;
        useRenderEventHandlersHook?: TUseRenderEventHandlersHook<
            TViewCommandHandlers,
            TRenderEventHandlers
        >;
    } = {}
): React.ComponentType<TComponentProps> => {
    // 1. Оборачиваем Render в компоновщик любого списка и HoC для отслеживания версии коллекции.
    const InnerWithReactiveCollection = withCollectionVersion<
        TAbstractListAPI,
        TAbstractListState,
        IAbstractListComponentProps &
            TViewCommandHandlers &
            TRenderEventHandlers &
            TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>
    >(function Inner(
        props: TComposedProps<
            TViewCommandHandlers,
            TRenderEventHandlers,
            TAbstractListAPI,
            TAbstractListState
        >
    ) {
        return (
            <RenderWrapperComponent
                {...props}
                Render={
                    Render as TRenderWrapperComponentProps<
                        IAbstractViewCommandHandlers,
                        IAbstractRenderEventHandlers,
                        IAbstractListAPI,
                        IAbstractListState
                    >['Render']
                }
            />
        );
    }, useCollectionVersion);

    // Оборачиваем Render в HOC, поставляющий обработчики событий Render'a.
    // Обработчики вызывают View-команды(более умные обработчики, которые в свою очередь вызывают команды ViewModel).
    const ConnectedToRenderEventHandlers = withRenderEventHandlers<
        TViewCommandHandlers,
        TRenderEventHandlers,
        IAbstractListComponentProps &
            TViewCommandHandlers &
            TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>
    >(InnerWithReactiveCollection, useRenderEventHandlersHook);

    // Оборачиваем Render с обработчиками событий в HOC, поставляющий View-команды.
    // View-команды(более умные обработчики, которые в свою очередь вызывают команды ViewModel).
    const ConnectedToViewCommandHandlers = withViewCommandHandlers<
        TViewCommandHandlers,
        IAbstractListComponentProps & TViewModelProvidedProps<TAbstractListAPI, TAbstractListState>
    >(ConnectedToRenderEventHandlers, useViewCommandHandlersHook);

    // Подключаем Render с View-командами к ViewModel и возвращаем публичный компонент.
    return withViewModel<TAbstractListAPI, TAbstractListState, IAbstractListComponentProps>(
        ConnectedToViewCommandHandlers,
        useViewModelHook
    );
};
