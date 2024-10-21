import { default as TBaseControl, IBaseControlOptions } from 'Controls/_baseList/BaseControl';
import { CrudEntityKey } from 'Types/source';
import { checkWasabyEvent } from 'UI/Events';

export function beforeMarkedKeyChanged(
    newMarkedKey: CrudEntityKey,
    control: TBaseControl,
    options: IBaseControlOptions,
    cb: (key: CrudEntityKey) => void
): Promise<CrudEntityKey> | CrudEntityKey {
    // если список не замаунчен, то не нужно кидать события, события кинем после маунта
    const eventResult: Promise<CrudEntityKey> | CrudEntityKey = control._isMounted
        ? options.notifyCallback('beforeMarkedKeyChanged', [newMarkedKey])
        : undefined;

    let result = eventResult;
    if (eventResult instanceof Promise) {
        eventResult.then((key) => {
            cb(key);
            return key;
        });
    } else if (eventResult !== undefined && (control._environment || control.UNSAFE_isReact)) {
        // Если не был инициализирован environment, то _notify будет возвращать null,
        // но это значение используется, чтобы сбросить маркер. Актуально для юнитов
        cb(eventResult);
    } else {
        result = newMarkedKey;
        cb(newMarkedKey);
    }

    return result;
}

export function markedKeyChanged(
    newMarkedKey: CrudEntityKey,
    control: TBaseControl,
    options: IBaseControlOptions
): void {
    // если список не замаунчен, то не нужно кидать события, события кинем после маунта
    if (control._isMounted) {
        // Пытаемся вызвать React коллбек, если он есть
        checkWasabyEvent(options.onMarkedKeyChanged)?.(newMarkedKey);
        // Отправляем событие о смене маркера из BaseControl
        control._notify('markedKeyChanged', [newMarkedKey]);
    }
}
