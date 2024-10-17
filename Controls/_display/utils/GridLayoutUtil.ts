/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { detection } from 'Env/Env';
import isFullGridSupport from './GridSupportUtil';

// 1) N%, где N - число больше или равно 0
// 2) Npx, где N - число больше или равно 0
// 3) Nfr, где N - число больше или равно 1
// 4) constants = auto|min-content|max-content
// 5) fit-content = fit-content(N%|Npx|Nfr|constants)
// 6) minmax(N, N), где N - валидные значения в px, %, fr, либо константы auto, min-content, max-content

const _PX = '(([1-9][0-9]*px)|0px)';
const _PERCENT = '(([1-9][0-9]*%)|0%)';
const _FR = '((([1-9].[0-9]*)|(0.[0-9]*[1-9]+[0-9]*)|([1-9][0-9]*))fr)';
const _CONSTANTS = '(auto|min-content|max-content)';
const _FIT_CONTENT = `(fit-content\\((${_PX}|${_PERCENT}|${_FR})\\))`;
const _MIN_MAX_PART = `(${_PX}|${_PERCENT}|${_FR}|${_CONSTANTS})`;
const _MIN_MAX = `(minmax\\(${_MIN_MAX_PART},\\s?${_MIN_MAX_PART}\\))`;

const VALID_GRID_COLUMN_WIDTH_VALUE = new RegExp(
    `^(${_PX}|${_PERCENT}|${_FR}|${_FIT_CONTENT}|${_CONSTANTS}|${_MIN_MAX})$`
);

const VALID_LEFT_STICKY_GRID_COLUMN_WIDTH_VALUE = new RegExp(`^(${_PX})$`);

const DEFAULT_GRID_COLUMN_WIDTH = '1fr';
const DEFAULT_TABLE_COLUMN_WIDTH = 'auto';

interface ICssRule {
    name: string;
    value: string | number;
    applyIf?: boolean;
}

function toCssString(cssRules: ICssRule[]): string {
    let cssString = '';

    cssRules.forEach((rule) => {
        // Применяем правило если нет условия или оно задано и выполняется
        cssString +=
            !rule.hasOwnProperty('applyIf') || !!rule.applyIf
                ? `${rule.name}: ${rule.value}; `
                : '';
    });

    return cssString.trim();
}

function getTemplateColumnsStyle(columnsWidth: (string | number)[]): string {
    const widths = columnsWidth.join(' ');
    return toCssString([
        {
            name: 'grid-template-columns',
            value: widths,
        },
        {
            name: '-ms-grid-columns',
            value: widths,
            applyIf: detection.isIE,
        },
    ]);
}

function getDefaultColumnWidth(): string {
    return isFullGridSupport() ? DEFAULT_GRID_COLUMN_WIDTH : DEFAULT_TABLE_COLUMN_WIDTH;
}

function isValidWidthValue(widthValue: string): boolean {
    return !!widthValue.trim().match(VALID_GRID_COLUMN_WIDTH_VALUE);
}

function isValidLeftStickyWidthValue(widthValue: string): boolean {
    return !!widthValue.trim().match(VALID_LEFT_STICKY_GRID_COLUMN_WIDTH_VALUE);
}

export default {
    toCssString,
    getDefaultColumnWidth,
    getTemplateColumnsStyle,
    isValidWidthValue,
    isValidLeftStickyWidthValue,
};
