import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { TTagStyle } from 'Controls/interface';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View as ListView } from 'Controls/list';

import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

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

interface IEventState {
    type?: string;
    value?: string;
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [eventState, setEventState] = React.useState<IEventState>({});

    /**
     * Эти хандлеры срабатывают при клике на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    const onTagClickCustomHandler = React.useCallback((item: Model): void => {
        setEventState({
            type: 'click',
            value: item.get('title'),
        });
    }, []);

    /**
     * Эти хандлеры срабатывают при наведении на Tag в шаблоне BaseControl.wml
     * @param event
     * @param item
     * @param columnIndex
     * @param nativeEvent
     * @private
     */
    const onTagHoverCustomHandler = React.useCallback((item: Model): void => {
        setEventState({
            type: 'hover',
            value: item.get('title'),
        });
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper" {...props}>
            <ScrollContainer
                className="controlsDemo__height150 controlsDemo__minWidth600 controlsDemo__maxWidth800"
            >
                <ListView
                    storeId="ListViewTagStyleProperty"
                    tagStyleProperty="tagStyle"
                    onTagClick={onTagClickCustomHandler}
                    onTagHover={onTagHoverCustomHandler}
                    className={'controls-padding_right-s'}
                />
            </ScrollContainer>
            {eventState.type ? (
                <div className="controlsDemo-toolbar-panel">
                    {eventState.type} на теге
                    {eventState.value !== undefined ? ' со значением ' + eventState.value : ''}
                </div>
            ) : null}
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ListViewTagStyleProperty: {
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
    },
});
