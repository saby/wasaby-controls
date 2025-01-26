import { TOutputStyle } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';

export const getShortMWName = (sender: string) =>
    `[${sender.replace('Controls/listWebReducers:', '')}]`;

const _getLongMWName = (sender: string) => `middleware(${sender})`;

export const DURATION = (duration: number, _style: TOutputStyle) => `${duration}ms`;

export const FIRST_ACTION_INFO = (actionType: string | symbol, style: TOutputStyle) =>
    style === 'short'
        ? `API => action(${String(actionType)})`
        : `Запуск распространения действия(${String(actionType)}) из публичного API`;

export const ACTION_INFO = (actionType: string | symbol, sender: string, style: TOutputStyle) =>
    style === 'short'
        ? `${getShortMWName(sender)} => action(${String(actionType)})`
        : `${_getLongMWName(sender)} запустила распространение действия(${String(actionType)})`;

export const START_UPDATE_SESSION = (
    sliceName: string,
    sessionId: string,
    duration: number | undefined,
    style: TOutputStyle
) => {
    const base = `Update Slice(${sliceName}) #${sessionId}`;

    return typeof duration !== 'undefined' ? `${base} - ${DURATION(duration, style)}` : `${base}`;
};

export const SLICE_UPDATED = (name: string, duration: number | undefined, style: TOutputStyle) =>
    `Слайс [${name}] обновлен! Произошла перерисовка.` +
    (typeof duration === 'number' ? ' ' + DURATION(duration, style) : '');

export const HAS_NO_CHANGES = (_style: TOutputStyle) =>
    'Нет изменения в состоянии (Бесполезное обновление).';
