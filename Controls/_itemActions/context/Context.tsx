import * as React from 'react';
import { StickyOpener } from 'Controls/popup';
import { IAction, TKey } from 'Controls/interface';
import { MenuDependencyLoader } from 'Controls/_itemActions/menuDependency/MenuDependencyLoader';
import type { ListSlice } from 'Controls/dataFactory';
import type { Model } from 'Types/entity';
import type { IItemEventHandlers } from 'Controls/baseList';
import { TItemActionsCollectionsMap } from 'Controls/_itemActions/hooks/useItemActionsMap';

export type TExecuteAction = (
    action: Model<IAction>,
    item: Model,
    container: HTMLDivElement,
    nativeEvent: MouseEvent
) => void;

export interface IContextValue {
    swipedItem: TKey;
    onMouseMove: IItemEventHandlers['onMouseMove'];
    onContextMenu: IItemEventHandlers['onContextMenu'];
    onSwipe: IItemEventHandlers['onSwipeCallback'];
    onLongTap: IItemEventHandlers['onLongTapCallback'];
    // Открывашка для меню, чтобы можно открыть было только одно меню на странице
    menuPopupOpener: StickyOpener;
    // Флаг, что действия проинициализированы. Устанавливается в true при свайпе или при первом ховере,
    // Пока действия не проинициализированы, они не будут отрисованы.
    actionsInitialized: boolean;
    // Загрузчик зависимостей меню при ховере на итемакшн.
    // Должен срабатывать один раз, для списка.
    menuDependencyLoader: MenuDependencyLoader;
    // Списочный слайс
    slice: ListSlice;
    // Карта итемакшнов для всех записей
    itemActionsMap: TItemActionsCollectionsMap;

    // выполняет экшн
    executeAction: TExecuteAction;
    onHoverActionsPanelMouseEnter?: Function;
}

export const ItemActionsContext = React.createContext<IContextValue | null>(null);
