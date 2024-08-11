import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { EventBlockRender, TimelineDataContext } from 'Controls-Lists/timelineGrid';
import 'css!Controls-Lists-demo/timelineGrid/EventRender/WI/style';

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

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    // Необходимо только для демо. Событие берёт значения из контекста Таймлайн таблицы
    const timelineDataContextValue = React.useMemo(() => {
        return {
            quantum: 'day',
            range: {
                start: new Date(2023, 0, 12, 11, 30),
                end: new Date(2023, 0, 16),
            },
            dynamicColumnsGridData: [
                new Date(2023, 0, 12, 11, 30),
                new Date(2023, 0, 12, 12, 30),
                new Date(2023, 0, 16),
            ],
        };
    }, []);

    return (
        <div ref={ref}>
            <TimelineDataContext.Provider value={timelineDataContextValue}>
                <div
                    className={
                        'tw-relative Controls-lists-demo__TimelineGrid_EventRender_wrapper controls-margin_top-s controls-margin_left-s'
                    }
                >
                    <EventBlockRender
                        width={300}
                        contentOffset={0}
                        interactionMode={'content'}
                        fontColorStyle={'success'}
                        hatchColorStyle={'success'}
                        fontSize={'xs'}
                        align={'left'}
                        backgroundColorStyle={'success'}
                        leftBevel={null}
                        rightBevel={'top'}
                        eventStart={currentDate}
                        intersections={intersections}
                        stripesColorStyle={''}
                        baseline={'inherit'}
                        offset={null}
                        overflow={'hidden'}
                        readOnly={false}
                        caption={'Новогодние и рождественские Каникулы'}
                        title={'Всплывающая подсказка для каникул'}
                        description={'11дн'}
                        icon={'icon-Vacation'}
                        dataQa={'EventBlockRender-demo'}
                    />
                </div>
            </TimelineDataContext.Provider>
        </div>
    );
}

export default React.forwardRef(Demo);
