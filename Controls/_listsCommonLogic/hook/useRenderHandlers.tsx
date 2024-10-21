import * as React from 'react';

import type { CrudEntityKey } from 'Types/source';

import type {
    IAbstractListAPI,
    IAbstractListState,
    AbstractListSlice,
} from 'Controls-DataEnv/abstractList';

import type { IAbstractComponentEventHandlers } from 'Controls-Lists/_abstractList/interface/IAbstractComponentEventHandlers';
import type { IAbstractViewCommandHandlers } from 'Controls-Lists/_abstractList/interface/IAbstractViewCommandHandlers';
import type { TUseViewCommandHandlersProps } from 'Controls-Lists/_abstractList/hooks/useViewCommandHandlers';

import { UILogic } from '../UILogic';
import { Model } from 'Types/entity';

import { IAction, ISelectionObject, MarkerDirection } from 'Controls/interface';
import { BaseAction } from 'Controls/actions';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { SyntheticEvent } from 'UICommon/Events';

const { getKey } = UILogic.Common;

type TUseRenderHandlersProps = TUseViewCommandHandlersProps & TUseRenderHandlersPropsCompatible;

export type TUseRenderHandlersPropsCompatible = {
    sliceForOldItemActions: AbstractListSlice;
    contextForOldItemActions: unknown;
};

const getMarkerStrategy = (
    ...args: Parameters<
        (typeof import('Controls/listAspects'))['MarkerUILogic']['getMarkerStrategy']
    >
) =>
    loadSync<typeof import('Controls/listAspects')>(
        'Controls/listAspects'
    ).MarkerUILogic.getMarkerStrategy(...args);

export function getRenderHandlers<TViewCommandHandlers extends IAbstractViewCommandHandlers>(
    viewModelAPI: React.MutableRefObject<IAbstractListAPI>,
    viewModelState: React.MutableRefObject<IAbstractListState>,
    componentHandlers: React.MutableRefObject<IAbstractComponentEventHandlers>,
    props: React.MutableRefObject<TUseRenderHandlersProps>
): TViewCommandHandlers {
    const abstract: IAbstractViewCommandHandlers = {
        onCheckboxClick(_event: React.MouseEvent, item: Model | Model[]): void {
            viewModelAPI.current.select(getKey(item));
        },
        onItemClick(event: React.MouseEvent, item: Model | Model[]): void {
            itemAbstractActivation(getKey(item), viewModelAPI.current, viewModelState.current, {
                changeRootByItemClick: props.current.changeRootByItemClick,
                onActivate: () => {
                    componentHandlers.current.onItemClick?.(item, event);
                },
            });
        },
        onExpanderClick(
            _event: React.MouseEvent,
            item: Model | Model[],
            {
                markItem = true,
            }: {
                markItem?: boolean;
            } = {}
        ): void {
            const key = getKey(item);
            const params = {
                markItem,
            };

            if (UILogic.Hierarchy.isExpanded(viewModelState.current, key)) {
                viewModelAPI.current.collapse(key, params);
            } else {
                viewModelAPI.current.expand(key, params);
            }
        },
        onHasMoreClick(_event: React.MouseEvent, item: Model | Model[]): void {
            // Мобильная ViewModel накидывает префикс, костыль пока коллекции "умные".
            viewModelAPI.current.expand((getKey(item) as string).replace('node-footer-', ''));
        },
        onItemKeyDownEnter(
            event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownEnter(event, viewModelAPI.current, viewModelState.current, props.current);
        },
        onItemKeyDownArrowLeft(
            _event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownArrowLeft(viewModelAPI.current, viewModelState.current);
        },
        onItemKeyDownArrowRight(
            _event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownArrowRight(viewModelAPI.current, viewModelState.current);
        },
        onItemKeyDownArrowUp(
            event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownArrowUp(event, viewModelAPI.current, viewModelState.current);
        },
        onItemKeyDownArrowDown(
            event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownArrowDown(event, viewModelAPI.current, viewModelState.current);
        },
        onItemKeyDownSpace(
            event: React.KeyboardEvent<HTMLDivElement>,
            _item: Model | Model[]
        ): void {
            onKeyDownSpace(event, viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownArrowLeft(_event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownArrowLeft(viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownArrowRight(_event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownArrowRight(viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownArrowUp(event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownArrowUp(event, viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownArrowDown(event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownArrowDown(event, viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownEnter(event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownEnter(event, viewModelAPI.current, viewModelState.current, props.current);
        },
        onViewKeyDownSpace(event: React.KeyboardEvent<HTMLDivElement>): void {
            onKeyDownSpace(event, viewModelAPI.current, viewModelState.current);
        },
        onViewKeyDownDel(event: React.KeyboardEvent<HTMLDivElement>): void {
            // todo: В будущем для выполнения действий над записями
            //  будут использоваться Actions на слайсе.
            //  Тогда тут нужно будет учесть выполнение этих действий.
            if (viewModelState.current.listActions?.length) {
                const actionParams = {
                    id: 'remove',
                    actionName: 'Controls/actions:Remove',
                };
                const actionOptions = viewModelState.current.listActions.find((item) => {
                    return (
                        item.id === actionParams.id || item.actionName === actionParams.actionName
                    );
                });
                if (actionOptions) {
                    loadAsync('Controls/actions').then(({ createAction }) => {
                        const action = createAction(actionOptions.actionName, actionOptions);
                        executeAction({
                            action,
                            actionOptions,
                            slice: props.current.sliceForOldItemActions,
                            context: props.current.contextForOldItemActions,
                            event,
                        });
                    });
                }
            }
        },

        // Нужно перетаскивать из BaseControl весь каскад методов,
        // обрабатывающих скрытие, показ по ховеру, отображение меню и обработку кликов в ItemActions,
        // а также контроллеры ActionsController и HoverFreeze.
        // Пока обработка спускаемого коллбека для схемы со слайсом - единственный вариант корректно выполнить действие.
        onActionClick(
            action: IAction | BaseAction,
            item: Model,
            container: HTMLDivElement,
            nativeEvent: React.MouseEvent
        ): void {
            // TODO Запись уже отмечена маркером, но нам нужно всё равно передавать selection,
            //  Потому что стейт слайса на момент вызова ещё не применяется.
            //  В итоге мы тут всегда будм получать предыдущее неактуальное выделение.
            //  Надо научиться запускать экшн после применения состояния слайса,
            //  тогда selection тут будет не нужен.
            executeAction({
                action,
                slice: props.current.sliceForOldItemActions,
                context: {
                    item,
                },
                event: nativeEvent,
                container,
            });
        },
    };

    return abstract as TViewCommandHandlers;
}

function onKeyDownArrowLeft(
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState
): void {
    toggleMarkedNode(viewModelAPI, viewModelState, 'collapse');
}

function onKeyDownArrowRight(
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState
): void {
    toggleMarkedNode(viewModelAPI, viewModelState, 'expand');
}

function onKeyDownArrowUp(
    event: React.KeyboardEvent<HTMLDivElement>,
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState
): void {
    event.stopPropagation();
    event.preventDefault();

    const strategy = getMarkerStrategy(viewModelState.collection);

    viewModelAPI.mark(
        strategy.getMarkedKeyByDirection(viewModelState, viewModelState.collection, 'Up')
    );
}

function onKeyDownArrowDown(
    event: React.KeyboardEvent<HTMLDivElement>,
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState
): void {
    event.stopPropagation();
    event.preventDefault();

    const strategy = getMarkerStrategy(viewModelState.collection);
    viewModelAPI.mark(
        strategy.getMarkedKeyByDirection(viewModelState, viewModelState.collection, 'Down')
    );
}

function onKeyDownEnter(
    event: React.KeyboardEvent<HTMLDivElement>,
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState,
    props: TUseRenderHandlersProps
): void {
    event.stopPropagation();
    event.preventDefault();

    if (typeof viewModelState.markedKey !== 'undefined') {
        // @ts-ignore
        itemAbstractActivation(viewModelState.markedKey, viewModelAPI, viewModelState, {
            changeRootByItemClick: props.changeRootByItemClick,
        });
    }
}

function onKeyDownSpace(
    event: React.KeyboardEvent<HTMLDivElement>,
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState
): void {
    event.stopPropagation();
    event.preventDefault();
    const direction = event.shiftKey ? MarkerDirection.Backward : MarkerDirection.Forward;
    if (typeof viewModelState.markedKey !== 'undefined' && viewModelState.markedKey !== null) {
        viewModelAPI.select(viewModelState.markedKey, direction);
    }
}

function itemAbstractActivation(
    key: CrudEntityKey,
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState,
    props: {
        changeRootByItemClick?: boolean;
        onActivate?: () => void;
    }
): void {
    if (props.changeRootByItemClick && UILogic.Hierarchy.canBeRoot(viewModelState, key)) {
        viewModelAPI.changeRoot(key);
    } else {
        viewModelAPI.mark(key);
        props.onActivate?.();
    }
}

function toggleMarkedNode(
    viewModelAPI: IAbstractListAPI,
    viewModelState: IAbstractListState,
    action: 'expand' | 'collapse'
) {
    const { markerVisibility, markedKey } = viewModelState;

    if (markerVisibility === 'hidden' || typeof markedKey === 'undefined' || markedKey === null) {
        return;
    }

    if (UILogic.Hierarchy.isNode(viewModelState, markedKey)) {
        const isExpanded = UILogic.Hierarchy.isExpanded(viewModelState, markedKey);
        if (action === 'expand' && !isExpanded) {
            viewModelAPI.expand(markedKey);
        } else if (action === 'collapse' && isExpanded) {
            viewModelAPI.collapse(markedKey);
        }
    }
}

interface IExecuteActionProps {
    action: IAction | BaseAction;
    actionOptions?: object;
    storeId?: string;
    slice: AbstractListSlice;
    context: Record<string | symbol, unknown>;
    event: React.MouseEvent | React.KeyboardEvent;
    container?: HTMLDivElement;
    selection?: ISelectionObject;
}

// Хелпер, вызывающий action как действие тулбара. Тебуется для:
// 1. Запуска действия по клавише на клавиатуре
// 2. Кейса, когда ItemActions заданы как запускаемые действия, аналогично actions тулбара.
// Контекст - это просто объект ключ-значение. Это не обязательно равно какому-либо контексту списка.
function executeAction({
    action,
    actionOptions,
    slice,
    context,
    event,
    container,
    selection,
    storeId,
}: IExecuteActionProps): false | void | Promise<unknown> {
    if (!action) {
        return;
    }
    const { executeAction: baseExecutor } =
        loadSync<typeof import('Controls/actions')>('Controls/actions');
    const clickEvent =
        event.type === 'click'
            ? event
            : new SyntheticEvent(null, {
                  target: event.target,
                  type: 'click',
              });
    const toolbarItem = new Model({
        keyProperty: 'id',
        rawData: {
            ...action.getState(),
            ...actionOptions,
        },
    });
    action.setContext(context);
    return baseExecutor({
        storeId,
        action,
        toolbarItem,
        clickEvent,
        slice,
        opener: event.target,
        container,
        selection,
    });
}
