import { forwardRef } from 'react';
import { View } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../DemoHelpers/DataCatalog';

const NUMBER_OF_ITEMS = 50;

function getData() {
    return generateData<{
        key: number;
        title: string;
        description: string;
        column: number;
    }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string', description: 'lorem' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". ${item.title}`;
        },
    });
}

const Component = forwardRef(function (props, ref) {
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height400 controlsDemo__minWidth600 controlsDemo__maxWidth1200">
                <View storeId="ColumnsViewBackgroundStyle" backgroundStyle="unaccented" />
            </Container>
        </div>
    );
});

export default Component;

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsViewBackgroundStyle: {
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
