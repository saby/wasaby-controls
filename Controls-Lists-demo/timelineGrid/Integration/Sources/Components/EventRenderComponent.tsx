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
import { TVerticalAlign } from 'Controls/interface';
import { TEventLineSize } from 'Controls-Lists/DynamicGrid';

const STORE_ID = 'TimelineGridBase';

interface IProps {
    valign: TVerticalAlign;
    event: Model;
    width: number;
    contentOffset: number;
    storeId?: string;
    eventLineSize: TEventLineSize;
}

interface IShiftEventProps {
    eventLineSize: TEventLineSize;
    quantum: Quantum;
    width: number;
    contentOffset: number;
}

// Смена
function ShiftEvent(props: IShiftEventProps) {
    if (props.quantum === Quantum.Day || props.quantum === Quantum.Month) {
        return (
            <EventLineRender
                eventLineSize={props.eventLineSize}
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
    width: string;
    contentOffset: number;
    eventStart: Date;
    eventEnd: Date;
    subEvents: { [p: string]: Date }[];
    eventLineSize: TEventLineSize;
}

// Работа
function WorkEvent(props: IWorkEventProps) {
    if (props.quantum === Quantum.Day || props.quantum === Quantum.Month) {
        return (
            <EventLineRender
                eventLineSize={props.eventLineSize}
                backgroundColorStyle="contrast-info"
                dataQa={'work-event'}
                topOffset={'14px'}
                width={props.width}
                eventStart={props.eventStart}
                eventEnd={props.eventEnd}
                subEvents={props.subEvents}
                eventStartProperty={'DTStart'}
                eventEndProperty={'DTEnd'}
            />
        );
    } else {
        return (
            <EventSquircleRender
                width={props.width}
                maxLines={2}
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
    storeId = STORE_ID,
    eventLineSize,
    valign,
}: IProps): React.ReactElement {
    const slice = useSlice<TimelineGridSlice & ITimelineGridSliceState>(storeId);
    const displayProperty = 'eventType';
    const eventType = event.get(displayProperty);
    const eventStart = event.get('DTStart');
    const eventEnd = event.get('DTEnd');
    const timeDiff = eventEnd.getTime() - eventStart.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    const interval = diffDays + ' дн';

    if (eventType === 'work') {
        return (
            <WorkEvent
                eventLineSize={eventLineSize}
                quantum={slice?.quantum}
                width={width}
                eventEnd={eventEnd}
                eventStart={eventStart}
                subEvents={event.get('lunchList')}
            />
        );
    } else if (eventType === 'shift') {
        return (
            <ShiftEvent
                quantum={slice?.quantum}
                contentOffset={contentOffset}
                width={width}
                eventLineSize={eventLineSize}
            />
        );
    } else {
        return (
            <EventBlockRender
                valign={valign}
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
