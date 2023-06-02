import * as React from 'react';
import { FocusArea } from 'UI/Focus';
import { IItemEventHandlers } from 'Controls/baseList';
import { TItem } from 'Controls/_gridReact/CommonInterface';

interface IProps {
    handlers: IItemEventHandlers;
    item: TItem;
}

/**
 * Обертка над строкой, чтобы FocusArea прокинул колбек onDeactivated до ближайшего FocusRoot.
 * Делаем это оберткой, чтобы FocusArea был только вокруг единственной строки, которая в данный момент редактируется.
 * Во всех других кейсах FocusArea не нужен.
 */
 export default function EditRowWrapper(props: React.PropsWithChildren<IProps>) {
    const onDeactivatedCallback = props.handlers.onDeactivatedCallback;
    const item = props.item;
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );
    return <FocusArea onDeactivated={onDeactivated}>{props.children}</FocusArea>;
}