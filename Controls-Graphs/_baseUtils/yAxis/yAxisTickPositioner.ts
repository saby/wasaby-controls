import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';
import { BASE_TICS, NUMBER_DIGITS_DIVIDER, STEPS_VARIANTS } from '../constants';

type TStepVariant = { value: number; difference: number };
type TTicksConfig = {
    count?: number;
    interval?: number;
};
type TMinMaxValues = { minValue: number; maxValue: number };

const getAxisTicks = (minValue: number, step: number, stepsCount: number): number[] => {
    const result = [];
    const minTickValue = Math.floor((minValue < 0 ? minValue : 0) / step) * step;
    for (let i = 0; i < stepsCount; i++) {
        result.push(minTickValue + step * i);
    }
    return result;
};

const getGraphExtremum = (data?: ISingleItem[], series?: ISingleSeriesItem[]): TMinMaxValues => {
    let maxValue = 0;
    let minValue = 0;

    const iterateCallback = (item: number) => {
        if (item) {
            maxValue = Math.max(maxValue, item);
            minValue = Math.min(minValue, item);
        }
    };

    const dataArray: number[] = [];
    if (!!series?.length && !!data?.length) {
        series.forEach((serie) => {
            data.forEach((dataItem) => {
                dataArray.push(dataItem[serie.valueProperty] as number);
            });
        });
    }

    dataArray.forEach(iterateCallback);

    return { minValue, maxValue };
};

export const getNearestCorrectStep = (step: number): number => {
    const roundedStep = Math.ceil(step);
    let zerosPart = Math.pow(NUMBER_DIGITS_DIVIDER, String(roundedStep).length - 2);
    if (zerosPart < 1) {
        zerosPart = 1;
    }
    const firstTwoDigitsNumber = Math.ceil(roundedStep / zerosPart);
    const availableDivider = STEPS_VARIANTS.reduce((accumulator, variant) => {
        return (accumulator || (firstTwoDigitsNumber <= variant && variant)) as number;
    }, 0);
    return Math.ceil(firstTwoDigitsNumber / availableDivider) * availableDivider * zerosPart;
};

const getTicksCountByStep = (
    step: number,
    maxValue: number,
    additionalValue: number | null
): number => {
    let ticksCount = Math.ceil(maxValue / step);
    if (additionalValue) {
        ticksCount += Math.ceil(additionalValue / step);
    }
    return ticksCount + 1;
};

export const yAxisTickPositioner = (
    data: ISingleItem[] = [],
    series: ISingleSeriesItem[] = []
): number[] | undefined => {
    const { minValue, maxValue } = getGraphExtremum(data, series);
    const absMaxValue = Math.abs(maxValue);
    const absMinValue = Math.abs(minValue);
    const absMaxData = Math.max(absMaxValue, absMinValue);
    const isDifferentSigns = maxValue * minValue < 0;
    const lessData = absMaxValue < absMaxData ? absMaxValue : absMinValue;
    const availableTicksCount = BASE_TICS.map((tickCount) => {
        if (isDifferentSigns) {
            return tickCount - 1;
        }
        return tickCount;
    });
    if (absMaxData < NUMBER_DIGITS_DIVIDER) {
        return undefined;
    }
    const stepsVariants: TStepVariant[] = [];
    for (let i = 0; i < availableTicksCount.length; i++) {
        const ticksCount = availableTicksCount[i];
        const step = absMaxData / ticksCount;
        const correctStep = getNearestCorrectStep(step);
        stepsVariants.push({
            value: correctStep,
            difference: correctStep - (absMaxData % correctStep),
        });
    }
    stepsVariants.sort((item1, item2) => {
        return item1.difference - item2.difference;
    });
    let ticksConfig: TTicksConfig = {};
    const additionalValue = isDifferentSigns ? lessData : null;
    stepsVariants.some((item) => {
        const ticksVariant = getTicksCountByStep(item.value, absMaxData, additionalValue);
        if (BASE_TICS.includes(ticksVariant)) {
            ticksConfig = {
                count: ticksVariant,
                interval: item.value,
            };
            return true;
        }
    });
    return (
        (ticksConfig as TTicksConfig) &&
        getAxisTicks(minValue, ticksConfig.interval as number, ticksConfig.count as number)
    );
};
