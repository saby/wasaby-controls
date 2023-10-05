import * as React from 'react';

const HOURS_COUNT = 24;

export function StaticColumnsRenderComponent(): React.ReactElement {
    const hours = [];
    for (let i = 0; i < HOURS_COUNT; i++) {
        hours.push(i);
    }

    return (
        <div className="controlsListsDemo__dynamicGrid__hoursWrapper">
            {hours.map((hour) => {
                const text = `${hour < 10 ? '0' : ''}${hour}:00`;
                return (
                    <div className="controlsListsDemo__dynamicGrid__hoursWrapper__hour" key={hour}>
                        {text}
                    </div>
                );
            })}
        </div>
    );
}

export function StaticHeaderRenderComponent(): React.ReactElement {
    return <div>День</div>;
}

export function DynamicColumnsRenderComponent(props): React.ReactElement {
    const { columnData } = props;

    return <div>{columnData ? columnData.get('data') : '?'}</div>;
}

export function DynamicHeaderRenderComponent(): React.ReactElement {
    return (
        <div className="controlsListsDemo__dynamicGrid__header">
            <div className="controlsListsDemo__dynamicGrid__header-photo"></div>
            <div className="controlsListsDemo__dynamicGrid__header-fio">Имя Фамилия</div>
        </div>
    );
}
