import { forwardRef, useMemo } from 'react';
import { Buttons } from 'Controls-TabsLayout/verticalTabs';
import { RecordSet } from 'Types/collection';

export default forwardRef(function VerticalTabsScrollDemo(_, ref) {
    const itemsData = useMemo(
        () =>
            Array.from({ length: 100 }).map((_, idx) => ({
                title: `Вкладка${idx + 1}`,
                key: idx + 1,
            })),
        []
    );

    const items = new RecordSet({
        rawData: itemsData,
        keyProperty: 'key',
    });

    return (
        <div ref={ref} className="tw-flex ws-justify-content-center">
            <Buttons keyProperty="key" items={items} className="controlsDemo__height400" />
        </div>
    );
});
