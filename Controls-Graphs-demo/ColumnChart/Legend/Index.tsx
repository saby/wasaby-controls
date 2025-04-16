import { forwardRef, LegacyRef, useCallback, useState } from 'react';
import { DoubleSwitch } from 'Controls/toggle';
import { Control } from 'Controls/RadioGroup';
import ColumnChart from 'Controls-Graphs/ColumnChart';
import { RecordSet } from 'Types/collection';
import 'css!Controls-Graphs-demo/ColumnChart/resources/Styles';
import { DATA, XAXIS, COLUMN_CHART_SERIES_CONFIG } from '../resources/data';

const verticalVariants = ['top', 'bottom'];
const horizontalVariants = ['start', 'center', 'end'];

const VERTICAL_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: verticalVariants.map((item, index) => ({
        id: String(index),
        title: item,
    })),
});

const HORIZONTAL_ITEMS = new RecordSet({
    keyProperty: 'id',
    rawData: horizontalVariants.map((item, index) => ({
        id: String(index),
        title: item,
    })),
});

export default forwardRef(function ColumnChartLegendDemo(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const [legendVisible, setLegendVisible] = useState(true);
    const handleChangeLegendVisible = useCallback((value: boolean) => {
        setLegendVisible(value);
    }, []);
    const [legendVerticalPositionVariant, setLegendVerticalPositionVariant] = useState('0');
    const handleChangeLegendVerticalPositionVariant = useCallback((_: Event, key: string) => {
        setLegendVerticalPositionVariant(key);
    }, []);
    const [legendHorizontalAlignmentVariant, setLegendHorizontalAlignmentVariant] = useState('1');
    const handleChangeLegendHorizontalAlignmentVariant = useCallback((_: Event, key: string) => {
        setLegendHorizontalAlignmentVariant(key);
    }, []);
    return (
        <div ref={ref} className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-items-start tw-justify-center">
                <div className="controls-margin_bottom-m controls-margin_right-2xl">
                    <div className="controls-text-label">legendVisible</div>
                    <DoubleSwitch
                        value={legendVisible}
                        onValueChanged={handleChangeLegendVisible}
                        onCaption="true"
                        offCaption="false"
                    />
                </div>
                <div className="controls-margin_right-2xl">
                    <div className="controls-text-label">legendVerticalPosition</div>
                    <Control
                        items={VERTICAL_ITEMS}
                        selectedKey={legendVerticalPositionVariant}
                        onSelectedKeyChanged={handleChangeLegendVerticalPositionVariant}
                    />
                </div>
                <div>
                    <div className="controls-text-label">legendHorizontalAlignment</div>
                    <Control
                        items={HORIZONTAL_ITEMS}
                        selectedKey={legendHorizontalAlignmentVariant}
                        onSelectedKeyChanged={handleChangeLegendHorizontalAlignmentVariant}
                    />
                </div>
            </div>
            <ColumnChart
                legendVisible={legendVisible}
                legendHorizontalAlignment={horizontalVariants[+legendHorizontalAlignmentVariant]}
                legendVerticalPosition={verticalVariants[+legendVerticalPositionVariant]}
                data={DATA}
                series={COLUMN_CHART_SERIES_CONFIG}
                xAxis={XAXIS}
                className="controls-Graphs-demo__ColumnChart"
            />
        </div>
    );
});
