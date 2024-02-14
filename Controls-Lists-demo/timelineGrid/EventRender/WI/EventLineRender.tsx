import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { EventLineRender } from 'Controls-Lists/timelineGrid';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/Integration/style';

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className={'Controls-lists-demo__TimelineGrid controls-background-unaccented'}
        >
            <div
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-padding_bottom-s controls-padding_top-s'
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
        </div>
    );
}

export default React.forwardRef(Demo);
