/*
 * Файл содержит компонент GroupRowComponent, который используется для рендера колонок групп,
 * а также вспомогательные методы
 */

import * as React from 'react';
import { groupConstants, IItemEventHandlers } from 'Controls/baseList';
import { IGroupRowComponentProps } from 'Controls/_gridReact/group/interface';
import RowComponent from 'Controls/_gridReact/row/RowComponent';
import { useItemData } from 'Controls/_gridReact/hooks/useItemData';

function isHiddenGroup(contents: string): boolean {
    return contents === groupConstants.hiddenGroup;
}

/*
 * Чистит массив обработчиков, удаляя те, которые для группы не поддерживаются.
 */
function clearEventHandlers(handlers: IItemEventHandlers): IItemEventHandlers {
    const resultHandlers = { ...handlers };
    ['onMouseDown', 'onMouseUp'].forEach((handler) => {
        delete resultHandlers[`${handler}Callback`];
    });
    return resultHandlers;
}

/*
 * Компонент для рендера колонок групп.
 */
function GroupRowComponent(props: IGroupRowComponentProps): React.ReactElement {
    const { item } = useItemData();
    const handlers = clearEventHandlers(props.handlers);
    let className = ` controls-ListView__group${
        isHiddenGroup(item as unknown as string) ? 'Hidden' : ''
    }`;
    if (props.className) {
        className += ` ${props.className}`;
    }
    return <RowComponent {...props} handlers={handlers} className={className} data-qa={'group'} />;
}

export default React.memo(GroupRowComponent);
