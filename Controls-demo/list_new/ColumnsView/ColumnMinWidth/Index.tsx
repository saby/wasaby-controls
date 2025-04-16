import { useState, useCallback, forwardRef } from 'react';
import { ItemTemplate, View } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from '../../DemoHelpers/DataCatalog';

const NUMBER_OF_ITEMS = 10;

function getData(): { key: number; title: string }[] {
    return generateData<{ key: number; title: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

const Component = forwardRef(function (props, ref) {
    const [wideColumns, setWideColumns] = useState(true);
    const [maxColumnsCount, setMaxColumnsCount] = useState(0);
    const changeColumnWidth = useCallback(() => {
        setWideColumns((prevState) => !prevState);
    }, []);
    const changeMaxColumnsCount = useCallback(() => {
        setMaxColumnsCount((prevState) => {
            return prevState ? 0 : 2;
        });
    }, []);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__height300 controlsDemo_fixedWidth850';
    return (
        <div className={rootClass} ref={ref}>
            <div data-qa="controlsDemo_ColumnMinWidth__changeWidth" onClick={changeColumnWidth}>
                Изменить ширину колонок
            </div>
            <div
                data-qa="controlsDemo_ColumnMinWidth__changeMaxColumnsCount"
                onClick={changeMaxColumnsCount}
            >
                Изменить максимальное число колонок
            </div>
            <Container className="controlsDemo__height400 controlsDemo__minWidth600 controlsDemo__maxWidth800">
                <View
                    storeId="ColumnsViewColumnMinWidth"
                    maxColumnsCount={maxColumnsCount}
                    columnMaxWidth={wideColumns ? 400 : 250}
                    columnMinWidth={wideColumns ? 300 : 150}
                    itemTemplate={itemTemplate}
                />
            </Container>
        </div>
    );
});

export default Component;

function itemTemplate(itemTemplateProps) {
    return <ItemTemplate {...itemTemplateProps} className="controlsDemo__height36_item" />;
}

Component.getLoadConfig = function (): Record<string, IDataConfig<IListDataFactoryArguments>> {
    return {
        ColumnsViewColumnMinWidth: {
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
