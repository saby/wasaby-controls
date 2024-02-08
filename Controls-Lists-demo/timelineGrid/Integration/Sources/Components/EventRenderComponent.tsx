import * as React from 'react';
import { Model } from 'Types/entity';
import {
    EventBlockRender,
    EventLineRender,
    EventSquircleRender,
    Quantum,
    TimelineGridSlice,
    ITimelineGridSliceState,
} from 'Controls-Lists/timelineGrid';
import { useSlice } from 'Controls-DataEnv/context';

const STORE_ID = 'TimelineGridBase';

interface IProps {
    event: Model;
    width: number;
    contentOffset: number;
}

interface IShiftEventProps {
    quantum: Quantum;
    width: number;
    contentOffset: number;
}

// Смена
function ShiftEvent(props: IShiftEventProps) {
    if (props.quantum === Quantum.Day || props.quantum === Quantum.Month) {
        return (
            <EventLineRender
                backgroundColorStyle="default"
                dataQa={'shift-event'}
                topOffset={'14px'}
            />
        );
    } else {
        return <EventSquircleRender width={props.width} backgroundColorStyle={'info'} />;
    }
}

interface IWorkEventProps {
    quantum: Quantum;
}

// Работа
function WorkEvent(props: IWorkEventProps) {
    if (props.quantum === Quantum.Day || props.quantum === Quantum.Month) {
        return (
            <EventLineRender
                backgroundColorStyle="contrast-info"
                dataQa={'work-event'}
                topOffset={'14px'}
            />
        );
    } else {
        return (
            <EventSquircleRender
                width={500}
                borderLeftColorStyle={'warning'}
                backgroundColorStyle={'warning'}
                fontColorStyle={'secondary'}
                caption={'Работа с клиентами'}
            />
        );
    }
}

export default function DemoEventRenderComponent({
    event,
    width,
    contentOffset,
}: IProps): React.ReactElement {
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(STORE_ID);
    const displayProperty = 'eventType';
    const eventType = event.get(displayProperty);
    const eventStart = event.get('DTStart');
    const eventEnd = event.get('DTEnd');
    const timeDiff = eventEnd.getTime() - eventStart.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    const interval = diffDays + ' дн';

    if (eventType === 'work') {
        return <WorkEvent quantum={slice?.quantum} />;
    } else if (eventType === 'shift') {
        return <ShiftEvent quantum={slice?.quantum} contentOffset={contentOffset} width={width} />;
    } else {
        return (
            <EventBlockRender
                width={width}
                contentOffset={contentOffset}
                caption={eventType}
                description={interval}
                icon={'icon-Vacation'}
                fontColorStyle={'success'}
                hatchColorStyle={'success'}
                fontSize={'xs'}
                align={diffDays === 1 ? 'center' : 'left'}
                backgroundColorStyle={'success'}
                eventStart={eventStart}
            />
        );
    }
}
