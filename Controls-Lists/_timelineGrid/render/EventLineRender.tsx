import * as React from 'react';
import { TFontSize } from 'Controls/interface';

interface IEventRenderProps {
    className?: string;
    backgroundColorStyle?: string;
    borderTopColorStyle: string;
    borderBottomColorStyle: string;
    borderLeftColorStyle: string;
    borderRightColorStyle: string;
}

function EventRender(props: IEventRenderProps) {
    const {
        className,
        backgroundColorStyle,
        borderTopColorStyle,
        borderBottomColorStyle,
        borderLeftColorStyle,
        borderRightColorStyle,
        topOffset,
    } = props;
    return (
        <div
            style={{
                marginTop: `calc(${topOffset} + 20px)`,
            }}
            className={
                'ControlsLists-timelineGrid__EventLineRender ' +
                `controls-background-${backgroundColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-top-${borderTopColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-bottom-${borderBottomColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-left-${borderLeftColorStyle} ` +
                `ControlsLists-timelineGrid__EventLineRender-border-right-${borderRightColorStyle} ` +
                `${className} `
            }
        ></div>
    );
}

EventRender.defaultProps = {
    className: '',
    backgroundColorStyle: 'default',
    borderTopColorStyle: '',
    borderBottomColorStyle: '',
    borderLeftColorStyle: '',
    borderRightColorStyle: '',
};

export default React.memo(EventRender);
