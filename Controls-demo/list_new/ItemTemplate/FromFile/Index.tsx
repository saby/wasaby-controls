import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth1400';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateFromFile" itemTemplate={TempItem} />
        </div>
    );
});

export default Component;

export function TempItem(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            contentTemplate={(contentTemplateProps) => {
                return (
                    <div>
                        <div>{contentTemplateProps.item.contents.get('description')}</div>
                        <div style={{ fontSize: '11px', color: 'grey' }}>
                            From file "ItemTemplate.wml"
                        </div>
                    </div>
                );
            }}
        ></ItemTemplate>
    );
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateFromFile: {
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
