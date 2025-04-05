import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData()[0];
}

const header = Countries.getHeader();
const columns = Countries.getColumnsWithWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo__grid-header-default';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__inline-flex controlsDemo__maxWidth800">
                <View
                    storeId="HeaderVisibilityVisible"
                    header={header}
                    columns={columns}
                    headerVisibility="visible"
                />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        HeaderVisibilityVisible: {
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
