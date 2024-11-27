import * as React from 'react';
import { Model } from 'Types/entity';
import { EventLineRender } from 'Controls-Lists/timelineGrid';
import { EventBlockRender } from 'Controls-Lists/timelineGrid';

interface IProps {
    event: Model;
    width: number;
    contentOffset: number;
}

export default function DemoEventRenderComponent({
    event,
    width,
    contentOffset,
}: IProps): React.ReactElement {
    const displayProperty = 'eventType';
    const eventType = event.get(displayProperty);
    const eventStart = event.get('DTStart');
    const eventEnd = event.get('DTEnd');
    const timeDiff = eventEnd.getTime() - eventStart.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    const interval = diffDays + ' дн';
    if (eventType === 'Работа') {
        return (
            <EventLineRender
                backgroundColorStyle="contrast-info"
                dataQa="work-event"
                topOffset="14px"
            />
        );
    } else if (eventType === 'Смена') {
        return (
            <EventLineRender backgroundColorStyle="default" dataQa="shift-event" topOffset="14px" />
        );
    } else {
        return (
            <EventBlockRender
                width={width}
                contentOffset={contentOffset}
                caption={eventType}
                description={interval}
                icon="icon-Vacation"
                fontColorStyle={'success'}
                hatchColorStyle={'success'}
                fontSize={'xs'}
                align={diffDays === 1 ? 'center' : 'left'}
                backgroundColorStyle="success"
                eventStart={eventStart}
            />
        );
    }
}
