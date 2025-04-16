import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

const header = Countries.getHeader();
const columns = Countries.getColumnsWithFixedWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlDemo__grid-header-sticky';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height400 controlsDemo__width800px">
                <View
                    backgroundStyle="default"
                    storeId="HeaderSticky"
                    header={header}
                    columns={columns}
                />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        HeaderSticky: {
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
