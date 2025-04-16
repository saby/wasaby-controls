import { forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 5);
}

const header = [
    {
        title: '#',
        startColumn: 1,
        endColumn: 2,
    },
    {
        title: 'Географические данные',
        startColumn: 2,
        endColumn: 4,
        align: 'center',
    },
    {
        title: 'Цифры',
        startColumn: 4,
        endColumn: 7,
        align: 'center',
    },
];
const columns = Countries.getColumnsWithWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__grid-header-multiHeader-base controlsDemo__height400 controlsDemo_widthFit';
    return (
        <div className={rootClass} ref={ref}>
            <View
                backgroundStyle="default"
                storeId="HeaderUnion"
                header={header}
                columns={columns}
            />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        HeaderUnion: {
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
