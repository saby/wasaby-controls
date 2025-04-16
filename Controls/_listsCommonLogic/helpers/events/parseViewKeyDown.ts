import * as React from 'react';
import { constants } from 'Env/Env';

type TSupportedHotKeys = keyof Pick<typeof constants.key, 'up' | 'down'>;

export default function (
    e: React.KeyboardEvent,
    handlers: Partial<Record<TSupportedHotKeys, (e: React.KeyboardEvent) => void>>
) {
    const handler =
        handlers[e.nativeEvent.code as TSupportedHotKeys] ||
        handlers[e.nativeEvent.keyCode.toString() as TSupportedHotKeys];
    if (handler) {
        e.stopPropagation();
        handler(e);
    }
}
