import { TDebugMode } from '../types/TDebugMode';
import { IOutputConfig, TOutputStyle } from '../output/IOutput';

const DEFAULT_MODE = 'Dev';

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
    const modeVars: TDebugMode[] = ['Dev', 'D', 'DevMin', 'DevMax', 'Changes', 'State', 'Time'];
    let debugMode: TDebugMode = !oMode
        ? DEFAULT_MODE
        : modeVars[modeVars.findIndex((i) => i.toLowerCase() === oMode)] || DEFAULT_MODE;

    const alias = {
        D: 'Dev',
    } as const;

    if (debugMode in alias) {
        debugMode = alias[debugMode as keyof typeof alias];
    }

    const oStyle = options.get('style');
    const style: TOutputStyle = oStyle === 'long' || oStyle === 'l' ? 'long' : 'short';

    return {
        debugMode,
        outputConfig: { style },
        names: getNames(options.get('slice')),
    };
};

const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

const getNames = (raw?: string) => {
    if (!raw) {
        return [];
    }

    return unique(
        raw
            .split(',')
            .map((i) => i.trim())
            .filter((i) => !!i)
    );
};
