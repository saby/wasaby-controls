import { RecordSet } from 'Types/collection';
import { IColumnConfig, useItemData } from 'Controls/gridReact';
import { TVisibility } from 'Controls/interface';
import { TBorderStyle } from 'Controls/display';
import * as React from 'react';
import { Model } from 'Types/entity';
import { Text as TextInput } from 'Controls/input';
import { IData } from 'Controls-demo/gridNew/DemoHelpers/DataCatalog';

function EditCell(props: { property: string }) {
    const property = props.property;

    const { item, renderValues } = useItemData<Model>([property]);
    const onValueChanged = React.useCallback(
        (_, value) => {
            return item.set(property, value);
        },
        [item]
    );

    return (
        <TextInput
            value={String(renderValues[property])}
            className={'tw-w-full'}
            contrastBackground
            onValueChanged={onValueChanged}
        />
    );
}

export function getData(): object[] {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            capital: 'Москва',
            isNumberEditable: true,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            capital: 'Оттава',
            isNumberEditable: false,
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            isNumberEditable: false,
        },
    ];
}

export function getMoreData(): object[] {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            capital: 'Москва',
            isNumberEditable: true,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            capital: 'Оттава',
            isNumberEditable: false,
        },
        {
            key: 2,
            number: 3,
            country: 'Греция',
            capital: 'Афины',
            isNumberEditable: false,
        },
        {
            key: 3,
            number: 4,
            country: 'Словакия',
            capital: 'Братислава',
            isNumberEditable: false,
        },
        {
            key: 4,
            number: 5,
            country: 'Польша',
            capital: 'Варшава',
            isNumberEditable: false,
        },
        {
            key: 5,
            number: 6,
            country: 'Сейшельские острова',
            capital: 'Виктория',
            isNumberEditable: false,
        },
        {
            key: 6,
            number: 7,
            country: 'Белоруссия',
            capital: 'Минск',
            isNumberEditable: false,
        },
        {
            key: 7,
            number: 8,
            country: 'Кения',
            capital: 'Найроби',
            isNumberEditable: false,
        },
    ];
}

export function getDataWithNumbers(): object[] {
    return [
        {
            key: 0,
            number: 1,
            country: 'Россия',
            capital: 'Москва',
            population: 143420300,
            square: 17075200,
            populationDensity: 8,
            averageIncome: 80000,
        },
        {
            key: 1,
            number: 2,
            country: 'Канада',
            capital: 'Оттава',
            population: 32805000,
            square: 9976140,
            populationDensity: 3,
            averageIncome: 180000,
        },
        {
            key: 2,
            number: 3,
            country: 'Соединенные Штаты Америки',
            capital: 'Вашингтон',
            population: 295734100,
            square: 9629091,
            populationDensity: 30.71,
            averageIncome: 580000,
        },
        {
            key: 3,
            number: 4,
            country: 'Китай',
            capital: 'Пекин',
            population: 1306313800,
            square: 9596960,
            populationDensity: 136.12,
            averageIncome: 600000,
        },
        {
            key: 4,
            number: 5,
            country: 'Бразилия',
            capital: 'Бразилиа',
            population: 186112800,
            square: 8511965,
            populationDensity: 21.86,
            averageIncome: 180000,
        },
        {
            key: 5,
            number: 6,
            country: 'Австралия',
            capital: 'Канберра',
            population: 20090400,
            square: 7686850,
            populationDensity: 3,
            averageIncome: 80000,
        },
        {
            key: 6,
            number: 7,
            country: 'Индия',
            capital: 'Нью-Дели',
            population: 1080264400,
            square: 3287590,
            populationDensity: 328.59,
            averageIncome: 8000,
        },
        {
            key: 7,
            number: 8,
            country: 'Аргентина',
            capital: 'Буэнос-Айрес',
            population: 39537900,
            square: 2766890,
            populationDensity: 4.29,
        },
    ];
}

export function getItems(): RecordSet {
    return new RecordSet({
        rawData: getData(),
        keyProperty: 'key',
    });
}

export function getMoreItems(): RecordSet {
    return new RecordSet({
        rawData: getMoreData(),
        keyProperty: 'key',
    });
}

export function getItemsWithNumbers(): RecordSet {
    return new RecordSet({
        rawData: getDataWithNumbers(),
        keyProperty: 'key',
    });
}

export function getHeader(): IColumnConfig[] {
    return [
        {
            key: 'nom_header',
            caption: '#',
        },
        {
            key: 'country_name_header',
            caption: 'Страна',
        },
        {
            key: 'capital_header',
            caption: 'Столица',
        },
    ];
}

export function getColumns(
    borderVisibility?: TVisibility,
    borderStyle?: TBorderStyle,
    withEditorRender?: boolean
): IColumnConfig[] {
    // key чтобы прошла проверка isReactView
    return [
        {
            displayProperty: 'number',
            width: '50px',
            editorRender: withEditorRender ? <EditCell property={'number'} /> : undefined,
            getCellProps: (item) => {
                return {
                    borderVisibility,
                    borderStyle,
                    fontWeight: item.getKey() % 2 === 0 ? 'bold' : undefined,
                };
            },
        },
        {
            displayProperty: 'country',
            width: '1fr',
            editorRender: withEditorRender ? <EditCell property={'country'} /> : undefined,
            getCellProps: () => {
                return {
                    borderVisibility,
                    borderStyle,
                };
            },
        },
        {
            displayProperty: 'capital',
            width: '1fr',
            editorRender: withEditorRender ? <EditCell property={'capital'} /> : undefined,
            getCellProps: () => {
                return {
                    borderVisibility,
                    borderStyle,
                };
            },
        },
    ];
}
