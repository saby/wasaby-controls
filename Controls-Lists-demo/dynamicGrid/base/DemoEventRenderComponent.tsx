import * as React from 'react';
import {EventRender} from 'Controls-Lists/timelineGrid';

export default function DemoEventRenderComponent({event, width}): React.ReactElement {
    const displayProperty = 'eventType';
    const eventType = event.get(displayProperty);
    const eventStart = event.get('DTStart');
    const eventEnd = event.get('DTEnd');
    const timeDiff = eventEnd.getTime() - eventStart.getTime();
    const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    const interval = diffDays + ' дн';
    return (
        <EventRender
            width={width}
            caption={eventType === 'Работа' ? '' : eventType}
            interval={eventType === 'Работа' ? '' : interval}
            icon={eventType === 'Работа' ? '' : 'icon-Vacation'}
            fontColorStyle={eventType === 'Работа' ? '' : 'success'}
            fontSize={'xs'}
            backgroundColorStyle={eventType === 'Работа' ? 'contrast-info' : 'success'}
            viewMode={eventType === 'Работа' ? 'thin' : 'normal'}
        />
    );
}
