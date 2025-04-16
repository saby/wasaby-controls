import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { MultilineLadder } from 'Controls-demo/gridNew/DemoHelpers/Data/MultilineLadder';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = MultilineLadder;

const columns = MultilineLadder.getColumnsWithResults();
const header = MultilineLadder.getHeader();
const ladderProperties = ['date', 'time'];

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height300">
                <View
                    storeId="LadderStickyMultilineStickyMultilineWithHeader1"
                    columns={columns}
                    header={header}
                    resultsPosition="top"
                    ladderProperties={ladderProperties}
                />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        LadderStickyMultilineStickyMultilineWithHeader1: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            },
        },
    };
};
