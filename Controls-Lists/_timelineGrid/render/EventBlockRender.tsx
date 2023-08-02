import * as React from 'react';
import { Icon } from 'Controls/icon';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { TFontSize, TOffsetSize } from 'Controls/interface';

interface IEventRenderProps {
    className?: string;
    icon?: string;
    caption?: string;
    description?: string;
    fontSize?: TFontSize;
    offset?: TOffsetSize;
    fontColorStyle?: string;
    backgroundColorStyle?: string;
    stripesColorStyle?: string;
    align: 'left' | 'center' | 'right';
    overflow: 'visible' | 'ellipsis' | 'hidden';
    width: number;
    contentOffset: number;
}

const ICON = 16;
const SPACING = 2;

function getFittingMode(
    width: number,
    icon: string,
    caption: string,
    description: string,
    fontSize: TFontSize
): string {
    const captionWidth = getFontWidth(caption, fontSize);
    const descriptionWidth = getFontWidth(description, fontSize);
    const iconWidth = icon ? ICON : 0;
    if (width > iconWidth + descriptionWidth + captionWidth + 4 * SPACING) {
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
        stripesColorStyle,
        align,
        overflow,
        width,
        contentOffset,
    } = props;
    const fittingMode = React.useMemo(
        () =>
            overflow === 'hidden'
                ? getFittingMode(width, icon, caption, description, fontSize)
                : 'caption',
        [width, icon, caption, description, fontSize, overflow]
    );
    return (
        <div
            className={
                'ControlsLists-timelineGrid__EventBlockRender ' +
                `ControlsLists-timelineGrid__EventBlockRender_align-${align} ` +
                `ControlsLists-timelineGrid__EventBlockRender_stripes-${stripesColorStyle} ` +
                `ControlsLists-timelineGrid__EventBlockRender_overflow-${overflow} ` +
                `controls-padding_top-${contentOffset} controls-padding_bottom-${contentOffset} ` +
                `controls-background-${backgroundColorStyle} ` +
                `controls-fontsize-${fontSize} ` +
                `controls-text-${fontColorStyle} ${className}`
            }
            style={{
                paddingLeft: contentOffset,
            }}
        >
            {icon && fittingMode ? (
                <Icon
                    icon={icon}
                    iconStyle={fontColorStyle}
                    iconSize={'s'}
                    className="ControlsLists-dynamicGrid__EventBlockRender_icon"
                />
            ) : null}
            {caption && fittingMode === 'caption' ? (
                <span className="ControlsLists-dynamicGrid__EventBlockRender_caption">
                    {caption}
                </span>
            ) : null}
            {description && (fittingMode === 'caption' || fittingMode === 'description') ? (
                <span className="ControlsLists-dynamicGrid__EventBlockRender_description">
                    {description}
                </span>
            ) : null}
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
