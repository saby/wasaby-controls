import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { EventLineRender, IEventLineRenderProps } from 'Controls-Lists/timelineGrid';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/Integration/style';

const baseConfig: Partial<IEventLineRenderProps> = {
    backgroundColorStyle: 'contrast-info',
    borderTopColorStyle: '',
    borderBottomColorStyle: '',
    borderLeftColorStyle: '',
    borderRightColorStyle: '',
    topOffset: '0px',
};

function EventBlock(props: Partial<IEventLineRenderProps> & { title: string }): React.ReactElement {
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            <div className="Controls-lists-demo__TimelineGrid_EventBlockRender_title">
                {props.title}
            </div>
            <div
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-padding_bottom-s controls-padding_top-s'
                }
            >
                <EventLineRender
                    {...(props as unknown as IEventLineRenderProps)}
                    title={'Всплывающая подсказка для работ'}
                    dataQa={'EventBlockRender-demo'}
                />
            </div>
        </>
    );
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    return (
        <div
            ref={ref}
            className={'Controls-lists-demo__TimelineGrid controls-background-unaccented tw-flex'}
        >
            <div className="controls-padding_left-s controls-padding_right-s">
                <EventBlock {...baseConfig} title={'default'} />
                <EventBlock {...baseConfig} topOffset={'15px'} title={'topOffset=15px'} />
                <EventBlock
                    {...baseConfig}
                    backgroundColorStyle={'contrast-danger'}
                    title={'backgroundColorStyle=contrast-danger'}
                />
                <EventBlock
                    {...baseConfig}
                    borderLeftColorStyle={'danger'}
                    title={'borderLeftColorStyle=danger'}
                />
                <EventBlock
                    {...baseConfig}
                    borderRightColorStyle={'danger'}
                    title={'borderRightColorStyle=danger'}
                />
                <EventBlock
                    {...baseConfig}
                    borderTopColorStyle={'danger'}
                    title={'borderTopColorStyle=danger'}
                />
                <EventBlock
                    {...baseConfig}
                    borderBottomColorStyle={'danger'}
                    title={'borderBottomColorStyle=danger'}
                />
            </div>
        </div>
    );
}

export default React.forwardRef(Demo);
