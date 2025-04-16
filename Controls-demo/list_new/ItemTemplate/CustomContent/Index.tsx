import { useCallback, forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const itemTemplate = useCallback((itemTemplateProps) => {
        return (
            <ItemTemplate
                {...itemTemplateProps}
                contentTemplate={
                    <div>
                        <div>{itemTemplateProps.item.contents.get('title')}</div>
                        <div style={{ fontSize: '11px', color: 'grey' }}>
                            {itemTemplateProps.item.contents.get('description')}
                        </div>
                    </div>
                }
            ></ItemTemplate>
        );
    }, []);
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth600';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="ItemTemplateCustomContent" itemTemplate={itemTemplate} />
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateCustomContent: {
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
