import { forwardRef } from 'react';
import { View, EmptyTemplate } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

const Component = forwardRef(function (props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__maxWidth200  controlsDemo_list-new_EmptyTemplate';
    return (
        <div className={rootClass} ref={ref}>
            <View storeId="EmptyListDefault" emptyTemplate={emptyTemplate} />
        </div>
    );
});

export default Component;

function emptyTemplate(emptyTemplateProps) {
    return <EmptyTemplate {...emptyTemplateProps} contentTemplate="No data available!" />;
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        EmptyListDefault: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: [],
                }),
            },
        },
    };
};
