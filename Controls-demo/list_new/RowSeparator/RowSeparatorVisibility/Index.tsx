import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { View } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { getFewCategories } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { groupConstants } from 'Controls/display';

function getData() {
    return getFewCategories().map((obj) => {
        return Object.assign(obj, { group: groupConstants.hiddenGroup });
    });
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [rowSeparatorVisibility, setRowSeparatorVisibility] = React.useState(undefined as string);
    const [groupProperty, setGroupProperty] = React.useState<string>(null);

    const styleObj = { width: '200px' };

    return (
        <div ref={ref} className={'controlsDemo__wrapper'}>
            <View
                storeId={'RowSeparatorVisibility'}
                rowSeparatorSize={'s'}
                groupProperty={groupProperty}
                rowSeparatorVisibility={rowSeparatorVisibility}
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
