import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View } from 'Controls/grid';
import { Button } from 'Controls/buttons';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

function getData() {
    return Tasks.getData().slice(0, 3);
}

const columns: IColumn[] = Tasks.getDefaultColumnsLargeWidths();

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [rowSeparatorVisibility, setRowSeparatorVisibility] = React.useState<string>(null);
    const [groupProperty, setGroupProperty] = React.useState<string>(null);

    const styleObj = { width: '200px' };

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <View
                className={'controlsDemo__inline-flex'}
                storeId={'RowSeparatorVisibility'}
                rowSeparatorSize={'s'}
                groupProperty={groupProperty}
                rowSeparatorVisibility={rowSeparatorVisibility}
                columns={columns}
            />
            <div
                className="controlsDemo__flexColumn controlsDemo__wrapper__padding-top"
                style={styleObj}
            >
                <Button
                    data-qa={'rowSeparator-all'}
                    caption="По умолчанию"
                    onClick={() => {
                        setRowSeparatorVisibility('all');
                    }}
                ></Button>
                <Button
                    data-qa={'rowSeparator-items'}
                    caption="Только у элементов"
                    onClick={() => {
                        setRowSeparatorVisibility('items');
                    }}
                ></Button>
                <Button
                    data-qa={'rowSeparator-edges'}
                    caption="Только по краям"
                    onClick={() => {
                        setRowSeparatorVisibility('edges');
                    }}
                ></Button>
                <Button
                    data-qa={'toggle-groupProperty'}
                    caption={`${groupProperty === 'group' ? '-' : '+'} скрытая группа`}
                    onClick={() => {
                        setGroupProperty(groupProperty === 'group' ? null : 'group');
                    }}
                ></Button>
            </div>
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            RowSeparatorVisibility: {
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
    },
});
