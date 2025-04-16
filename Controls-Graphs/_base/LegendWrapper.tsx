import { PropsWithChildren, useCallback, useMemo, MutableRefObject } from 'react';
import type { JSX } from 'react';
import ILegend from './interfaces/ILegend';
import ISeries from './interfaces/ISeries';
import ISingleSeriesItem from './interfaces/ISingleSeriesItem';
import ISingleItem from './interfaces/ISingleItem';
import Legend, { ILegendItem } from './Legend';
import HighChartsLight from './HighChartsLight/HighChartsLight';

export type TSetVisibleItems = (visibleItems: ISingleItem[] | ISingleSeriesItem[]) => void;

interface ILegendWrapperProps extends ISeries, ILegend {
    setVisibleItems: TSetVisibleItems;
    visibleItems: ISingleItem[] | ISingleSeriesItem[];
    data?: ISingleItem[];
    chartRef?: MutableRefObject<HighChartsLight | undefined>;
    instanceId?: string;
}

const getLegendItems = (series: ISingleSeriesItem[], data?: ISingleItem[]): ILegendItem[] => {
    if (!data) {
        return (
            series?.map?.(
                (item, index) =>
                    ({
                        colorIndex:
                            'base-' +
                            (typeof item.colorIndex === 'number' ? item.colorIndex : index + 1),
                        caption: item.name,
                    }) as unknown as ILegendItem
            ) || []
        );
    }
    return !!series?.length
        ? series
              .map((item) => {
                  return data.map(
                      (dataItem, dataItemIndex) =>
                          ({
                              colorIndex:
                                  'base-' +
                                  (typeof dataItem.colorIndex === 'number'
                                      ? dataItem.colorIndex
                                      : dataItemIndex + 1 > 12
                                      ? (dataItemIndex + 1) % 12
                                      : dataItemIndex + 1),
                              caption: dataItem?.[item.displayProperty as string],
                          }) as unknown as ILegendItem
                  );
              })
              .flat()
        : [];
};

function LegendWrapper({
    children,
    series,
    data,
    legendVisible,
    legendHorizontalAlignment,
    legendVerticalPosition,
    setVisibleItems,
    visibleItems,
    chartRef,
    instanceId,
}: PropsWithChildren<ILegendWrapperProps>): JSX.Element {
    const items = useMemo(() => getLegendItems(series, data), [series, data]);
    const clickHandler = useCallback(
        (caption: string, visible: boolean) => {
            if (!data) {
                let newSeries = [...(visibleItems as ISingleSeriesItem[])];
                if (visible) {
                    newSeries.push(
                        series.find((serie) => serie.name === caption) as ISingleSeriesItem
                    );
                } else {
                    newSeries = [...newSeries.filter((serie) => serie.name !== caption)];
                }
                setVisibleItems(newSeries);
            } else {
                let newData = [...(visibleItems as ISingleItem[])];
                if (visible) {
                    newData.push(
                        data.find(
                            (dataItem) => dataItem[series[0].displayProperty as string] === caption
                        ) as ISingleItem
                    );
                } else {
                    newData = [
                        ...newData.filter(
                            (dataItem) => dataItem[series[0].displayProperty as string] !== caption
                        ),
                    ];
                }
                setVisibleItems(newData);
            }
        },
        [data, series, visibleItems, setVisibleItems]
    );

    const hoverHandler = (colorIndex: number, show: boolean): void => {
        if (chartRef?.current) {
            chartRef.current
                ?.callMethodOnChartInstance('get', [instanceId as string])
                .then((context: object) => {
                    //@ts-expect-error
                    context.points.forEach((point) => {
                        if (!show) {
                            point.setState('normal');
                            return;
                        }
                        if (String(point.colorIndex) === String(colorIndex)) {
                            point.setState('hover');
                        } else {
                            point.setState('inactive');
                        }
                    });
                });
        }
    };

    return (
        <div
            className={`tw-w-full tw-h-full tw-flex tw-flex-col${
                legendVerticalPosition === 'bottom' ? '-reverse' : ''
            } tw-items-center`}
        >
            {legendVisible && (
                <Legend
                    items={items}
                    legendHorizontalAlignment={legendHorizontalAlignment}
                    legendItemClickHandler={clickHandler}
                    legendItemHoverHandler={hoverHandler}
                    className={`tw-flex-wrap ${
                        legendVerticalPosition === 'bottom'
                            ? 'controls-margin_top-m'
                            : 'controls-margin_bottom-m'
                    }`}
                />
            )}
            {children}
        </div>
    );
}

export default LegendWrapper;
