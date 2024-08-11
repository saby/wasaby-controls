import * as React from 'react';
import { constants } from 'Env/Env';

type TSupportedHotKeys = keyof Pick<typeof constants.key, 'up' | 'down'>;

export default function (
    e: React.KeyboardEvent,
    handlers: Partial<Record<TSupportedHotKeys, (e) => void>>
) {
    const handler = handlers[e.nativeEvent.code] || handlers[e.nativeEvent.keyCode];
    if (handler) {
        e.stopPropagation();
        handler(e);
    }
}
