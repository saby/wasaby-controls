import * as React from 'react';
import { Icon } from 'Controls/icon';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { TFontSize, TOffsetSize } from 'Controls/interface';
import { Logger } from 'UICommon/Utils';
import { getPositionInPeriod } from 'Controls-Lists/dynamicGrid';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';

export interface IBevelConfig {
    leftTop?: boolean;
    leftBottom?: boolean;
    rightTop?: boolean;
    rightBottom?: boolean;
}

export type TBevel = 'top' | 'bottom';

export interface IEventRenderProps {
    className?: string;
    icon?: string;
    caption?: string;
    title?: string;
    description?: string | JSX.Element;
    fontSize?: TFontSize;
    baseline?: TFontSize;
    offset?: TOffsetSize;
    fontColorStyle?: string;
    hatchColorStyle?: string;
    backgroundColorStyle?: string;
    stripesColorStyle?: string;
    align: 'left' | 'center' | 'right';
    overflow: 'visible' | 'ellipsis' | 'hidden';
    width: number;
    contentOffset: number;
    leftBevel: TBevel;
    rightBevel: TBevel;
    intersections?: IIntersection[];
    eventStart: Date;
    readOnly: boolean;
    dataQa: string;
}

export interface IIntersection {
    start: Date;
    end: Date;
}

const ICON = 16;
const SPACING = 2;

const MILLISECONDS = 1000;
const MINUTES = 3600;
const HOURS = 24;

export function getFittingMode(
    width: number,
    iconWidth: number,
    caption: string,
    description: string | JSX.Element,
    fontSize: TFontSize,
    iconSpace: number,
    offsetSpace: number
): string {
    const captionWidth = getFontWidth(caption + ' ', fontSize);
    const descriptionWidth =
        typeof description === 'string' ? getFontWidth(description, fontSize) : 0;
    if (width > iconWidth + descriptionWidth + captionWidth + offsetSpace + iconSpace) {
        return 'caption';
    }
    if (description && width > iconWidth + descriptionWidth + offsetSpace + iconSpace) {
        return 'description';
    }
    if (width > iconWidth + offsetSpace) {
        return 'icon';
    }
    return '';
}

function calculatePeriodOffset(startDate: Date, endDate: Date, quantum): number {
    if (quantum === 'day') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const diffDays = timeDiff / (MILLISECONDS * MINUTES * HOURS);
        return diffDays;
    }
    if (quantum === 'hour') {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const hoursDiff = timeDiff / (MILLISECONDS * MINUTES);
        return hoursDiff;
    }
}

function EventRender(props: IEventRenderProps) {
    const {
        className,
        icon,
        caption,
        title,
        description,
        fontSize,
        baseline,
        fontColorStyle,
        backgroundColorStyle,
        hatchColorStyle,
        stripesColorStyle,
        align,
        overflow,
        width,
        contentOffset,
        offset,
        leftBevel,
        rightBevel,
        intersections,
        eventStart,
        readOnly,
    } = props;
    const fittingMode = React.useMemo(
        () =>
            overflow === 'hidden'
                ? getFittingMode(
                      width,
                      icon ? ICON : 0,
                      caption,
                      description,
                      fontSize,
                      SPACING,
                      SPACING
                  )
                : 'caption',
        [width, icon, caption, description, fontSize, overflow]
    );
    const getBevelClasses = () => {
        if (leftBevel && rightBevel) {
            return ` ControlsLists-timelineGrid__EventBlockRender_bevel-left-${leftBevel}-right-${rightBevel}`;
        }
        if (leftBevel) {
            return ` ControlsLists-timelineGrid__EventBlockRender_bevel-left-${leftBevel}`;
        }
        if (rightBevel) {
            return ` ControlsLists-timelineGrid__EventBlockRender_bevel-right-${rightBevel}`;
        }
        return '';
    };

    const { quantum, dynamicColumnsGridData } = React.useContext(TimelineDataContext);

    const getHatchClass = () => {
        let hatchClass = '';
        if (intersections && intersections?.length > 0) {
            if (!hatchColorStyle) {
                Logger.error('Should set hatchColorStyle');
                return null;
            } else {
                hatchClass = `controls-hatch_color-${hatchColorStyle} `;
            }
        }
        return hatchClass;
    };

    const calculateIntersectionLeftOffset = (startDate: Date, endDate: Date): number => {
        return (
            calculatePeriodOffset(startDate, endDate, quantum) +
            getPositionInPeriod(endDate, quantum)
        );
    };

    const calculateIntersectionWidth = (startDate: Date, endDate: Date): number => {
        return (
            calculatePeriodOffset(startDate, endDate, quantum) -
            getPositionInPeriod(startDate, quantum) +
            getPositionInPeriod(endDate, quantum)
        );
    };

    return (
        <div
            className={
                'ControlsLists-timelineGrid__EventBlockRender ' +
                'ControlsLists-timelineGrid__EventBlockRender_white-space ' +
                `tw-justify-${align} ` +
                `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                `controls-padding_top-${offset} controls-padding_bottom-${offset} ` +
                `${getHatchClass()}` +
                `controls-fontsize-${fontSize} ` +
                (readOnly ? 'ControlsLists-timelineGrid__EventBlockRender_readOnly ' : '') +
                `controls-text-${fontColorStyle} ${className} ` +
                `${getBevelClasses()}`
            }
            style={{
                paddingLeft: contentOffset,
            }}
            data-qa={props.dataQa}
        >
            <div
                data-qa={'EventBlockRender-background'}
                className={
                    'ControlsLists-timelineGrid__EventBlockRender_bg ' +
                    `controls-background-${backgroundColorStyle} ` +
                    (stripesColorStyle
                        ? `ControlsLists-timelineGrid__EventBlockRender_stripes ControlsLists-timelineGrid__EventBlockRender_stripes-${stripesColorStyle} `
                        : '') +
                    'ControlsLists-timelineGrid__EventBlockRender_bg-right_null '
                }
            />
            {intersections?.map((intersection) => {
                let eventStartCropped = eventStart;
                if (dynamicColumnsGridData[0] > eventStart) {
                    eventStartCropped = dynamicColumnsGridData[0];
                }
                let intersectionStartCropped = intersection.start;
                if (dynamicColumnsGridData[0] > intersection.start) {
                    intersectionStartCropped = dynamicColumnsGridData[0];
                }
                let intersectionEndCropped = intersection.end;
                if (
                    dynamicColumnsGridData[dynamicColumnsGridData.length - 1] < intersection.start
                ) {
                    intersectionEndCropped =
                        dynamicColumnsGridData[dynamicColumnsGridData.length - 1];
                }
                const intersectionStyle = {
                    left: `calc((var(--dynamic-column_width) + var(--dynamic-column_gap)) *
                     ${calculateIntersectionLeftOffset(
                         eventStartCropped,
                         intersectionStartCropped
                     )})`,
                    width: `calc(((var(--dynamic-column_width) + var(--dynamic-column_gap)) * ${calculateIntersectionWidth(
                        intersectionStartCropped,
                        intersectionEndCropped
                    )} - var(--dynamic-column_gap))`,
                };
                return (
                    <div
                        data-qa={'EventBlockRender-intersection'}
                        className="ControlsLists-timelineGrid__EventBlockRender_intersection"
                        style={intersectionStyle}
                    />
                );
            })}

            <span
                title={title}
                data-qa={'EventBlockRender-content'}
                className={
                    'controls-GridReact__cell-baseline ' +
                    `controls-GridReact__cell-baseline_${baseline} ` +
                    'ControlsLists-timelineGrid__EventBlockRender_text ' +
                    `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} `
                }
            >
                {icon && fittingMode ? (
                    <Icon
                        icon={icon}
                        dataQa={icon}
                        iconStyle={fontColorStyle}
                        iconSize={'s'}
                        className="ControlsLists-timelineGrid__EventBlockRender_icon"
                    />
                ) : null}
                {caption && fittingMode === 'caption' ? caption + ' ' : null}
                {description && (fittingMode === 'caption' || fittingMode === 'description')
                    ? description
                    : null}
            </span>
        </div>
    );
}

EventRender.defaultProps = {
    className: '',
    icon: '',
    caption: '',
    description: '',
    fontSize: '3xs',
    contentOffset: 'null',
    fontColorStyle: 'default',
    backgroundColorStyle: 'default',
    stripesColorStyle: '',
    align: 'left',
    overflow: 'hidden',
};

export default React.memo(EventRender);
