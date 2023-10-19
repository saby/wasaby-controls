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

interface IEventRenderProps {
    className?: string;
    icon?: string;
    caption?: string;
    description?: string;
    fontSize?: TFontSize;
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
}

export interface IIntersection {
    start: Date;
    end: Date;
}

const ICON = 16;
const SPACING = 2;

export function getFittingMode(
    width: number,
    icon: string,
    caption: string,
    description: string,
    fontSize: TFontSize
): string {
    const captionWidth = getFontWidth(caption + ' ', fontSize);
    const descriptionWidth = getFontWidth(description, fontSize);
    const iconWidth = icon ? ICON : 0;
    if (width > iconWidth + descriptionWidth + captionWidth + 3 * SPACING) {
        return 'caption';
    }
    if (width > iconWidth + descriptionWidth + 3 * SPACING) {
        return 'description';
    }
    if (width > iconWidth + 2 * SPACING) {
        return 'icon';
    }
    return '';
}

function EventRender(props: IEventRenderProps) {
    const {
        className,
        icon,
        caption,
        description,
        fontSize,
        fontColorStyle,
        backgroundColorStyle,
        hatchColorStyle,
        stripesColorStyle,
        align,
        overflow,
        width,
        contentOffset,
        leftBevel,
        rightBevel,
        intersections,
        eventStart,
    } = props;
    const fittingMode = React.useMemo(
        () =>
            overflow === 'hidden'
                ? getFittingMode(width, icon, caption, description, fontSize)
                : 'caption',
        [width, icon, caption, description, fontSize, overflow]
    );
    const getBevelClasses = () => {
        let classes = '';
        if (leftBevel === 'top') {
            classes += ' ControlsLists-timelineGrid__EventBlockRender_leftTopBevel';
        }
        if (rightBevel === 'bottom') {
            classes += ' ControlsLists-timelineGrid__EventBlockRender_rightBottomBevel';
        }
        if (rightBevel === 'top') {
            classes += ' ControlsLists-timelineGrid__EventBlockRender_rightTopBevel';
        }
        if (leftBevel === 'bottom') {
            classes += ' ControlsLists-timelineGrid__EventBlockRender_leftBottomBevel';
        }
        return classes;
    };

    const { quantum } = React.useContext(TimelineDataContext);

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

    const calculatePeriodOffset = (startDate: Date, endDate: Date): number => {
        if (quantum === 'day') {
            return endDate.getDate() - startDate.getDate();
        }
        if (quantum === 'hour') {
            return endDate.getHours() - startDate.getHours();
        }
    };

    const calculateIntersectionLeftOffset = (startDate: Date, endDate: Date): number => {
        return calculatePeriodOffset(startDate, endDate) + getPositionInPeriod(endDate, quantum);
    };

    const calculateIntersectionWidth = (startDate: Date, endDate: Date): number => {
        return (
            calculatePeriodOffset(startDate, endDate) -
            getPositionInPeriod(startDate, quantum) +
            getPositionInPeriod(endDate, quantum)
        );
    };

    return (
        <div
            className={
                'ControlsLists-timelineGrid__EventBlockRender ' +
                `tw-justify-${align} ` +
                `ControlsLists-timelineGrid__EventBlockRender_stripes-${stripesColorStyle} ` +
                `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                `controls-padding_top-${contentOffset} controls-padding_bottom-${contentOffset} ` +
                `${getHatchClass()}` +
                `controls-fontsize-${fontSize} ` +
                `controls-text-${fontColorStyle} ${className}` +
                `${getBevelClasses()}`
            }
            style={{
                paddingLeft: contentOffset,
            }}
        >
            <div
                className={`ControlsLists-timelineGrid__EventBlockRender_bg controls-background-${backgroundColorStyle} `}
            />
            {intersections?.map((intersection) => {
                const intersectionStyle = {
                    left: `calc((var(--dynamic-column_width) + (var(--offset_2xs) - var(--border-thickness))) *
                     ${calculateIntersectionLeftOffset(eventStart, intersection.start)})`,
                    width: `calc(((var(--dynamic-column_width)) * ${calculateIntersectionWidth(
                        intersection.start,
                        intersection.end
                    )})`,
                };
                return (
                    <div
                        className="ControlsLists-timelineGrid__EventBlockRender_intersection"
                        style={intersectionStyle}
                    />
                );
            })}

            <span className="ControlsLists-timelineGrid__EventBlockRender_text">
                {icon && fittingMode ? (
                    <Icon
                        icon={icon}
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
