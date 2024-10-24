/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TOutputStyle } from './output/IOutput';

export const START_UPDATE_SESSION = (sessionName: string, _style: TOutputStyle) =>
    `Обновление слайса ${sessionName}`;

export const DISPATCH_DURATION = (duration: number, _style: TOutputStyle) =>
    'Длительность: ' + +duration.toFixed(2) + 'ms.';

export const FIRST_ACTION_INFO = (actionType: string, style: TOutputStyle) => {
    if (style === 'AllShort' || style === 'SignificantShort') {
        return `API => action(${actionType})`;
    } else {
        return `Запуск распространения действия(${actionType}) из публичного API`;
    }
};

export const TRACE = () => 'Стек вызовов';

export const ACTION_INFO = (actionType: string, sender: string, style: TOutputStyle) => {
    if (style === 'AllShort' || style === 'SignificantShort') {
        return `middleware[${sender.replace(
            'Controls/listWebReducers:',
            ''
        )}] => action(${actionType})`;
    } else {
        return `middleware-функция(${sender}) запустила распространение действия(${actionType})`;
    }
};

export const OUTER_SLICE_STATE_UPDATE = (_style: TOutputStyle) =>
    'Итоговые изменения, которые будут применены на Slice';

export const INNER_SLICE_STATE_UPDATE = (_style: TOutputStyle) =>
    'Обновление внутреннего состояния.';

export const IMMEDIATE_SLICE_STATE_UPDATE = (_style: TOutputStyle) =>
    'Обновление состояния Slice. Это незамедлительное применение нового состояния.';

const _USELESS_STATE_UPDATE = (
    type: 'immediate' | 'inner',
    sender: string | undefined,
    _style: TOutputStyle
) =>
    `Ошибка. ${sender ? `Из [${sender}] вызвано` : 'Вызвано'} ${
        type === 'immediate'
            ? 'незамедлительное обновления состояния Slice'
            : 'обновление внутреннего состояния'
    }, но переданное состояние не отличается от текущего`;

export const USELESS_STATE_UPDATE = (type: 'immediate' | 'inner', style: TOutputStyle) =>
    _USELESS_STATE_UPDATE(type, undefined, style);

export const USELESS_STATE_UPDATE_DETAILED = (
    type: 'immediate' | 'inner',
    sender: string | undefined,
    style: TOutputStyle
) => _USELESS_STATE_UPDATE(type, sender, style);

export const HAS_NO_CHANGES = (_style: TOutputStyle) =>
    'Нет изменения в состоянии (Бесполезное обновление).';

export const COMPLEX_UPDATE_CHANGES = (_style: TOutputStyle) => 'Входящие изменения';
