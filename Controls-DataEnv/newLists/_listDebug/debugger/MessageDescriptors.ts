export const START_UPDATE_SESSION = (sessionName: string) => `Обновление ListSlice ${sessionName}`;
export const DISPATCH_DURATION = (duration: number) =>
    'Длительность: ' + +duration.toFixed(2) + 'ms.';

export const FIRST_ACTION_INFO = (actionType: string) =>
    `Запуск распространения действия(${actionType}) из публичного API`;

export const ACTION_INFO = (actionType: string, sender: string) =>
    `middleware-функция(${sender}) запустила распространение действия(${actionType})`;

export const OUTER_SLICE_STATE_UPDATE = () =>
    'Итоговые изменения, которые будут применены на Slice';

export const INNER_SLICE_STATE_UPDATE = () => 'Обновление внутреннего состояния.';
export const IMMEDIATE_SLICE_STATE_UPDATE = () =>
    'Обновление состояния Slice. Это незамедлительное применение нового состояния.';

export const USELESS_STATE_UPDATE = (type: 'immediate' | 'inner') =>
    `Ошибка. Вызвано ${
        type === 'immediate'
            ? 'незамедлительное обновления состояния Slice'
            : 'обновление внутреннего состояния'
    }, но переданное состояние не отличается от текущего`;

export const COMPLEX_UPDATE_CHANGES = () => 'Входящие изменения';
