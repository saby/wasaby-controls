import { useState, forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Checkbox } from 'Controls/checkbox';
import { Memory } from 'Types/source';
import * as clone from 'Core/core-clone';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().splice(0, 5);
}

let columnData = clone(Countries.getColumnsWithFixedWidths());
// eslint-disable-next-line
columnData = [...columnData.slice(0, 2), ...columnData.slice(3, 6)];
// eslint-disable-next-line
columnData[2].align = 'center';
// eslint-disable-next-line
columnData[3].align = 'center';
// eslint-disable-next-line
columnData[4].align = 'center';
const columns = clone(columnData);

const header = [
    {
        startRow: 1,
        endRow: 3,
        startColumn: 1,
        endColumn: 2,
        title: '#',
    },
    {
        startRow: 1,
        endRow: 3,
        startColumn: 2,
        endColumn: 3,
        title: 'Страна',
    },
    {
        startRow: 1,
        endRow: 2,
        startColumn: 3,
        endColumn: 5,
        align: 'center',
        title: 'Характеристики',
    },
    {
        startRow: 2,
        endRow: 3,
        startColumn: 3,
        endColumn: 4,
        align: 'center',
        title: 'Население',
    },
    {
        startRow: 2,
        endRow: 3,
        startColumn: 4,
        endColumn: 5,
        align: 'center',
        title: 'Площадь',
    },
    {
        startRow: 1,
        endRow: 3,
        startColumn: 5,
        endColumn: 6,
        align: 'center',
        title: 'Плотность',
    },
];

const Component = forwardRef(function (props, ref) {
    const [rowSeparator, setRowSeparator] = useState(false);
    const [columnSeparator, setColumnSeparator] = useState(true);
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref} style={{ maxWidth: '620px' }}>
            <div style={{ marginBottom: '20px' }}>
                <Checkbox
                    value={rowSeparator}
                    caption="Show row separator"
                    onValueChanged={setRowSeparator}
                />
                <Checkbox
                    value={columnSeparator}
                    caption="Show column separator"
                    onValueChanged={setColumnSeparator}
                />
            </div>
            <View
                storeId="ColumnSeparatorWithMultiHeader1"
                header={header}
                columns={columns}
                rowSeparatorSize={rowSeparator ? 's' : undefined}
                columnSeparatorSize={columnSeparator ? 's' : undefined}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnSeparatorWithMultiHeader1: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                multiSelectVisibility: 'visible',
            },
        },
    };
};
