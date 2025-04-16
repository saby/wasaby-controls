import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import 'Controls/gridReact';
import { IColumnConfig } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Infobox } from 'Controls/popup';

const items = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            population: 143420300,
            tagStyle: null,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            population: 32805000,
            tagStyle: 'info',
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            population: 295734100,
            tagStyle: 'danger',
        },
        {
            key: 3,
            number: 4,
            country: 'Китай',
            population: 1306313800,
            tagStyle: 'primary',
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            population: 186112800,
            tagStyle: 'success',
        },
        {
            key: 5,
            number: 6,
            country: 'Австралия',
            population: 20090400,
            tagStyle: 'warning',
        },
        {
            key: 6,
            number: 7,
            country: 'Индия',
            population: 1080264400,
            tagStyle: 'secondary',
        },
        {
            key: 7,
            number: 8,
            country: 'Аргентина',
            population: 39537900,
            tagStyle: 'info',
        },
    ],
});

export default React.forwardRef(
    (props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) => {
        // region INIT

        const iBoxOpener = new Infobox();
        const columns = React.useMemo<IColumnConfig[]>(function () {
            return [
                {
                    displayProperty: 'number',
                    width: '40px',
                },
                {
                    displayProperty: 'country',
                    width: '200px',
                },
                {
                    displayProperty: 'population',
                    width: '150px',
                    getCellProps(_item: Model): object {
                        return {
                            tagStyle: _item.get('tagStyle'),
                            halign: 'end',
                        };
                    },
                },
            ];
        }, []);
        const [eventResult, setEventResult] = React.useState<{ type: string; column: string }>({
            type: null,
            column: null,
        });

        // endregion INIT

        // region HANDLERS

        const onTagClick = (item: Model, columnIndex: number, nativeEvent: Event) => {
            iBoxOpener.open({
                target: nativeEvent.target,
                message: `You've clicked the ${columnIndex} column of item "${item.get(
                    'country'
                )}"`,
            });
            setEventResult({ type: 'click', column: columnIndex });
        };

        const onTagHover = (item: Model, columnIndex: number, nativeEvent: Event) => {
            iBoxOpener.open({
                target: nativeEvent.target,
                message: `You've hovered the ${columnIndex} column of item "${item.get(
                    'country'
                )}"`,
            });
            setEventResult({ type: 'hover', column: columnIndex });
        };

        // endregion HANDLERS

        return (
            <div ref={ref}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    onTagClick={onTagClick}
                    onTagHover={onTagHover}
                    customEvents={['onTagClick', 'onTagHover']}
                />
                ;
                <div className={'controlsDemo-logger'}>
                    <div>
                        <b>Событие: </b>:&nbsp;
                        <span data-qa={'logger-event'}>{eventResult.type}</span>
                    </div>
                    <div>
                        <b>Колонка: </b>:&nbsp;
                        <span data-qa={'logger-column'}>{eventResult.column}</span>
                    </div>
                </div>
            </div>
        );
    }
);
