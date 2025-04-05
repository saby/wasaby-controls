import { forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 50;

interface IData {
    key: number;
    title: string;
    description: string;
    column: number;
}

function getData(): IData[] {
    return generateData<IData>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string', description: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
        },
    });
}
const contentPadding = {
    left: 'm',
    right: 'm',
    top: 's',
    bottom: 's',
} as const;

const RenderDemo = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height400 controlsDemo__minWidth600 controlsDemo__maxWidth1200">
                <View storeId="ColumnsViewContentPadding" itemTemplate={itemTemplate} />
            </Container>
        </div>
    );
});

export default RenderDemo;

function itemTemplate(itemTemplateProps) {
    return <ItemTemplate {...itemTemplateProps} contentPadding={contentPadding} />;
}

RenderDemo.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsViewContentPadding: {
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
