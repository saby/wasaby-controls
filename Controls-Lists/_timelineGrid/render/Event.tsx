import * as React from 'react';
import { Icon } from 'Controls/icon';
import { getFontWidth } from 'Controls/Utils/getFontWidthSync';
import { TFontSize } from 'Controls/interface';

interface IEventRenderProps {
    className?: string;
    icon?: string;
    caption?: string;
    interval?: string;
    fontSize?: TFontSize;
    fontColorStyle?: string;
    backgroundColorStyle?: string;
    viewMode?: 'thin' | 'normal';
    width: number;
}

const ICON = 16;
const SPACING = 3;

function getFittingMode(
    width: number,
    caption: string,
    interval: string,
    fontSize: TFontSize
): string {
    const captionWidth = getFontWidth(caption, fontSize);
    const intervalWidth = getFontWidth(interval, fontSize);
    if (width > ICON + intervalWidth + captionWidth + 4 * SPACING) {
        return 'caption';
    }
    if (width > ICON + intervalWidth + 3 * SPACING) {
        return 'interval';
    }
    if (width > ICON + 2 * SPACING) {
        return 'icon';
    }
    return '';
}

function EventRender(props: IEventRenderProps) {
    const {
        className,
        icon,
        caption,
        interval,
        fontSize,
        fontColorStyle,
        backgroundColorStyle,
        viewMode,
        width,
    } = props;
    const contentVisible = viewMode === 'normal';
    const fittingMode = getFittingMode(width, caption, interval, fontSize);
    return (
        <div
            className={`ControlsLists-timelineGrid__EventComponent
                        ControlsLists-timelineGrid__EventComponent_${viewMode}
                        controls-background-${backgroundColorStyle} 
                        controls-fontsize-${fontSize}
                        controls-text-${fontColorStyle} ${className}`}
        >
            {contentVisible && icon && fittingMode ? (
                <Icon
                    icon={icon}
                    iconStyle={fontColorStyle}
                    iconSize={'s'}
                    className="ControlsLists-dynamicGrid__EventComponent_icon"
                />
            ) : null}
            {contentVisible && caption && fittingMode === 'caption' ? (
                <span className="ControlsLists-dynamicGrid__EventComponent_caption">{caption}</span>
            ) : null}
            {contentVisible &&
            interval &&
            (fittingMode === 'caption' || fittingMode === 'interval') ? (
                <span className="ControlsLists-dynamicGrid__EventComponent_interval">
                    {interval}
                </span>
            ) : null}
        </div>
    );
}

EventRender.defaultProps = {
    className: '',
    icon: '',
    caption: '',
    interval: '',
    fontSize: '3xs',
    fontColorStyle: 'default',
    backgroundColorStyle: 'default',
    viewMode: 'normal',
};

export default React.memo(EventRender);
