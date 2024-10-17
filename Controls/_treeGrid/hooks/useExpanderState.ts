import * as React from 'react';

import { SyntheticEvent } from 'UICommon/Events';

import { CollectionItemContext } from 'Controls/baseList';
import { TreeItem } from 'Controls/baseTree';

interface IExpanderState {
    item: TreeItem;
    expanded: boolean;
}

function getExpanderState(item: TreeItem): IExpanderState {
    return {
        item,
        expanded: item.isExpanded(),
    };
}

/**
 * Хук вызывает перерисовку при изменении отслеживаемых состояний записи коллекции
 * @param observableStates Отслеживаемые состояния
 * @remark
 * Приватный хук, который позволяет отслеживать любые состояния записей.
 */
function useObservableItemStates(): void {
    const item = React.useContext(CollectionItemContext);
    const [_version, setVersion] = React.useState(0);

    React.useEffect(() => {
        const handler = (_: SyntheticEvent) => {
            setVersion((prev) => prev + 1);
        };

        item.subscribe('stateChanged', handler);
        return () => {
            return item.unsubscribe('stateChanged', handler);
        };
    }, [item]);
}

/**
 * Хук для получения состояния экспандера.
 */
export function useExpanderState(): IExpanderState {
    const item = React.useContext(CollectionItemContext);
    useObservableItemStates();
    return getExpanderState(item);
}
