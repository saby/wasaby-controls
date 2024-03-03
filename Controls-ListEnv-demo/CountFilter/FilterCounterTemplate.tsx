import * as React from 'react';
import CountFilter from 'Controls-ListEnv/CountFilter';
import { RecordSet } from 'Types/collection';
import { period } from 'Types/formatter';

const linkedFilters = ['task'];

const dateItems = new RecordSet({
    rawData: [
        { id: 'Today', title: 'сегодня' },
        {
            id: 'Week',
            title: 'неделю',
        },
        {
            id: 'Month',
            title: 'месяц',
        },
        {
            id: 'Year',
            title: 'год',
        },
    ],
    keyProperty: 'id',
});

const datePopupOptions = {
    editorMode: 'Lite',
};

function captionFormatter(startValue: Date, endValue: Date) {
    return period(startValue, endValue, { short: true }).toLowerCase();
}

export default React.forwardRef(function FilterCounterTemplate(props, ref) {
    const item = props.item.contents;
    return (
        <div ref={ref} className="tw-flex tw-items-baseline tw-justify-between tw-w-full">
            {item.get(props.column.config.displayProperty)}
            {!item.get('id') ? (
                <CountFilter
                    storeId="rating"
                    linkedFilters={linkedFilters}
                    items={dateItems}
                    value="Year"
                    keyProperty="id"
                    displayProperty="title"
                    caption="за"
                    captionFormatter={captionFormatter}
                    datePopupOptions={datePopupOptions}
                />
            ) : null}
        </div>
    );
});
