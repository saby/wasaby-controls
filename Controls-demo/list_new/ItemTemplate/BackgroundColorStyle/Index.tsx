import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getColorsData as getData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateBackgroundColorStyle" itemTemplate={itemTemplate} />
        </div>
    );
});

export default Component;

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            backgroundColorStyle={itemTemplateProps.item.contents.get('backgroundStyle')}
        />
    );
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateBackgroundColorStyle: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'backgroundStyle',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
            },
        },
    };
};
