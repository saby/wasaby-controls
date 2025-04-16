import { EventSquircleRender } from 'Controls-Lists/timelineGrid';
import * as React from 'react';

export default React.forwardRef(function Index(props, ref: React.ForwardedRef<HTMLDivElement>) {
    const gridStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'var(--hover_background-color)',
    };

    function SquircleStartEndDescriptionRender(props: {
        startText?: string;
        endText?: string;
    }): React.ReactElement {
        return (
            <div className="ws-flexbox ws-flex-grow-1 ws-flex-nowrap ws-justify-content-between">
                <div className="controls-text-label controls-fontsize-xs">
                    {props.startText || null}
                </div>
                <div className="controls-text-label controls-fontsize-xs">
                    {props.endText || null}
                </div>
            </div>
        );
    }

    return (
        <div style={gridStyle} ref={ref}>
            <div
                style={{
                    left: '0px',
                    top: '200px',
                    height: '55px',
                    width: '500px',
                }}
                ref={ref}
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-margin_top-s controls-margin_left-s'
                }
            >
                <EventSquircleRender
                    width={500}
                    borderLeftColorStyle={'success'}
                    borderRightColorStyle={'success'}
                    backgroundColorStyle={'success'}
                    effect="fade-to-left"
                    description={<SquircleStartEndDescriptionRender endText="fade-to-left" />}
                />
            </div>
            <div
                style={{
                    left: '0px',
                    top: '200px',
                    height: '55px',
                    width: '500px',
                }}
                ref={ref}
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-margin_top-s controls-margin_left-s'
                }
            >
                <EventSquircleRender
                    width={500}
                    borderLeftColorStyle={'warning'}
                    borderRightColorStyle={'warning'}
                    backgroundColorStyle={'warning'}
                    effect="fade-to-right"
                    description={<SquircleStartEndDescriptionRender startText="fade-to-right" />}
                />
            </div>
            <div
                style={{
                    left: '0px',
                    top: '200px',
                    height: '55px',
                    width: '500px',
                }}
                ref={ref}
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-margin_top-s controls-margin_left-s'
                }
            >
                <EventSquircleRender
                    width={500}
                    borderLeftColorStyle={'danger'}
                    borderRightColorStyle={'danger'}
                    backgroundColorStyle={'danger'}
                    effect="fade-both"
                    caption="fade-both"
                    description={<SquircleStartEndDescriptionRender />}
                />
            </div>
        </div>
    );
});
