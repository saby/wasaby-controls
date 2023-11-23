import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import {
    EventBlockRender,
    IEventBlockRenderProps,
    TimelineDataContext,
} from 'Controls-Lists/timelineGrid';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/Integration/style';

const currentDate = new Date(2023, 0, 12, 0, 0);

const intersections = [
    {
        start: new Date(2023, 0, 13),
        end: new Date(2023, 0, 14),
    },
    {
        start: new Date(2023, 0, 15, 13),
        end: new Date(2023, 0, 17),
    },
    {
        start: new Date(2023, 0, 14, 12),
        end: new Date(2023, 0, 14, 14),
    },
];

const baseConfig: Partial<IEventBlockRenderProps> = {
    width: 300,
    contentOffset: 0,
    interactionMode: 'content',
    fontColorStyle: 'success',
    hatchColorStyle: 'success',
    fontSize: 'xs',
    align: 'left',
    backgroundColorStyle: 'success',
    leftBevel: null, // 'мне ж top',
    rightBevel: null, // 'bottom',
    eventStart: currentDate,
    intersections,
    stripesColorStyle: '',
    baseline: 'inherit',
    offset: null,
    overflow: 'hidden',
    readOnly: false,
};

function EventBlock(
    props: Partial<IEventBlockRenderProps> & { title: string }
): React.ReactElement {
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            <div className="Controls-lists-demo__TimelineGrid_EventRender_title">
                {props.title}
            </div>
            <div
                className={
                    'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-padding_bottom-s controls-padding_top-s'
                }
            >
                <EventBlockRender
                    {...(props as unknown as IEventBlockRenderProps)}
                    caption={'Новогодние и рождественские Каникулы'}
                    title={'Всплывающая подсказка для каникул'}
                    description={'11дн'}
                    icon={'icon-Vacation'}
                    intersections={intersections}
                    dataQa={'EventBlockRender-demo'}
                />
            </div>
        </>
    );
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const timelineDataContextValue = React.useMemo(() => {
        return {
            quantum: 'day',
            range: {
                start:new Date(2023, 0, 12, 11, 30),
                end:  new Date(2023, 0, 16),
            },
            dynamicColumnsGridData: [
                new Date(2023, 0, 12, 11, 30),
                new Date(2023, 0, 12, 12, 30),
                new Date(2023, 0, 16),
            ],
        };
    }, []);

    return (
        <div ref={ref} className={'Controls-lists-demo__TimelineGrid controls-background-unaccented'}>
            <TimelineDataContext.Provider value={timelineDataContextValue}>
                <div className="tw-flex">
                    <div className="controls-padding_left-s controls-padding_right-s">
                        <EventBlock {...baseConfig} title={'default'} />
                        <EventBlock {...baseConfig} offset={'m'} title={'offset=m'} />
                        <EventBlock {...baseConfig} width={500} title={'width=500'} />
                        <EventBlock {...baseConfig} width={200} title={'width=200'} />
                        <EventBlock {...baseConfig} offset={'m'} title={'offset=m'} />
                        <EventBlock
                            {...baseConfig}
                            interactionMode={'block'}
                            title={'interactionMode=block'}
                        />
                        <EventBlock
                            {...baseConfig}
                            interactionMode={'content'}
                            title={'interactionMode=content'}
                        />
                    </div>
                    <div className="controls-padding_left-s controls-padding_right-s">
                        <EventBlock
                            {...baseConfig}
                            interactionMode={'none'}
                            title={'interactionMode=none'}
                        />
                        <EventBlock
                            {...baseConfig}
                            fontColorStyle={'danger'}
                            backgroundColorStyle={'danger'}
                            fontSize={'xl'}
                            baseline={'xl'}
                            hatchColorStyle={'danger'}
                            title={'danger with hatchColorStyle'}
                        />
                        <EventBlock
                            {...baseConfig}
                            fontColorStyle={'danger'}
                            backgroundColorStyle={'danger'}
                            fontSize={'2xl'}
                            baseline={'2xl'}
                            hatchColorStyle={'danger'}
                            stripesColorStyle={'danger'}
                            title={'danger with stripesColorStyle'}
                        />
                        <EventBlock {...baseConfig} align={'left'} title={'align=left'} />
                        <EventBlock {...baseConfig} align={'center'} title={'align=center'} />
                        <EventBlock {...baseConfig} align={'right'} title={'align=right'} />
                        <EventBlock {...baseConfig} leftBevel={'top'} title={'leftBevel=top'} />
                        <EventBlock {...baseConfig} leftBevel={'bottom'} title={'leftBevel=bottom'} />
                    </div>
                    <div className="controls-padding_left-s controls-padding_right-s">
                        <EventBlock {...baseConfig} rightBevel={'bottom'} title={'rightBevel=bottom'} />
                        <EventBlock {...baseConfig} rightBevel={'top'} title={'rightBevel=top'} />
                        <EventBlock
                            {...baseConfig}
                            width={100}
                            overflow={'hidden'}
                            title={'overflow=hidden'}
                        />
                        <EventBlock
                            {...baseConfig}
                            width={100}
                            overflow={'visible'}
                            title={'overflow=visible'}
                        />
                        <EventBlock
                            {...baseConfig}
                            width={100}
                            overflow={'ellipsis'}
                            title={'overflow=ellipsis'}
                        />
                    </div>
                </div>
            </TimelineDataContext.Provider>
        </div>
    );
}

export default React.forwardRef(Demo);
