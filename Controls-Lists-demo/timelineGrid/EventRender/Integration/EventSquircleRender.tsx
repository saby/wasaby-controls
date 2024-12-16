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

    const squircleStyle = {
        position: 'absolute',
    };
    const gridStyle = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'var(--hover_background-color)',
    };
    const getSquircleDescriptionRender = (valign): JSX.Element => {
        if (valign !== 'start') {
            return (
                <>
                    <span className={'controls-text-secondary'}>Поручение&nbsp;</span>
                    <span className={'controls-text-default'}>
                        Обсуждаем рендеринг событий на таймлайне
                    </span>
                </>
            );
        }
        const textStyle = {
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
        };
        return (
            <div className={'tw-flex tw-flex-col'}>
                <span className={'controls-text-secondary'}>Поручение</span>
                <div style={textStyle} className={'tw-overflow-hidden controls-text-default'}>
                    Обсуждаем рендеринг событий на таймлайне
                </div>
            </div>
        );
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
                    description={getSquircleDescriptionRender('start')}
                />
            </div>
            <div
                style={{
                    width: '140px',
                    left: '160px',
                    bottom: '0',
                    height: '60px',
                    top: '100px',
                    ...squircleStyle,
                }}
            >
                <EventSquircleRender
                    width={140}
                    icon={'icon-VideoCallNull'}
                    caption={'Совещание отдела ежедневно'}
                    borderLeftColorStyle={'warning'}
                    backgroundColorStyle={'secondary'}
                    footer={getSquircleFooter()}
                />
            </div>
            <div
                style={{
                    width: '140px',
                    left: '10px',
                    bottom: '0',
                    height: '80px',
                    top: '100px',
                    ...squircleStyle,
                }}
            >
                <EventSquircleRender
                    width={140}
                    icon={'icon-VideoCallNull'}
                    description={'Совещание отдела ежедневно'}
                    backgroundColorStyle={'info'}
                    footer={getSquircleFooter()}
                    footerPosition={'static'}
                />
            </div>
            <div
                style={{
                    width: '30px',
                    left: '310px',
                    bottom: '0',
                    height: '80px',
                    top: '100px',
                    ...squircleStyle,
                }}
            >
                <EventSquircleRender
                    width={30}
                    icon={'icon-Vacation'}
                    backgroundColorStyle={'success'}
                    borderLeftColorStyle={'secondary'}
                    caption={'Отпуск'}
                    footer={getSquircleFooter()}
                />
            </div>
            <div
                style={{
                    width: '200px',
                    left: '350px',
                    bottom: '0',
                    height: '30px',
                    top: '100px',
                    ...squircleStyle,
                }}
            >
                <EventSquircleRender
                    width={200}
                    backgroundColorStyle={'warning'}
                    borderRightColorStyle={'info'}
                    caption={'Маникюр'}
                    description={'Мичурина А.'}
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
                    borderLeftColorStyle={'info'}
                    backgroundColorStyle={'primary'}
                    fontColorStyle={'secondary'}
                    caption={'valign=start'}
                    icon={'icon-VideoCall2'}
                    valign="start"
                    description={getSquircleDescriptionRender('start')}
                    footer={getSquircleFooter()}
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
                    borderLeftColorStyle={'info'}
                    backgroundColorStyle={'primary'}
                    fontColorStyle={'secondary'}
                    caption={'valign=baseline'}
                    icon={'icon-VideoCall2'}
                    valign="baseline"
                    description={getSquircleDescriptionRender('baseline')}
                    footer={getSquircleFooter()}
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
                    borderLeftColorStyle={'info'}
                    backgroundColorStyle={'primary'}
                    fontColorStyle={'secondary'}
                    caption={'valign=center'}
                    icon={'icon-VideoCall2'}
                    valign="center"
                    description={getSquircleDescriptionRender('center')}
                    footer={getSquircleFooter()}
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
                    borderLeftColorStyle={'info'}
                    backgroundColorStyle={'primary'}
                    fontColorStyle={'secondary'}
                    caption={'valign=end'}
                    icon={'icon-VideoCall2'}
                    valign={'end'}
                    description={getSquircleDescriptionRender('end')}
                    footer={getSquircleFooter()}
                />
            </div>
        </div>
    );
});
