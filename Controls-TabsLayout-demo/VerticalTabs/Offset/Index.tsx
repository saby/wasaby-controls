import { forwardRef, LegacyRef } from 'react';
import { Buttons } from 'Controls-TabsLayout/verticalTabs';
import { RecordSet } from 'Types/collection';

export default forwardRef(function VerticalTabsOffsetDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const items = new RecordSet({
        rawData: [
            {
                key: 1,
                title: 'Заказ',
            },
            {
                key: 2,
                title: 'Отгрузка',
                mainCounter: 852600,
            },
            {
                key: 3,
                title: 'Отгрузка',
                mainCounter: 52600,
            },
        ],
        keyProperty: 'id',
    });

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div className="tw-flex tw-justify-start">
                <div className="controls-margin_right-m">
                    <div className="controls-text-label">offset = xs</div>
                    <Buttons items={items} offset="xs" />
                </div>
                <div>
                    <div className="controls-text-label">offset null</div>
                    <Buttons items={items} />
                </div>
            </div>
        </div>
    );
});
