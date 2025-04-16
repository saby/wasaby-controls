import { forwardRef, LegacyRef } from 'react';
import DemoTemplate from '../resources/Template';

function RoundChartTypeDemo(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="tw-flex tw-items-center tw-justify-center">
            <DemoTemplate className="controls-margin_right-2xl" legendVisible={true} />
            <DemoTemplate type="pie" />
        </div>
    );
}

export default forwardRef(RoundChartTypeDemo);
