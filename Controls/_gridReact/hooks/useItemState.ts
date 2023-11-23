import * as React from 'react';

import { SyntheticEvent } from 'UICommon/Events';

import { CollectionItem } from 'Controls/display';
import { CollectionItemContext } from 'Controls/baseList';

type ItemState = 'marked' | 'selected';
type ItemStates = Record<ItemState, boolean>;

function getItemState(item: CollectionItem): ItemStates {
    return {
        marked: item.isMarked(),
        selected: item.isSelected(),
    };
}

/**
 * Хук вызывает перерисовку при изменении отслеживаемых состояний записи коллекции
 * @param observableStates Отслеживаемые состояния
 * @remark
 * Приватный хук, который позволяет отслеживать любые состояния записей.
 * Используется, например, чтобы получить все необходимые значения для чекбокса или для маркера.
 */
export function useObservableItemStates(observableStates: string[]): void {
    const item = React.useContext(CollectionItemContext);
    const [_version, setVersion] = React.useState(0);

    React.useEffect(() => {
        const handler = (_: SyntheticEvent, state: string) => {
            if (observableStates.includes(state)) {
                setVersion((prev) => prev + 1);
            }
        };

        item.subscribe('stateChanged', handler);
        return () => {
            return item.unsubscribe('stateChanged', handler);
        };
    }, [item]);
}

/**
 * Хук для получения состояния записи.
 */
export function useItemState(watchedStates: ItemState[]): ItemStates {
    const item = React.useContext(CollectionItemContext);
    useObservableItemStates(watchedStates);
    return getItemState(item);
}
