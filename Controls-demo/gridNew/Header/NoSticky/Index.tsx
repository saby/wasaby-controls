import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

const header = Countries.getHeader();
const columns = Countries.getColumnsWithWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo_fixedWidth800 controlDemo__grid-header-noSticky';
    return (
        <div className={rootClass} ref={ref}>
            <Container style={{ height: 400 }}>
                <View
                    storeId="HeaderNoSticky"
                    header={header}
                    stickyHeader={false}
                    columns={columns}
                />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        HeaderNoSticky: {
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
