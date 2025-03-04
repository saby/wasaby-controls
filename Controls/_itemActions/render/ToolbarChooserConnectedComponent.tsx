import * as React from 'react';
import { Model } from 'Types/entity';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { IAction, TItemActionsPosition, TItemActionsVisibility } from 'Controls/interface';
import { TAnimationState } from 'Controls/display';

import ItemActionsTemplate, { IItemActionsTemplateProps } from '../render/ItemActionsTemplate';
import SwipeActionsTemplate from '../render/SwipeTemplate';
import { IContextValue, ItemActionsContext } from '../context/Context';
import { ISwipeTemplateProps } from '../render/SwipeTemplate';
import { DEFAULT_ACTION_CAPTION_POSITION } from '../constants';
import { ActionsMapUtils } from '../utils/ActionsMapUtils';
import { SwipeUtils } from '../utils/SwipeUtils';
import { MENUTYPE, ActionsMenuUtils } from '../utils/ActionsMenuUtils';
import { getCollectionItemContext } from '../utils/loaderUtils';
import { ITEM_CONTAINER_SELECTOR } from 'Controls/_itemActions/Container';
import { IItemActionsData } from 'Controls/_itemActions/hooks/useItemActionsMap';

const parentProperty = 'parent@';

function filterActionsToShowOnHover(actions: IAction[]): IAction[] {
    const visibleActions = ActionsMapUtils.filterActionsToShowOnHover({
        itemActions: actions,
        menuIconSize: 'm',
        forceAddMenuButton: false,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return visibleActions.map(ActionsMapUtils.prepareHoverAction);
}

interface IHoverActionsProps
    extends Omit<IItemActionsTemplateProps, 'showedActions' | 'isEditing' | 'onActionsMouseEnter'> {
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

// todo swipeAnimation
interface ISwipeActionsProps
    extends Omit<
        ISwipeTemplateProps,
        'swipeAnimation' | 'onActionsAnimationEnd' | 'showedActions'
    > {
    actions: IAction[];
    backgroundStyle: string;
    swipeAnimation?: TAnimationState; // Сюда передавать close / open
}

function hasActionWithIcon(actions: IAction[]): boolean {
    return actions && actions.some((action: any) => !!action.icon);
}

/**
 * Собирает конфиг для свайпа и рендерит свайп
 */
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            showedActions={visibleActions}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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

/**
 * Компонент связывающий конкретную запись списка с панелью ItemActions и решающий,
 * что отобразить - свайп панель или ховер панель.
 * **** !!! Пока что используется только в списках без BaseControl, но сделем потом везде !!! ****
 * @param props
 * @public
 */
function ToolbarChooserConnectedComponent(props: IProps): React.ReactElement {
    const { menuDependencyLoader, executeAction, menuPopupOpener, itemActionsMap } =
        (React.useContext(ItemActionsContext) || {}) as unknown as IContextValue;
    const isTouch = TouchDetect.getInstance().isTouch();
    const highlightOnHover = props.hoverBackgroundStyle !== 'transparent';
    const itemActionsPosition = props.itemActionsPosition || 'inside';
    let itemActionsClass = props.itemActionsClass;

    // region dependency from collection

    // Пока зависим от записи коллекции, т.к.
    // 1. Пока нет контекста, распространяющего Record.
    // 2. Пока часть CSS классов для конкретной записи приходится считать в записи коллекции. Надо вынести в утилиты.
    // swipeAnimation={props.item.getSwipeAnimation()}
    const CollectionItemContext = getCollectionItemContext();
    const collectionItem = React.useContext(CollectionItemContext);
    const listItem = collectionItem?.contents;
    const isSwiped = collectionItem?.isSwiped();
    if (!isSwiped && collectionItem) {
        itemActionsClass = collectionItem.getItemActionPositionClasses(
            itemActionsPosition,
            props.itemActionsClass
        );
        itemActionsClass += ` ${collectionItem.getItemActionClasses(itemActionsPosition)}`;
    }

    // endregion dependency from collection

    const { actions, menuSource } = React.useMemo(() => {
        return (
            (!!listItem && itemActionsMap.get(listItem.getKey())) || {
                actions: null,
                menuSource: null,
            }
        );
    }, [itemActionsMap, listItem]);

    const itemActions = React.useMemo(() => {
        return actions?.getRawData() || [];
    }, [actions]);

    const { onActionMouseDown, onActionMouseClick, onActionMouseEnter, onActionMouseLeave } =
        React.useMemo(() => {
            return {
                onActionMouseDown(event: React.MouseEvent, action: IAction) {
                    event.stopPropagation();
                    if (event.nativeEvent.button !== 0) {
                        return;
                    }
                    const itemContainer = (event.target as HTMLDivElement).closest(
                        ITEM_CONTAINER_SELECTOR
                    ) as HTMLDivElement;
                    const item: Model = collectionItem?.contents as Model;

                    // Приводим к Model для сответствия API Controls/toolbars:View.
                    // В будущем это должно будет работать прямо из компонента тулбара, который отправляет событие.
                    const actionModel =
                        action &&
                        new Model({
                            keyProperty: 'id',
                            rawData: action,
                        });

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (actionModel && !actionModel.get('isMenu') && !actionModel.get('parent@')) {
                        executeAction?.(actionModel, item, itemContainer, event.nativeEvent);
                    } else {
                        ActionsMenuUtils.openItemActionsMenu({
                            menuSource,
                            popupOpener: menuPopupOpener,
                            parentAction: action,
                            clickEvent: event,
                            item,
                            itemContainer,
                            onActionClickHandler: executeAction,
                            menuType: MENUTYPE.ADDITIONAL,
                        });
                    }
                },
                onActionMouseClick: (event: React.MouseEvent<HTMLDivElement>) => {
                    event.stopPropagation();
                },
                onActionMouseEnter: (_event: React.MouseEvent<HTMLDivElement>, action: IAction) => {
                    if (action[parentProperty] !== null) {
                        menuDependencyLoader.start();
                    }
                },
                onActionMouseLeave: (_event: React.MouseEvent<HTMLDivElement>, action: IAction) => {
                    if (action[parentProperty] !== null) {
                        menuDependencyLoader.stop();
                    }
                },
            };
        }, [collectionItem, parentProperty, menuDependencyLoader, menuSource, executeAction]);

    const renderProps = {
        actions: itemActions, // Тулбары ItemActions работают по объектам
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
    // swipeAnimation, onActionsAnimationEnd, showedActions, isEditing, onActionsMouseEnter

    return isSwiped && isTouch ? (
        <SwipeActions {...renderProps} />
    ) : (
        <HoverActions {...renderProps} />
    );
}

const ToolbarChooserConnectedComponentMemoized = React.memo(ToolbarChooserConnectedComponent);

export default ToolbarChooserConnectedComponentMemoized;
