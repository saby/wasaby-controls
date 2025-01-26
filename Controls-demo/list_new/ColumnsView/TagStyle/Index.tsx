import { useState, useCallback, forwardRef } from 'react';
import { View, ItemTemplate } from 'Controls/columns';
import { Container } from 'Controls/scroll';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { TTagStyle } from 'Controls/interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import RenderDemo from 'Controls-demo/list_new/ColumnsView/ContentPadding';

// Генератор данных
const tagStyles: TTagStyle[] = [
    null,
    'info',
    'danger',
    'primary',
    'success',
    'warning',
    'secondary',
    'info',
];

function getData() {
    return generateData<{ key: number; title: string; tagStyle: string }>({
        count: 7,
        entityTemplate: {
            title: 'string',
            tagStyle: 'string',
        },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись с id="${item.key}".`;
            item.tagStyle = tagStyles[item.key];
        },
    });
}

const TagStyleGridDemo = forwardRef(function (props, ref) {
    // Номер выбранной колонки
    const [currentColumnIndex, setCurrentColumnIndex] = useState<number | null>(null);
    // Тип события
    const [currentEvent, setCurrentEvent] = useState<string>();
    // Значение выбранной колонки
    const [currentValue, setCurrentValue] = useState<string>();

    const onTagClickCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('hover');
        setCurrentValue(item.get('title'));
    }, []);

    const onTagHoverCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('click');
        setCurrentValue(item.get('title'));
    }, []);
    const rootClass = props.className + ' controlsDemo__wrapper';
    return (
        <div className={rootClass} ref={ref}>
            <Container className="controlsDemo__height150 controlsDemo__minWidth600 controlsDemo__maxWidth1200">
                <View
                    storeId="ColumnsViewTagStyle"
                    onTagClick={onTagClickCustomHandler}
                    onTagHover={onTagHoverCustomHandler}
                    itemTemplate={itemTemplate}
                />
            </Container>
            {currentEvent ? (
                <div className="controlsDemo-toolbar-panel">
                    {currentEvent} на теге
                    {currentColumnIndex !== undefined
                        ? ' в колонке №' + currentColumnIndex
                        : undefined}
                    {currentValue !== undefined ? ' со значением ' + currentValue : undefined}
                </div>
            ) : null}
        </div>
    );
});

export default TagStyleGridDemo;

function itemTemplate(itemTemplateProps) {
    return (
        <ItemTemplate
            {...itemTemplateProps}
            tagStyle={itemTemplateProps.item.contents?.get('tagStyle')}
        />
    );
}

TagStyleGridDemo.getLoadConfig = function (): Record<
    string,
    IDataConfig<IListDataFactoryArguments>
> {
    return {
        ColumnsViewTagStyle: {
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
