import { forwardRef } from 'react';
import { View, ColumnTemplate } from 'Controls/grid';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IColorColumn extends IColumn {
    getColor?: (n: number) => string;
}

const { getData } = Countries;
const columns: IColorColumn[] = Countries.getColumns();
const populationColumn = columns.find((column) => {
    return column.displayProperty === 'populationDensity';
});
populationColumn.template = (props) => {
    return (
        <ColumnTemplate
            {...props}
            backgroundColorStyle={props.column.config.getColor(
                props.item.contents.get('populationDensity')
            )}
        />
    );
};
populationColumn.getColor = (populationDensity: number) => {
    // eslint-disable-next-line
    if (populationDensity > 100) {
        return 'danger';
    }
    // eslint-disable-next-line
    if (populationDensity < 10) {
        return 'warning';
    }

    return 'success';
};

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref} style={{ maxWidth: 1182 }}>
            <Container>
                <div className="controlsDemo__inline-flex">
                    <View storeId="ColumnTemplate" columns={columns}></View>
                </div>
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnTemplate: {
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
