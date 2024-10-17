import { Control } from 'UI/Base';
import { IListenerOptions } from './Listener';

// в мобильной версии событие скрола надо регистрировать на боди
// но делается это через другое событие чтобы не ломать совместимость
const SCROLL_EVENT_LIST = [
    'scrollStateChanged',
    'listScroll',
    'virtualScrollMove',
    'customscroll',
    'virtualNavigation',
    'viewportResize',
];

export function register(
    instance: Control,
    event: String,
    callback: Function,
    config?: IListenerOptions
) {
    instance._notify('register', [event, instance, callback, config], {
        bubbling: true,
    });
    if (SCROLL_EVENT_LIST.includes(event.toString())) {
        instance._notify('registerScroll', [event, instance, callback, config], {
            bubbling: true,
        });
    }
}

export function unregister(instance: Control, event: String, config?: IListenerOptions) {
    instance._notify('unregister', [event, instance, config], {
        bubbling: true,
    });
    if (SCROLL_EVENT_LIST.includes(event.toString())) {
        instance._notify('unregisterScroll', [event, instance, config], {
            bubbling: true,
        });
    }
}
