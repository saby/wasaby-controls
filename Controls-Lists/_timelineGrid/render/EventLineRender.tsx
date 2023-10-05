import * as React from 'react';

interface IEventRenderProps {
    className?: string;
    backgroundColorStyle?: string;
    borderTopColorStyle: string;
    borderBottomColorStyle: string;
    borderLeftColorStyle: string;
    borderRightColorStyle: string;
    title: string;
    topOffset: string;
}

function EventRender(props: IEventRenderProps) {
    const {
        className,
        title,
        backgroundColorStyle,
        borderTopColorStyle,
        borderBottomColorStyle,
        borderLeftColorStyle,
        borderRightColorStyle,
        topOffset,
    } = props;
    return (
        <div
            title={title}
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
        />
    );
}

EventRender.defaultProps = {
    className: '',
    title: '',
    topOffset: '0px',
    backgroundColorStyle: 'default',
    borderTopColorStyle: '',
    borderBottomColorStyle: '',
    borderLeftColorStyle: '',
    borderRightColorStyle: '',
};

export default React.memo(EventRender);
