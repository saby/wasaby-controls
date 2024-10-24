/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TDebugMode } from '../types/TDebugMode';
import { IOutputConfig, TOutputStyle } from '../output/IOutput';

const DEFAULT_MODE = 'Changes';

export const parseCookieValue = (
    value: string
): {
    debugMode: TDebugMode;
    outputConfig: IOutputConfig;
    names: string[];
} => {
    const options = new Map(
        value
            .split('|')
            .map((o) => {
                const pair = o.trim().split('=');
                if (pair.length !== 2) {
                    return [];
                }
                return [pair[0].trim().toLowerCase(), pair[1].trim().toLowerCase()];
            })
            .filter((i) => i.length) as [string, string][]
    );

    const oMode = options.get('mode');
    const modeVars: TDebugMode[] = ['Dev', 'DevMin', 'DevMax', 'Changes', 'State', 'Time'];
    const debugMode: TDebugMode = !oMode
        ? DEFAULT_MODE
        : modeVars[modeVars.findIndex((i) => i.toLowerCase() === oMode)] || DEFAULT_MODE;

    const oStyle = options.get('style');
    let style: TOutputStyle;

    switch (oStyle || '') {
        case 'long':
            style = debugMode === 'DevMax' ? 'All' : 'Significant';
            break;
        case 'short':
            style = debugMode === 'DevMax' ? 'AllShort' : 'SignificantShort';
            break;
        default:
            style =
                debugMode === 'DevMax'
                    ? 'All'
                    : debugMode === 'DevMin'
                    ? 'SignificantShort'
                    : 'Significant';
            break;
    }

    const oNames = options.get('slice');
    const names = !oNames
        ? []
        : oNames
              .split(',')
              .map((i) => i.trim())
              .filter((i) => !!i);

    return {
        debugMode,
        outputConfig: { style },
        names,
    };
};
