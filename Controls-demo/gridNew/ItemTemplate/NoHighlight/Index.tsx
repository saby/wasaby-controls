import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXINDEX = 5;

function getData() {
    return Countries.getData().slice(0, MAXINDEX);
}

const columns = Countries.getColumnsWithFixedWidths();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateNoHighlight" columns={columns} itemTemplate={itemTemplate} />
        </div>
    );
});

export default Component;

function itemTemplate(props) {
    return <ItemTemplate {...props} highlightOnHover={false} />;
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateNoHighlight: {
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
