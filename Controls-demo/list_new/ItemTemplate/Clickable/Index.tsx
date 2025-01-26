import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getCursorData as getData } from '../../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateClickable" itemTemplate={itemTemplate} />
        </div>
    );
});

export default Component;

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            displayProperty="value"
            cursor={itemTemplateProps.item.contents.get('cursor')}
            highlightOnHover={itemTemplateProps.item.contents.get('hovered')}
        />
    );
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateClickable: {
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
