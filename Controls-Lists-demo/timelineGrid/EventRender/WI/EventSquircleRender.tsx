import * as React from 'react';
import { EventSquircleRender } from 'Controls-Lists/timelineGrid';
import { Images } from './Data/Images';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/WI/style';

function Demo(props, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    // Подвал сквиркла
    const getSquircleFooter = (): JSX.Element => {
        const footerImagesStyle = {
            width: '57px',
            height: '16px',
            borderRadius: '3px',
            backgroundImage: `url(${Images[0]})`,
        };
        return <div style={footerImagesStyle}></div>;
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
                <span className={'controls-text-secondary'}>Поручение</span>
                <div style={textStyle} className={'tw-overflow-hidden controls-text-default'}>
                    Обсуждаем рендеринг событий на таймлайне
                </div>
            </div>
        );
    };
    return (
        <div
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
                caption={'Совещание отдела'}
                icon={'icon-VideoCall2'}
                description={getSquircleDescriptionRender()}
                footer={getSquircleFooter()}
            />
        </div>
    );
}

export default React.forwardRef(Demo);
