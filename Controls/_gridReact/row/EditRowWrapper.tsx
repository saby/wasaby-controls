import * as React from 'react';
import { useFocusCallbacks } from 'UICore/Focus';
import { IItemEventHandlers } from 'Controls/baseList';
import { TItem } from 'Controls/_gridReact/CommonInterface';

interface IProps {
    handlers: IItemEventHandlers;
    item: TItem;
}

/**
 * Обертка над строкой, чтобы прокинуть ref, который будет вызывать событие onDeactivated
 * Делаем это оберткой, чтобы ref вешать на единственную строку, которая в данный момент редактируется.
 * Во всех других кейсах этот ref не нужен
 */
export default function EditRowWrapper(props: React.PropsWithChildren<IProps>) {
    const ref = useFocusCallbacks({
        onDeactivated: (options) => {
            return props.handlers.onDeactivatedCallback(props.item, options);
        },
    });

    return React.cloneElement(props.children, { deactivatedRef: ref });
}
