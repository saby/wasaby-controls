import { EventSquircleRender } from 'Controls-Lists/timelineGrid';
import * as React from 'react';

export default React.forwardRef(function Index(props, ref: React.ForwardedRef<HTMLDivElement>) {
    const getSquircleFooter = (): JSX.Element => {
        const divStyle = {
            width: '16px',
            height: '16px',
            borderRadius: '3px',
        };
        return (
            <div className={'tw-flex tw-flex-row'}>
                <div style={{ backgroundColor: 'red', ...divStyle }}></div>
                <div style={{ backgroundColor: 'blue', ...divStyle }}></div>
                <div style={{ backgroundColor: 'green', ...divStyle }}></div>
                <div style={{ backgroundColor: 'white', ...divStyle }}></div>
            </div>
        );
    };
    const getSquircleDescriptionRender = (): JSX.Element => {
        const textStyle = {
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
        };
        return (
            <div className={'tw-flex tw-flex-col'}>
                <span className={'controls-text-secondary'}>Задача</span>
                <div style={textStyle} className={'tw-overflow-hidden controls-text-default'}>
                    Прикладной шаблон описания нового шаблона отображения событий - сквиркла
                </div>
            </div>
        );
    };
    const squircleStyle = {
        position: 'absolute',
    };
    const gridStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'var(--hover_background-color)',
    };
    return (
        <div style={gridStyle} ref={ref}>
            <div style={squircleStyle}>
                <EventSquircleRender
                    width={500}
                    borderRightColorStyle={'success'}
                    backgroundColorStyle={'primary'}
                    fontColorStyle={'secondary'}
                    caption={'12.01-17.01'}
                    description={getSquircleDescriptionRender()}
                    footer={getSquircleFooter()}
                />
            </div>
        </div>
    );
});
