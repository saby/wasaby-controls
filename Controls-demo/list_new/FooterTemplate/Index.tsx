import { forwardRef } from 'react';
import { View, AddButton } from 'Controls/list';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__maxWidth200 controlsDemo_list-new_FooterTemplate';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="FooterTemplate"
                footerTemplate={(footerTemplateProps) => {
                    return <AddButton {...footerTemplateProps} caption="Add record" />;
                }}
            ></View>
        </div>
    );
});
export default Component;
Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        FooterTemplate: {
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
