import { useCallback, useState, useMemo, forwardRef } from 'react';
import { View } from 'Controls/grid';
import { Memory } from 'Types/source';
import { Model, Record } from 'Types/entity';
import { TagStyle } from 'Controls-demo/gridNew/DemoHelpers/Data/TagStyle';
import Index from 'Controls-demo/gridNew/DemoLayout/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!DemoStand/Controls-demo';

const { getData } = TagStyle;

const columns = TagStyle.getColumns();
// Название свойства, из которого следует брать стильдля тега
const tagStyleProperty = 'customProperty';

const TagStyleGridDemo = forwardRef(function (props, ref) {
    const [columnSeparatorSize, setColumnSeparatorSize] = useState<undefined | 's'>();
    // Номер выбранной колонки
    const [currentColumnIndex, setCurrentColumnIndex] = useState<number | null>(null);
    // Тип события
    const [currentEvent, setCurrentEvent] = useState<string>();
    // Значение выбранной колонки
    const [currentValue, setCurrentValue] = useState<string>();
    const onTagClickCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('hover');
        setCurrentValue(item.get('population'));
    }, []);

    const onTagHoverCustomHandler = useCallback((item: Model, columnIndex: number) => {
        setCurrentColumnIndex(columnIndex);
        setCurrentEvent('click');
        setCurrentValue(item.get('population'));
    }, []);

    const toggleColumnSeparatorSize = useCallback(() => {
        setColumnSeparatorSize((prevState) => {
            return prevState === 's' ? undefined : 's';
        });
    }, []);
    const rightSidebar = useMemo(() => {
        return {
            isExpanded: true,
            items: [
                {
                    template: () => {
                        return (
                            <>
                                <h4 className="controlsDemo__mb1">
                                    Переключатель опции списка columnSeparator
                                </h4>
                                <button
                                    data-qa="controlsDemo-Development__toggleColumnSeparator"
                                    onClick={toggleColumnSeparatorSize}
                                    style={{ padding: '3px' }}
                                >
                                    {columnSeparatorSize ? 'Выключить' : 'Включить'}
                                </button>
                            </>
                        );
                    },
                },
            ],
        };
    }, [columnSeparatorSize, toggleColumnSeparatorSize]);
    const rootClass =
        props.className + ' controlsDemo__grid-tagStyleProperty controlsDemo__maxWidth800';
    return (
        <Index className={rootClass} ref={ref} rightSidebar={rightSidebar}>
            <div className=" controlsDemo__grid-tagStyleProperty controlsDemo__maxWidth800">
                <View
                    storeId="TagStyleFromCellData0"
                    columns={columns}
                    columnSeparatorSize={columnSeparatorSize}
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
        </Index>
    );
});

export default TagStyleGridDemo;

TagStyleGridDemo.getLoadConfig = function (): Record<
    string,
    IDataConfig<IListDataFactoryArguments>
> {
    return {
        TagStyleFromCellData0: {
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
