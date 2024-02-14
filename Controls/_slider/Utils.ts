/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { Logger } from 'UI/Utils';
import { ISliderBaseOptions } from './Base';
import { ISliderRangeOptions } from './Range';
import { IInterval } from './interface/IInterval';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';

export interface IScaleData {
    value: number;
    position: number;
}

export interface ILineData {
    position: number;
    width: number;
}

export interface IPointData {
    name: string;
    position: number;
}

export interface IPositionedInterval {
    color: string;
    start: number;
    width: number;
}

export type IPointDataList = IPointData[];
const maxPercentValue = 100;
const minPercentValue = 0;
const stepDenominator = 2;
const baseTooltipPadding = 6;
export default {
    _defaultLabelFormatter(value: number): number {
        // Округляем значение до 2х знаков после запятой
        // Потому что это js и 0.6 + 0.3 = 0.8999999999999999
        const valueFixed: string = value.toFixed(2);
        return parseFloat(valueFixed);
    },
    getRatio(
        pos: number,
        left: number,
        right: number,
        width: number,
        inverted: boolean = false
    ): number {
        return inverted ? (right - pos) / width : (pos - left) / width;
    },
    calcValue(minValue: number, maxValue: number, ratio: number, perc: number): number {
        const rangeLength = maxValue - minValue;
        const val = minValue + Math.max(Math.min(ratio, 1), 0) * rangeLength;
        return parseFloat(val.toFixed(perc));
    },
    checkOptions(opts: ISliderBaseOptions | ISliderRangeOptions): void {
        if (opts.minValue >= opts.maxValue) {
            Logger.error('Slider: minValue must be less than maxValue.');
        }
        if (opts.scaleStep < 0) {
            Logger.error('Slider: scaleStep must be positive.');
        }
    },
    getScaleData(
        minValue: number,
        maxValue: number,
        scaleStep: number,
        formatter: Function = this._defaultLabelFormatter
    ): IScaleData[] {
        const scaleData: IScaleData[] = [];

        if (scaleStep > 0) {
            const scaleRange = maxValue - minValue;
            scaleData.push({ value: formatter(minValue), position: 0 });
            for (
                let i = minValue + scaleStep;
                i <= maxValue - scaleStep / stepDenominator;
                i += scaleStep
            ) {
                scaleData.push({
                    value: formatter(i),
                    position: ((i - minValue) / scaleRange) * maxPercentValue,
                });
            }
            scaleData.push({ value: formatter(maxValue), position: 100 });
        }
        return scaleData;
    },
    getNativeEventPageX(event: MouseEvent | TouchEvent): number {
        return DimensionsMeasurer.getRelativeMouseCoordsByMouseEvent(event).x;
    },

    getNativeEventPageY(event: MouseEvent | TouchEvent): number {
        return DimensionsMeasurer.getRelativeMouseCoordsByMouseEvent(event).y;
    },

    convertIntervals(
        intervals: IInterval[] = [],
        startValue: number,
        endValue: number
    ): IPositionedInterval[] {
        const ratio = maxPercentValue / (endValue - startValue);
        return intervals
            .map((interval) => {
                const start = Math.round((interval.start - startValue) * ratio);
                const end = Math.round((interval.end - startValue) * ratio);
                const intervalWidth = end - start;

                return {
                    color: interval.color,
                    start,
                    width: intervalWidth,
                };
            })
            .sort((intervalFirst, intervalSecond) => {
                if (intervalFirst.start < intervalSecond.start) {
                    return -1;
                }
                if (intervalFirst.start > intervalSecond.start) {
                    return 1;
                }

                return intervalFirst.width === intervalSecond.width
                    ? 0
                    : intervalFirst.width > intervalSecond.width
                    ? -1
                    : 1;
            });
    },

    getTooltipPosition(
        tooltipValue: string,
        tooltipParcentPosition: number,
        rangeLength: number,
        localeDir: string
    ): string {
        const tooltipWidth =
            Math.floor(getFontWidth(String(tooltipValue), 'l')) + 2 * baseTooltipPadding;
        const tooltipPercentWidth = (tooltipWidth / rangeLength) * maxPercentValue;
        const leftParcentCoords = tooltipParcentPosition - tooltipPercentWidth / 2;
        const rightParcentCoords = tooltipParcentPosition + tooltipPercentWidth / 2;
        let adjustment;
        if (leftParcentCoords < minPercentValue) {
            adjustment = `${localeDir === 'ltr' ? 'left' : 'right'}: 0px`;
        }
        if (rightParcentCoords > maxPercentValue) {
            adjustment = `${localeDir === 'ltr' ? 'right' : 'left'}: 0px`;
        }
        return adjustment;
    },
};
