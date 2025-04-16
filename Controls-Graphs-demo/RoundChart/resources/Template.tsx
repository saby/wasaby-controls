import { forwardRef, LegacyRef } from 'react';
import RoundChart, { IRoundChartProps } from 'Controls-Graphs/RoundChart';
import { DATA, VALUE_PROPERTY, SERIES } from './data';
import 'css!Controls-Graphs-demo/RoundChart/resources/Style';

function RoundChartDemoTemplate(props: IRoundChartProps, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div className="controls-Graphs-demo__RoundChart__width">
            <RoundChart
                ref={ref}
                data={DATA}
                valueProperty={VALUE_PROPERTY}
                {...props}
                series={SERIES}
                className={`${props.className}`}
            />
        </div>
    );
}

export default forwardRef(RoundChartDemoTemplate);
