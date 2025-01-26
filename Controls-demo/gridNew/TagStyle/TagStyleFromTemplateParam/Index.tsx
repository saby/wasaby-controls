import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Model, Record } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { TagStyle } from 'Controls-demo/gridNew/DemoHelpers/Data/TagStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { useCallback, useState, forwardRef } from 'react';

const { getData } = TagStyle;

const columns: IColumn[] = TagStyle.getColumns();

const TagStyleGridDemo = forwardRef(function (props, ref) {
    // Номер выбранной колонки
    const [currentColumnIndex, setCurrentColumnIndex] = useState<number | null>(null);
    // Тип события
    const [currentEvent, setCurrentEvent] = useState<string>();
    // Значение выбранной колонки
    const [currentValue, setCurrentValue] = useState<string>();

    const onTagHoverCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('hover');
        setCurrentValue(item.get('population'));
    }, []);

    const onTagClickCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('click');
        setCurrentValue(item.get('population'));
    }, []);

    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__grid-tagStyle controlsDemo__maxWidth800';
    return (
        <div className={rootClass} ref={ref}>
            <View
                storeId="TagStyleFromTemplateParam1"
                columns={columns}
                onTagClick={onTagClickCustomHandler}
                onTagHover={onTagHoverCustomHandler}
            />
            <div className="controlsDemo-toolbar-panel">
                &nbsp;&nbsp;
                {currentEvent && currentColumnIndex && currentValue
                    ? currentEvent +
                      ' на теге в колонке №' +
                      currentColumnIndex +
                      ' со значением ' +
                      currentValue
                    : ''}
            </div>
        </div>
    );
});

export default TagStyleGridDemo;

TagStyleGridDemo.getLoadConfig = function (): Record<
    string,
    IDataConfig<IListDataFactoryArguments>
> {
    return {
        TagStyleFromTemplateParam1: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                displayProperty: 'title',
                source: new Memory({
                    keyProperty: 'key',
                    data: getData(),
                }),
                multiSelectVisibility: 'hidden',
            },
        },
    };
};
