import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { EventLineRender } from 'Controls-Lists/timelineGrid';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/WI/style';

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className={
                'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-margin_top-s controls-margin_left-s'
            }
        >
            <div>eventLineSize=s</div>
            <div
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-padding_bottom-s controls-padding_top-s Controls-lists-demo__TimelineGrid_EventLineRender_wrapperWI'
                }
            >
                <EventLineRender
                    backgroundColorStyle={'contrast-info'}
                    borderTopColorStyle={'danger'}
                    borderBottomColorStyle={''}
                    borderLeftColorStyle={''}
                    borderRightColorStyle={''}
                    topOffset={'10px'}
                    title={'Всплывающая подсказка для работ'}
                    dataQa={'EventBlockRender-demo'}
                />
            </div>
            <div>eventLineSize=l</div>
            <div
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-padding_bottom-s controls-padding_top-s Controls-lists-demo__TimelineGrid_EventLineRender_wrapperWI'
                }
            >
                <EventLineRender
                    backgroundColorStyle={'contrast-info'}
                    borderTopColorStyle={'danger'}
                    borderBottomColorStyle={''}
                    borderLeftColorStyle={''}
                    borderRightColorStyle={''}
                    topOffset={'10px'}
                    title={'Всплывающая подсказка для работ'}
                    dataQa={'EventBlockRender-demo'}
                    eventLineSize="l"
                />
            </div>
        </div>
    );
}

export default React.forwardRef(Demo);
