/*
 * Файл содержит компонент-обертку над строкой, которая может редактироваться
 */

import * as React from 'react';
import { FocusArea } from 'UI/Focus';
import { IItemEventHandlers } from 'Controls/baseList';
import { TItem } from 'Controls/_grid/gridReact/CommonInterface';
import { EventSubscriber } from 'UICore/Events';
import { Container as ValidateContainer } from 'Controls/validate';

interface IProps {
    handlers: IItemEventHandlers;
    item: TItem;
    onValidateCreated: (control: ValidateContainer) => void;
    onValidateDestroyed: (control: ValidateContainer) => void;
}

/*
 * Обертка над строкой, чтобы FocusArea прокинул колбек onDeactivated до ближайшего FocusRoot.
 * Делаем это оберткой, чтобы FocusArea был только вокруг единственной строки, которая в данный момент редактируется.
 * Во всех других кейсах FocusArea не нужен. Также оборачиваем редактируемую строку в EventSubscriber,
 * чтобы подписаться/отписаться от валидаторов, если они есть.
 */
export default function EditRowWrapper(props: React.PropsWithChildren<IProps>) {
    const { handlers, item, onValidateDestroyed, onValidateCreated, children } = props;
    const onDeactivatedCallback = handlers.onDeactivatedCallback;
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );
    return (
        <FocusArea onDeactivated={onDeactivated}>
            <EventSubscriber
                onValidateCreated={onValidateCreated}
                onValidateDestroyed={onValidateDestroyed}
            >
                {children}
            </EventSubscriber>
        </FocusArea>
    );
}
