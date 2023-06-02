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
 * Хук для получения состояния записи.
 */
export function useItemState(watchedStates: ItemState[]): ItemStates {
    const item = React.useContext(CollectionItemContext);
    const [itemState, setItemState] = React.useState(getItemState(item));

    React.useEffect(() => {
        const handler = (_: SyntheticEvent, state: ItemState) => {
            if (watchedStates.includes(state)) {
                setItemState(getItemState(item));
            }
        };

        item.subscribe('stateChanged', handler);
        return () => {
            return item.unsubscribe('stateChanged', handler);
        };
    }, [item]);

    return itemState;
}
