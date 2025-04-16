import { forwardRef, LegacyRef } from 'react';
import LinearChart, { ILinearChartProps } from 'Controls-Graphs/LinearChart';
import 'css!Controls-Graphs-demo/LinearChart/resources/Styles';

export default forwardRef(function LinearChartDemoTemplate(
    props: ILinearChartProps,
    ref: LegacyRef<HTMLDivElement>
) {
    return (
        <LinearChart
            {...props}
            ref={ref}
            className={`controls-Graphs-demo__LinearChart ${props.className}`}
        />
    );
});
