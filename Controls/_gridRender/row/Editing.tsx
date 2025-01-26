/*
 * Файл содержит компонент-обертку над строкой, которая может редактироваться
 */

import { TItem } from 'Controls/_gridRender/interface/CommonInterface';
import { helpers } from 'Controls/listsCommonLogic';
import { Container as ValidateContainer } from 'Controls/validate';
import { FocusArea } from 'UI/Focus';
import { EventSubscriber } from 'UICore/Events';
import * as React from 'react';

interface IProps {
    handlers: helpers.IItemEventHandlers;
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
export default function Editing(props: React.PropsWithChildren<IProps>) {
    const { handlers, item, onValidateDestroyed, onValidateCreated, children } = props;
    const onDeactivatedCallback = handlers.onDeactivatedCallback;
    const onDeactivated = React.useCallback(
        (options) => {
            return onDeactivatedCallback(item, options);
        },
        [onDeactivatedCallback, item]
    );
    // fakeDOM={true} добавлен из-за особенностей ядра. Обработчики событий вызываются вначале для wml-контролов.
    // isolateEventScope={true} добавлен из-за особенностей ядра. Надо изолировать регистрацию события onValidateCreated для списка
    // т.к. список могут обернуть в другой ValidateContainer и он тоже зарегистрирует событие.
    // На стороне списка сейчас чистый react, а значит обработчик списка будет позван после прикладных wml-оберток.
    // Пример такой ошибки - FormController над списком:
    // https://online.sbis.ru/opendoc.html?guid=ef930719-5ce7-4cb3-89c8-ac290db93d98
    // Единственный адекватный выход - перевод ValidateContainer на react и на использование контектов.
    // Тогда костыль станет неактуальным
    return (
        <FocusArea onDeactivated={onDeactivated}>
            <EventSubscriber
                fakeDOM={true}
                isolateEventScope={true}
                onValidateCreated={onValidateCreated}
                onValidateDestroyed={onValidateDestroyed}
            >
                {children}
            </EventSubscriber>
        </FocusArea>
    );
}
