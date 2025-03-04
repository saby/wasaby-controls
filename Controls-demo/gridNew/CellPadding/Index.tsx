import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { CellPadding } from 'Controls-demo/gridNew/DemoHelpers/Data/CellPadding';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = CellPadding;
const columns = CellPadding.getColumns();
const header = CellPadding.getHeader();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref} style={{ maxWidth: '500px' }}>
            <Container>
                <div className="controlsDemo__inline-flex">
                    <View
                        storeId="CellPadding"
                        header={header}
                        rowSeparatorSize="s"
                        columnSeparatorSize="s"
                        columns={columns}
                    />
                </div>
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        CellPadding: {
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
