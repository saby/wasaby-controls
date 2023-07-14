import * as React from 'react';
import { EventLineRender } from 'Controls-Lists/timelineGrid';
import { EventBlockRender } from 'Controls-Lists/timelineGrid';

export default function DemoEventRenderComponent({
    event,
    width,
    contentOffset,
}): React.ReactElement {
    const displayProperty = 'eventType';
    const eventType = event.get(displayProperty);
    const eventStart = event.get('DTStart');
    const eventEnd = event.get('DTEnd');
    const timeDiff = eventEnd.getTime() - eventStart.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    const interval = diffDays + ' дн';
    if (eventType === 'Работа') {
        return <EventLineRender backgroundColorStyle="contrast-info" />;
    } else {
        return (
            <EventBlockRender
                width={width}
                contentOffset={contentOffset}
                caption={eventType === 'Работа' ? '' : eventType}
                description={eventType === 'Работа' ? '' : interval}
                icon={eventType === 'Работа' ? '' : 'icon-Vacation'}
                fontColorStyle={eventType === 'Работа' ? '' : 'success'}
                fontSize={'xs'}
                backgroundColorStyle={eventType === 'Работа' ? 'contrast-info' : 'success'}
            />
        );
    }
}
