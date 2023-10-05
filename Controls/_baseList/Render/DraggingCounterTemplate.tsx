/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

interface IProps extends TInternalProps {
    itemsCount: number;
}

export default function DraggingCounterTemplate(props: IProps): React.ReactElement {
    // В днд мы можем получить максимум 100 записей, для производительности,
    // поэтому если записей больше 99 пишем 99+
    const MAX_DRAGGED_ITEMS = 99;
    const itemsCountString =
        props.itemsCount > MAX_DRAGGED_ITEMS ? '99+' : String(props.itemsCount);
    return <span className={'controls-ListView__item-dragging-counter'}>{itemsCountString}</span>;
}
