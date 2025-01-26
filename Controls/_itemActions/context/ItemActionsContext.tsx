import * as React from 'react';
import { Collection } from 'Controls/display';
import { StickyOpener } from 'Controls/popup';
import { controller as localeController } from 'I18n/singletonI18n';
import { BaseAction } from 'Controls/actions';
import { Model } from 'Types/entity';
import type { IItemEventHandlers } from 'Controls/baseList';
import { TKey, IAction } from 'Controls/interface';
import { MenuDependencyLoader } from 'Controls/_itemActions/menuDependency/MenuDependencyLoader';
import { IContextMenuConfig } from 'Controls/_itemActions/interface/IContextMenuConfig';
import { useTheme } from 'UI/Contexts';

export interface IContextValue {
    swipedItem: TKey;
    // Клик по действию над записью, вызывает колбек с уровня LCC
    onActionClick: Function;
    // Открывашка для меню, чтобы можно открыть было только одно меню на странице
    menuPopupOpener: StickyOpener;
    // Флаг, что действия проинициализированы. Устанавливается в true при свайпе или при первом ховере,
    // Пока действия не проинициализированы, они не будут отрисованы.
    actionsInitialized: boolean;
    // Загрузчик зависимостей меню при ховере на итемакшн.
    // Должен срабатывать один раз, для списка.
    menuDependencyLoader: MenuDependencyLoader;
}

export const ItemActionsContext = React.createContext<IContextValue>(null);

interface IItemActionsContextProvider {
    collection: Collection;
    onActionClickNew: Function;
    children: React.ReactElement;
    itemHandlers: IItemEventHandlers;
    contextMenuConfig?: IContextMenuConfig;
}

// Контекст поставляет модель, обработчик свайпа, ховер, всё что относится целиком к списку.

export default function Provider(props: IItemActionsContextProvider) {
    const theme = useTheme(props);
    const [swipedItem, setSwipedItem] = React.useState<TKey>(null);
    const [actionsInitialized, setActionsInitialized] = React.useState<boolean>(false);
    const menuDependencyLoader = React.useMemo(() => {
        return new MenuDependencyLoader({
            contextMenuConfig: props.contextMenuConfig,
            theme,
        });
    }, [props.contextMenuConfig, theme]);
    const menuPopupOpener = new StickyOpener();

    // Свайп по записи
    const onSwipeCallback = (event: React.SyntheticEvent, item: Model): void => {
        let direction: string = event.nativeEvent.direction;
        const collectionItem = props.collection.getItemBySourceKey(item.getKey());
        if (localeController.currentLocaleConfig.directionality === 'rtl') {
            direction =
                {
                    left: 'right',
                    right: 'left',
                }[direction] || direction;
        }
        const previousSwipedItem = props.collection.find((it) => {
            return it?.isSwiped();
        });
        if (previousSwipedItem) {
            event.nativeEvent.stopPropagation();
            // silent, т.к. перерисовка произойдёт по изменению контекста
            previousSwipedItem.setSwiped(false, true);
        }
        if (direction === 'left') {
            // TODO отметка маркером при свайпе. Нужно ли?
            // this._options.mark(key, this, this._options);
            // silent, т.к. перерисовка произойдёт по изменению контекста
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
    };

    // Инициализация действий над записью при движении мышкой
    const onMouseMoveCallback = (event: React.SyntheticEvent, item: Model): void => {
        if (props.itemHandlers.onMouseMoveCallback) {
            props.itemHandlers.onMouseMoveCallback(event, item);
        }
        if (!actionsInitialized) {
            setActionsInitialized(true);
        }
    };

    const onActionClick = (
        action: IAction | BaseAction,
        item: Model,
        container: HTMLDivElement,
        nativeEvent: MouseEvent
    ): void => {
        props.onActionClickNew?.(action, item, container, nativeEvent);
    };

    const value: IContextValue = React.useMemo(() => {
        return {
            swipedItem,
            onActionClick,
            menuPopupOpener,
            actionsInitialized,
            menuDependencyLoader,
        };
    }, [swipedItem, actionsInitialized]);

    const itemHandlers: IItemEventHandlers = React.useMemo(() => {
        return {
            ...props.itemHandlers,
            onMouseMoveCallback,
            onSwipeCallback,
        };
    }, []);

    return (
        <ItemActionsContext.Provider value={value}>
            {React.cloneElement(props.children, { ...props, itemHandlers })}
        </ItemActionsContext.Provider>
    );
}
