import { MIN_DISCHARGE } from '../constants';
import * as translate from 'i18n!Controls-Graphs';

interface IUnitsInfo {
    unit: string;
    discharge: number;
}

export const getUnitName = (digit: number): string => {
    const unitNames = {
        1: translate(''),
        1000: translate('тыс', 'Графики'),
        1000000: translate('млн', 'Графики'),
        1000000000: translate('млрд', 'Графики'),
        1000000000000: translate('трлн', 'Графики'),
        1000000000000000: translate('квдрл', 'Графики'),
        1000000000000000000: translate('квнтл', 'Графики'),
    };
    return unitNames[digit as keyof typeof unitNames];
};

export const getUnitsInfo = (maxValue: number, minDischarge: number): IUnitsInfo => {
    let counter: number = 0;
    const thousand: number = 1000;
    let maxTmp: number = Math.abs(maxValue);
    while (maxTmp >= minDischarge) {
        maxTmp = maxTmp / thousand;
        counter++;
    }
    const discharge: number = Math.pow(thousand, counter);
    const unit: string = getUnitName(discharge);
    return {
        unit,
        discharge,
    };
};

export const yAxisTitleFormatter = (positions: number[] = []): string => {
    const maxPosition: number = positions.length
        ? Math.max.apply(null, positions.map(Math.abs))
        : 0;
    const unitsInfo = getUnitsInfo(maxPosition, MIN_DISCHARGE);
    return unitsInfo.unit;
};
