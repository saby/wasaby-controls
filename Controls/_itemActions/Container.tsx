import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { StickyOpener } from 'Controls/popup';
import { useTheme } from 'UI/Contexts';
import { useStableCallback } from 'Controls/hooks';
import { TKey } from 'Controls/interface';
import { controller as localeController } from 'I18n/singletonI18n';

import { IContextValue, ItemActionsContext } from 'Controls/_itemActions/context/Context';
import { MenuDependencyLoader } from 'Controls/_itemActions/menuDependency/MenuDependencyLoader';
import { useItemActionsMap } from 'Controls/_itemActions/hooks/useItemActionsMap';
import { Model } from 'Types/entity';
import { ActionsMenuUtils, MENUTYPE } from 'Controls/_itemActions/utils/ActionsMenuUtils';
import { IContextMenuConfig } from 'Controls/_itemActions/interface/IContextMenuConfig';
import type { IActionProps as IAction } from 'Controls/actions';
import { getActionsLib } from 'Controls/_itemActions/utils/loaderUtils';

export const ITEM_CONTAINER_SELECTOR = '.controls-ListView__itemV';

interface IActionsContainer {
    storeId: string;
    children: React.ReactElement;
    isAdaptive?: boolean;
    contextMenuConfig?: IContextMenuConfig;

    // Для useTheme
    theme?: string;
    forwardedRef?: React.Ref<any>;
}

/**
 * Контейнер-обёртка для рендера списка, который:
 * 1. Посталяет контекст ActionsContext
 * ========================
 * 2. Формирует карту коллекции экшнов и источников для меню. <- вероятно, должно уйти на слайс
 * ========================
 * 3. Позволяет аналогично меню тулбара открыть контекстное меню записи списка.
 * 4. Позволяет открывать только одно меню, поставляя единый opener в контекст
 * 5. Позволяет делать только один свайп
 * 6. Содержит загрузчик зависимостей для кнопки меню.
 * @private
 * @param props
 * @constructor
 */
function ItemActionsContainer({ children, ...props }: IActionsContainer) {
    const theme = useTheme(props);
    const { executeAction } = React.useMemo(() => getActionsLib(), []);
    // Слайс списка
    const slice = useSlice(props.storeId) as ListSlice;
    // Стейт слайса списка
    const sliceState = slice?.state || {};
    // Стейт, по которому будут отрисованы ItemActions на записи. Меняется по MouseMove или Swipe на записи.
    const [actionsInitialized, setActionsInitialized] = React.useState<boolean>(false);
    // Загрузчик зависимостей меню. При первом ховере на кнопку меню загружает необходимые зависимости.
    const menuDependencyLoader = React.useMemo(() => {
        return new MenuDependencyLoader({
            contextMenuConfig: props.contextMenuConfig,
            theme,
        });
    }, [props.contextMenuConfig, theme]);
    // Опенер окна меню. Позволяет открыть только одно меню.
    const menuPopupOpener = React.useMemo(() => new StickyOpener(), []);

    // region Зависимости от коллекции списка

    const collection = sliceState.collection;
    const [swipedItem, setSwipedItem] = React.useState<TKey>(null);

    // endregion Зависимости от коллекции списка

    //  Содержит для каждой записи коллекцию экшнов и источник данных для меню меню
    const itemActionsMap = useItemActionsMap({ storeId: props.storeId });

    // Экзекьютор для ItemAction
    const executeItemAction = useStableCallback(
        (
            action: Model<IAction>,
            item: Model,
            container: HTMLDivElement,
            clickEvent: React.MouseEvent
        ): void => {
            if (!itemActionsMap) {
                return;
            }
            const actionsData = itemActionsMap.get(item.getKey());
            // const toolbarItem = actionData.actions.getRecordById(action.get('id'));
            if (!executeAction || !action || action.get('id') === undefined) {
                return;
            }
            executeAction({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                action: actionsData.actionsCollection.getExecuteAction(action),
                toolbarItem: action,
                clickEvent,
                toolbarSelectedKeys: [],
                opener: container,
                slice,
            });
        },
        [itemActionsMap, slice]
    );

    // Открывает меню, останавливает выполнение события.
    // По item определяем заранее подготовленный Source и строим меню по всем ItemActions.
    const openContextMenu = useStableCallback(
        (event: React.MouseEvent, item: Model): void => {
            if (!itemActionsMap) {
                return;
            }
            event.stopPropagation();
            event.preventDefault();
            const actionData = itemActionsMap.get(item.getKey());
            if (!actionData) {
                return;
            }
            const itemContainer = (event.target as HTMLDivElement).closest(
                ITEM_CONTAINER_SELECTOR
            ) as HTMLDivElement;
            ActionsMenuUtils.openItemActionsMenu({
                menuSource: actionData.menuSource,
                parentAction: null,
                clickEvent: event,
                popupOpener: menuPopupOpener,
                item,
                itemContainer,
                onActionClickHandler: executeItemAction,
                menuType: MENUTYPE.CONTEXT,
            });
        },
        [itemActionsMap, menuPopupOpener, executeItemAction]
    );

    // Инициализация при ведении мышкой по записи
    const onMouseMove = useStableCallback(() => {
        if (!actionsInitialized) {
            setActionsInitialized(true);
        }
    }, [actionsInitialized]);

    // Инициализация при свайпе по записи
    const onSwipe = useStableCallback(
        (event: React.SyntheticEvent, item: Model) => {
            let direction: string = (event.nativeEvent as unknown as { direction: string })
                .direction;
            if (!collection) {
                return;
            }
            const collectionItem = collection.getItemBySourceKey(item.getKey());
            if (localeController.currentLocaleConfig.directionality === 'rtl') {
                direction =
                    {
                        left: 'right',
                        right: 'left',
                    }[direction] || direction;
            }
            if (swipedItem) {
                event.nativeEvent.stopPropagation();
                // silent, т.к. перерисовка произойдёт по изменению контейнера
                const previousSwipedItem = collection.find((it) => {
                    return it?.isSwiped();
                });
                previousSwipedItem.setSwiped(false, true);
            }
            if (direction === 'left') {
                // TODO отметка маркером при свайпе. Нужно ли?
                collectionItem.setSwiped(true, true);
                if (!actionsInitialized) {
                    setActionsInitialized(true);
                }
                event.nativeEvent.stopPropagation();
                setSwipedItem(item.getKey());
            } else {
                setSwipedItem(null);
            }
            menuPopupOpener.close();
        },
        [swipedItem, setSwipedItem, collection, menuPopupOpener, actionsInitialized]
    );

    // Контекст.
    // Осторожно добавляем тут опции. Может приводить к перерисовке всех панелей действий на записяхю
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const contextValue: IContextValue = React.useMemo(() => {
        return {
            slice,
            onMouseMove,
            onSwipe,
            // Контекстное меню (правый клик).
            onContextMenu: openContextMenu,

            // Долгий тап по записи, открывает контекстное меню
            onLongTap: openContextMenu,
            actionsInitialized,
            menuDependencyLoader,
            menuPopupOpener,
            executeAction: executeItemAction,
            itemActionsMap,
            swipedItem,
        };
    }, [
        slice,
        onMouseMove,
        onSwipe,
        openContextMenu,
        actionsInitialized,
        menuDependencyLoader,
        menuPopupOpener,
        executeItemAction,
        itemActionsMap,
        swipedItem,
    ]);
    return <ItemActionsContext.Provider value={contextValue} children={children} />;
}

export default React.memo(ItemActionsContainer);
