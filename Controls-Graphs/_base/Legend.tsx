import { forwardRef, LegacyRef, useState, useCallback, MouseEvent } from 'react';
import ILegend from './interfaces/ILegend';
import 'css!Controls-Graphs/base';

export interface ILegendItem {
    caption: string;
    colorIndex: number;
}

export interface ILegendProps extends Pick<ILegend, 'legendHorizontalAlignment'> {
    items: ILegendItem[];
    legendItemHoverHandler?: (colorIndex: ILegendItem['colorIndex'], show: boolean) => void;
    legendItemClickHandler: (colorIndex: ILegendItem['colorIndex'], show: boolean) => void;
    className?: string;
    theme?: string;
}

function Legend(props: ILegendProps, ref: LegacyRef<HTMLDivElement>) {
    const [visibleItems, setVisibleItems] = useState<ILegendItem['colorIndex'][]>(() => {
        return props.items.map((item) => item.colorIndex);
    });

    const onLegendItemHover = useCallback(
        (_: MouseEvent<HTMLDivElement>, colorIndex: ILegendItem['colorIndex']) => {
            props.legendItemHoverHandler?.(colorIndex, true);
        },
        []
    );

    const onLegendItemClick = useCallback(
        (_: MouseEvent<HTMLDivElement>, colorIndex: ILegendItem['colorIndex']) => {
            let newVisibleItems;
            if (visibleItems.includes(colorIndex)) {
                newVisibleItems = [...visibleItems.filter((item) => item !== colorIndex)];
            } else {
                newVisibleItems = [...visibleItems, colorIndex];
            }
            setVisibleItems(newVisibleItems);
            props.legendItemClickHandler(colorIndex, newVisibleItems.includes(colorIndex));
        },
        [visibleItems, props.items]
    );

    const mouseOutHandler = useCallback(
        (_: MouseEvent<HTMLDivElement>, colorIndex: ILegendItem['colorIndex']) => {
            props.legendItemHoverHandler?.(colorIndex, false);
        },
        []
    );

    return (
        <div
            ref={ref}
            className={`controls_Graphs_theme-${
                props.theme || 'default'
            } controls-Graphs-legend tw-justify-${props.legendHorizontalAlignment}${
                props.className ? ` ${props.className}` : ''
            }`}
        >
            {props.items.map((item, idx) => (
                <div
                    onMouseOver={(event) => onLegendItemHover(event, item.colorIndex)}
                    onMouseOut={(event) => mouseOutHandler(event, item.colorIndex)}
                    onClick={(event) => onLegendItemClick(event, item.colorIndex)}
                    className="controls-Graphs-legend_item tw-cursor-pointer"
                    /* eslint-disable-next-line react/no-array-index-key */
                    key={`legendItem-${item.colorIndex}-${idx}`}
                >
                    <div
                        className={`controls-Graphs-legend_item_color tw-cursor-pointer${
                            item.caption ? ' controls-margin_right-xs' : ''
                        }${
                            !visibleItems.includes(item.colorIndex)
                                ? ' controls-Graphs-legend_item_color_notVisible'
                                : ''
                        } highcharts-color-${item.colorIndex}`}
                    ></div>
                    <div
                        title={item.caption}
                        className="ws-ellipsis controls-Graphs-legend_item_text tw-cursor-pointer"
                    >
                        {item.caption}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default forwardRef(Legend);
