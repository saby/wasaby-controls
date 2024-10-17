/*
 * Файл содержит компонент-обертку над строкой, которая может редактироваться
 */

import * as React from 'react';
import { FocusArea } from 'UI/Focus';
import { IItemEventHandlers } from 'Controls/baseList';
import { TItem } from 'Controls/_grid/gridReact/CommonInterface';
import {BubblingEventContext, EventSubscriber} from 'UICore/Events';
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
    // Infobox пользуется общим контекстом EventSubscriber объявленным на уровне Application для открытия/закрытия окна.
    // Т.к. в этом месте изолируется контекст, у Infobox есть доступ только к тем методам, которые описаны здесь.
    // Временно спроксируем открытие инфобокса.
    // TODO: Удалить https://online.sbis.ru/opendoc.html?guid=3e97f57b-f818-4d4e-b441-127c260802b3&client=3
    const globalContext = React.useContext(BubblingEventContext);
    const onOpenInfoBoxFix = React.useCallback((...args) => {
            globalContext.onOpenInfoBox(...args);
        }, []);
    const onCloseInfoBoxFix = React.useCallback((...args) => {
            globalContext.onCloseInfoBox(...args);
        }, []);
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
                onOpenInfoBoxFix={onOpenInfoBoxFix}
                onCloseInfoBoxFix={onCloseInfoBoxFix}
            >
                {children}
            </EventSubscriber>
        </FocusArea>
    );
}
