import { forwardRef } from 'react';
import { View } from 'Controls/treeGrid';
import { FooterTemplate } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';
import { WithPhoto } from 'Controls-demo/treeGridNew/DemoHelpers/Data/WithPhoto';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!Controls-demo/treeGridNew/ItemTemplate/WithPhoto/styles';

const { getData } = Flat;

const columns = WithPhoto.getGridColumnsWithPhoto();

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper controlsDemo_fixedWidth1700';
    return (
        <div className={rootClass} ref={ref}>
            <View
                className="demoTreeWithProto__treeGrid32"
                storeId="ItemTemplateWithPhotoPhoto32px3"
                columns={columns}
                footerTemplate={(props) => {
                    return (
                        <FooterTemplate {...props}>
                            <div className="controlsDemo__hor-padding__list__footerContent">
                                Подвал списка
                            </div>
                        </FooterTemplate>
                    );
                }}
            ></View>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (
    expandOnLoad?: boolean
): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ItemTemplateWithPhotoPhoto32px3: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new HierarchicalMemory({
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    data: getData(),
                }),
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                expandedItems: expandOnLoad === false ? [] : [1, 15, 153],
            },
        },
    };
};
