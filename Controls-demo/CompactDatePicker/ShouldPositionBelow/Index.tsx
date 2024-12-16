import { forwardRef, LegacyRef } from 'react';
import { Selector } from 'Controls/dateRange';
import 'css!Controls-demo/CompactDatePicker/CompactDatePicker';

export default forwardRef(function ShouldPositionBelowCompactDatePickerDemo(
    props: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <Selector datePopupType="compactDatePicker" shouldPositionBelow={true} />
        </div>
    );
});
