import * as React from 'react';
import CountFilter from 'Controls-ListEnv/CountFilter';

const excludedPeriods = ['yesterday', 'quarter'];
const datePopupOptions = {
    editorMode: 'Lite',
};

const userPeriods = [
    {
        key: 'twoYears',
        title: 'Два года',
        getValueFunctionName: 'Controls-ListEnv-demo/CountFilter/FilterCounterTemplate:getValue',
    },
];

const _date = new Date(2022, 10, 2);

export default React.forwardRef(function FilterCounterTemplate(props, ref) {
    const item = props.item.contents;
    return (
        <div ref={ref} className="tw-flex tw-items-baseline tw-justify-between tw-w-full">
            {item.get(props.column.config.displayProperty)}
            {!item.get('id') ? (
                <CountFilter
                    storeId="rating"
                    excludedPeriods={excludedPeriods}
                    userPeriods={userPeriods}
                    _date={_date} // только для тестов, чтобы замокать текущий день
                    caption="за"
                    datePopupOptions={datePopupOptions}
                />
            ) : null}
        </div>
    );
});

export function getValue(): [Date, Date] {
    return [new Date(2020, 10, 1), new Date(2022, 10, 1)];
}
