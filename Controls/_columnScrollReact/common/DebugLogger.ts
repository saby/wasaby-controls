/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { PrivateContextUserSymbol } from '../context/ColumnScrollContext';
import { IColumnScrollWidths } from './interfaces';
import { EdgeState, TScrollIntoViewAlign } from './types';

interface IEdgesState {
    left: EdgeState;
    right: EdgeState;
}

const STYLES: Readonly<
    Record<
        'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark',
        [background: `${string}`, color: `${string}`]
    >
> = {
    primary: ['#cce5ff', '#004085'],
    secondary: ['#e2e3e5', '#383d41'],
    success: ['#d4edda', '#155724'],
    danger: ['#f8d7da', '#721c24'],
    warning: ['#fff3cd', '#856404'],

    info: ['#d1ecf1', '#0c5460'],
    light: ['#fefefe', '#818182'],
    dark: ['#d6d8d9', '#1b1e21'],
};

const consoleLog = (...args: Parameters<(typeof console)['log']>) => {
    // eslint-disable-next-line
    console.log(...args);
};

const log = (msg = '', style: keyof typeof STYLES = 'light') => {
    // eslint-disable-next-line
    consoleLog(`%c${msg}`, `background: ${STYLES[style][0]}; color: ${STYLES[style][1]};`);
};

/**
 * Логгер изменения состояний для отладки.
 * @private
 */
export class DebugLogger {
    protected constructor() {}

    private static _debug: boolean = false;

    static contextSizesUpdated(
        oldSizes: IColumnScrollWidths,
        newSizes: IColumnScrollWidths,
        privateContextUserSymbol?: typeof PrivateContextUserSymbol
    ) {
        if (!DebugLogger._debug) {
            return;
        }
        const hasRights = privateContextUserSymbol === PrivateContextUserSymbol;

        const getDiff = (name: keyof IColumnScrollWidths): string =>
            `${name}: ${oldSizes[name]} ${oldSizes[name] !== newSizes[name] ? '->' : '==='} ${
                newSizes[name]
            };`;

        const msg =
            `[${hasRights ? 'state' : 'Public'}] updateSizes(\n` +
            `${getDiff('viewPortWidth')}\n` +
            `${getDiff('contentWidth')}\n` +
            `${getDiff('startFixedWidth')}\n` +
            `${getDiff('endFixedWidth')}\n` +
            ');';

        log(msg, hasRights ? 'success' : 'danger');
    }

    static contextStateSetPosition(oldPosition: number, newPosition: number): void {
        if (!DebugLogger._debug) {
            return;
        }
        const msg = `[state] setPosition(${oldPosition} -> ${newPosition}) // Приватный сеттер стейта контекста.`;
        log(msg, 'light');
    }

    static bordersStateChanged(
        oldEdges: IEdgesState,
        newEdges: IEdgesState,
        type: 'edges' | 'triggers'
    ): void {
        if (!DebugLogger._debug) {
            return;
        }
        const msg =
            `${type}StateChanged({\n\t` +
            `left: ${oldEdges.left} ${oldEdges.left !== newEdges.left ? '->' : '==='} ${
                newEdges.left
            }\n\t` +
            `right: ${oldEdges.right} ${oldEdges.right !== newEdges.right ? '->' : '==='} ${
                newEdges.right
            }\n` +
            '})';
        log(msg, type === 'edges' ? 'success' : 'danger');
    }

    static contextSetPositionCalled(
        oldPosition: number,
        newPosition: number,
        smooth?: boolean,
        privateContextUserSymbol?: typeof PrivateContextUserSymbol
    ) {
        if (!DebugLogger._debug) {
            return;
        }
        const baseMsg = `[context method] setPositionCallback(${oldPosition} -> ${newPosition}, ${
            smooth ? 'smooth' : 'no smooth'
        }) `;

        if (privateContextUserSymbol === PrivateContextUserSymbol) {
            const msg =
                baseMsg +
                '// Публичный метод контекста позвался из компонента библиотеки ColumnScrollReact.';
            log(msg, 'success');
        } else {
            const msg =
                baseMsg + '// Публичный метод контекста, извне библиотеки ColumnScrollReact.';
            log(msg, 'warning');
        }
    }

    static contextSetPositionByGridControl(
        methodName: string,
        newPosition: number,
        smooth?: boolean
    ) {
        if (!DebugLogger._debug) {
            return;
        }
        const msg = `[gridControl::${methodName}] setPosition(${newPosition}, ${smooth}) `;
        log(msg, 'success');
    }

    static contextSetPositionByGridView(newPosition: number, smooth?: boolean) {
        if (!DebugLogger._debug) {
            return;
        }
        const msg = `[gridView] setPosition(${newPosition}, ${smooth}) // Это примерная позиция, может будет доскролл`;
        log(msg, 'success');
    }

    static contextSetPositionPublic(
        userControlName: string,
        newPosition: number,
        smooth?: boolean
    ) {
        if (!DebugLogger._debug) {
            return;
        }
        const msg = `[${userControlName}] setPosition(${newPosition}, ${smooth}) `;
        log(msg, 'danger');
    }

    static contextScrollIntoViewPublic(
        target: HTMLElement | number,
        align?: TScrollIntoViewAlign,
        smooth?: boolean
    ) {
        if (!DebugLogger._debug) {
            return;
        }
        const msg = `[Grid public API::scrollIntoView(${
            typeof target === 'number' ? target : 'target'
        }, ${align}, ${smooth}) `;
        log(msg, 'danger');
        if (typeof target !== 'number') {
            consoleLog(target);
        }
    }

    static setDebug(debug: boolean): void {
        DebugLogger._debug = debug;
    }
}
