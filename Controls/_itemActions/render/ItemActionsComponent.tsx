import * as React from 'react';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { Logger } from 'UI/Utils';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { IAction, TItemActionsPosition, TItemActionsVisibility } from 'Controls/interface';
import { isLeftMouseButton, StickyOpener } from 'Controls/popup';
import { TAnimationState } from 'Controls/display';

import ItemActionsTemplate, {
    IItemActionsTemplateProps,
} from '../resources/templatesReact/ItemActionsTemplate';
import SwipeActionsTemplate from '../resources/templatesReact/SwipeTemplate';
import { ItemActionsContext } from '../context/ItemActionsContext';
import { ISwipeTemplateProps } from '../resources/templatesReact/SwipeTemplate';
import { DEFAULT_ACTION_CAPTION_POSITION } from '../constants';
import { IContextMenuConfig } from '../interface/IContextMenuConfig';
import { ActionsMapUtils } from '../renderUtils/ActionsMapUtils';
import { SwipeUtils } from '../renderUtils/SwipeUtils';
import { ActionsMenuUtils } from '../renderUtils/ActionsMenuUtils';
import { BaseAction } from 'Controls/actions';

const ITEM_CONTAINER_SELECTOR = '.controls-ListView__itemV';

function createExecutableAction(actionConfig: IAction) {
    const { createAction } = loadSync('Controls/actions');
    return createAction(actionConfig.actionName, actionConfig);
}

// Обработчик действий в окне меню
function onItemActionsMenuResult(
    eventName: string,
    actionModel: Model,
    clickEvent: SyntheticEvent<MouseEvent>,
    item: Model,
    itemContainer: HTMLDivElement,
    onActionClickHandler: Function
): void {
    if (eventName === 'itemClick') {
        const action = actionModel && actionModel.getRawData();
        if (action && onActionClickHandler) {
            onActionClickHandler(action, item, itemContainer, clickEvent);
        }
    }
}

// Открывает меню в стики-попапе
function openItemActionsMenu(
    menuConfig: IContextMenuConfig,
    menuPopupOpener: StickyOpener,
    item: Model,
    itemContainer: HTMLDivElement,
    onActionClickHandler: Function
): void {
    menuConfig.eventHandlers = {
        onResult(
            eventName: string,
            actionModel: Model,
            clickEvent: SyntheticEvent<MouseEvent>
        ): void {
            onItemActionsMenuResult(
                eventName,
                actionModel,
                clickEvent,
                item,
                itemContainer,
                onActionClickHandler
            );
            menuPopupOpener.close();
        },
        onClose(): void {
            menuPopupOpener.close();
        },
    };
    menuPopupOpener.open(menuConfig);
}

function filterActionsToShowOnHover(actions: IAction[]): IAction[] {
    const visibleActions = ActionsMapUtils.filterActionsToShowOnHover({
        itemActions: actions,
        menuIconSize: 'm',
        forceAddMenuButton: false,
    });
    return visibleActions.map(ActionsMapUtils.prepareHoverAction);
}

interface IHoverActionsProps extends IItemActionsTemplateProps {
    actions: IAction[];
    backgroundStyle: string;
    hoverBackgroundStyle: string;
    actionsVisibility: TItemActionsVisibility;
}

const HoverActions = React.memo(function HoverActions(
    props: IHoverActionsProps
): React.ReactElement {
    const visibleActions = React.useMemo(() => {
        return filterActionsToShowOnHover(props.actions);
    }, [props.actions]);

    return (
        <ItemActionsTemplate
            {...props}
            itemActionsBackgroundStyle={props.backgroundStyle}
            showedActions={visibleActions}
        />
    );
});

interface ISwipeActionsProps extends ISwipeTemplateProps {
    actions: IAction[];
    backgroundStyle: string;
    swipeAnimation: TAnimationState; // Сюда передавать close / open
}

function hasActionWithIcon(visibleActions: IAction[]): boolean {
    return visibleActions && visibleActions.some((action: any) => !!action.icon);
}

const SwipeActions = React.memo(function SwipeActions(
    props: ISwipeActionsProps
): React.ReactElement | null {
    // TODO Измерения ширины вызывает проблемы с сайд-эффектами,
    //  actionsContainerWidth не передаём, чтобы измерения не запускались.
    const swipeConfig = SwipeUtils.prepareSwipeConfig({
        menuButtonVisibility: 'adaptive',
        actionCaptionPosition: DEFAULT_ACTION_CAPTION_POSITION,
        actionAlignment: 'horizontal',
        itemActions: props.actions,
        theme: 'default',
        actionsContainerHeight: 31,
    });
    const visibleActions = swipeConfig.itemActions?.showed;
    return (
        <SwipeActionsTemplate
            {...props}
            {...swipeConfig}
            itemActionsBackgroundStyle={props.backgroundStyle}
            showedActions={visibleActions}
            hasActionWithIcon={hasActionWithIcon(visibleActions)}
        />
    );
});

interface IProps {
    // Цвет фона записи по ховеру. Этот же цвет должен дублироваться для ItemActions.
    hoverBackgroundStyle: string;
    // Видимость действий над записью - по ховеру, с задержкой или всегда
    actionsVisibility: TItemActionsVisibility;
    // Все действия над записью, отфильтрованные по visibilityCallback
    actions: IAction[];
    // произвольный CSS класс, помимио прочего должен содержать классы для автопозиционирования,
    itemActionsClass: string;
    // Цвет фона
    backgroundStyle: string;
    // inside / outside
    itemActionsPosition: TItemActionsPosition;
}

function prevent(event: React.MouseEvent<HTMLDivElement>): void {
    event.stopPropagation();
    event.nativeEvent.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
}

export default function ItemActionsComponent(props: IProps): React.ReactElement {
    if (!isLoaded('Controls/baseList')) {
        Logger.error(
            'Controls/baseList library should be loaded first to use ItemActionsComponent'
        );
    }
    const { CollectionItemContext } = loadSync('Controls/baseList');
    const collectionItem = React.useContext(CollectionItemContext);
    const { menuPopupOpener, onActionClick, menuDependencyLoader } =
        React.useContext(ItemActionsContext);
    const isSwiped = collectionItem?.isSwiped();
    const isTouch = TouchDetect.getInstance().isTouch();
    const executableActions = React.useMemo(() => {
        return props.actions.map((action) => createExecutableAction(action));
    }, [props.actions]);
    const actionsStates = React.useMemo(() => {
        return executableActions.map((action) => action.getState());
    }, [executableActions]);
    const highlightOnHover = props.hoverBackgroundStyle !== 'transparent';
    const itemActionsPosition = props.itemActionsPosition || 'inside';

    const onActionClickHandler = (
        action: IAction | BaseAction,
        item: Model,
        container: HTMLDivElement,
        nativeEvent: MouseEvent
    ) => {
        const index = actionsStates.findIndex((_action) => _action.id === action.id);
        return onActionClick(executableActions[index], item, container, nativeEvent);
    };

    let itemActionsClass = props.itemActionsClass;
    if (!isSwiped && collectionItem) {
        // TODO Пока нужные классы можно получить только из collectionItem,
        //  но функции их получения надо вынести в этот компонент (или в утилиту).
        itemActionsClass = collectionItem.getItemActionPositionClasses(
            itemActionsPosition,
            props.itemActionsClass
        );
        itemActionsClass += ` ${collectionItem.getItemActionClasses(itemActionsPosition)}`;
    }

    // const hoverBackgroundStyle =
    //   props.hoverBackgroundStyle || props.item.getHoverBackgroundStyle() || props.item.getStyle();
    // swipeAnimation={props.item.getSwipeAnimation()}

    const { onActionMouseDown, onActionMouseClick, onActionMouseEnter, onActionMouseLeave } =
        React.useMemo(() => {
            return {
                onActionMouseDown(event: React.MouseEvent<HTMLDivElement>, action: IAction) {
                    prevent(event);
                    if (!isLeftMouseButton(event)) {
                        return;
                    }
                    const itemContainer = event.target.closest(ITEM_CONTAINER_SELECTOR);
                    const item: Model = collectionItem?.contents;
                    if (action && !action.isMenu && !action['parent@']) {
                        onActionClickHandler?.(action, item, itemContainer, event);
                    } else {
                        // TODO contextMenuConfig:
                        const menuConfig = ActionsMenuUtils.prepareActionsMenuConfig({
                            actionsObject: {
                                all: actionsStates,
                                showed: [],
                            },
                            clickEvent: event,
                            parentAction: action,
                            opener: event.target,
                            isContextMenu: false,
                            allowConfigWithoutActions: false,
                            isMenuForSwipedItem: collectionItem?.isSwiped(),
                        });
                        if (menuConfig) {
                            openItemActionsMenu(
                                menuConfig,
                                menuPopupOpener,
                                item,
                                itemContainer,
                                onActionClickHandler
                            );
                        }
                    }
                },
                onActionMouseClick: (event: React.MouseEvent<HTMLDivElement>) => {
                    prevent(event);
                },
                onActionMouseEnter: (event: React.MouseEvent<HTMLDivElement>, action: IAction) => {
                    if (action?.isMenu || action['parent@']) {
                        menuDependencyLoader.start();
                    }
                },
                onActionMouseLeave: (event: React.MouseEvent<HTMLDivElement>, action: IAction) => {
                    if (action?.isMenu || action['parent@']) {
                        menuDependencyLoader.stop();
                    }
                },
            };
        }, [collectionItem, executableActions, actionsStates]);

    const renderProps = {
        actions: actionsStates,
        backgroundStyle: props.backgroundStyle,
        actionsVisibility: props.actionsVisibility,
        hoverBackgroundStyle: props.hoverBackgroundStyle,
        highlightOnHover,
        itemActionsClass,
        isSwiped,
        onActionMouseDown,
        onActionClick: onActionMouseClick,
        onActionMouseEnter,
        onActionMouseLeave,
    };

    return isSwiped && isTouch ? (
        <SwipeActions {...renderProps} />
    ) : (
        <HoverActions {...renderProps} />
    );
}
