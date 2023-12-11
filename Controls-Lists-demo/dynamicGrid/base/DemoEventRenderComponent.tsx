import * as React from 'react';
import { EventLineRender } from 'Controls-Lists/timelineGrid';
import { EventBlockRender } from 'Controls-Lists/timelineGrid';
import { EventSquircleRender } from 'Controls-Lists/timelineGrid';

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
    const intersectionTest = [];

    if (eventStart.getDate() === 12) {
        let intersectionStart = new Date(2023, 0, 13);
        let intersectionEnd = new Date(2023, 0, 14);
        intersectionTest.push({
            start: intersectionStart,
            end: intersectionEnd,
        });
        intersectionStart = new Date(2023, 0, 15, 13);
        intersectionEnd = new Date(2023, 0, 17);
        intersectionTest.push({
            start: intersectionStart,
            end: intersectionEnd,
        });
        intersectionStart = new Date(2023, 0, 14, 12);
        intersectionEnd = new Date(2023, 0, 14, 14);
        intersectionTest.push({
            start: intersectionStart,
            end: intersectionEnd,
        });
    }
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
                hatchColorStyle={'success'}
                fontSize={'xs'}
                align={diffDays === 1 ? 'center' : 'left'}
                backgroundColorStyle={eventType === 'Работа' ? 'contrast-info' : 'success'}
                leftBevel={eventStart.getDate() === 23 ? 'top' : null}
                rightBevel={eventStart.getDate() === 14 ? 'bottom' : null}
                intersections={intersectionTest}
                eventStart={eventStart}
            />
        );
    }
}
