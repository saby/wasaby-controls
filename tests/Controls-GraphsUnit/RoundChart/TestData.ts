import { ISingleItem, ISingleSeriesItem } from 'Controls-Graphs/base';

export const TEST_DATA: ISingleItem[] = [
    {
        id: '0',
        name: '5% постоянным',
        value: 141,
    },
    {
        id: '1',
        name: '10% VIP',
        value: 213,
    },
    {
        id: '2',
        name: '20% в день',
        value: 96,
    },
    {
        id: '3',
        name: 'Новогодний сюрприз',
        value: 120,
    },
    {
        id: '4',
        name: 'БП для карт',
        value: 200,
    },
];

export const TEST_SERIES: ISingleSeriesItem[] = [
    {
        valueProperty: 'value',
        displayProperty: 'name',
    },
];

export const BASE_CONFIG: {} = {
    tooltip: {
        padding: -10,
        distance: 25,
        outside: true,
        style: {
            zIndex: 10000,
            width: 'auto',
        },
        useHTML: true,
        borderWidth: -10,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        borderRadius: 'var(--border-radius_xs)',
        className: 'graphs-RoundChart_tooltip',
        formatter: null,
    },
    series: [
        {
            id: 'RoundChart_ID',
            name: 'RoundChart',
            innerSize: '70%',
            data: [
                {
                    y: 141,
                    colorIndex: 'base-1',
                    name: '5% постоянным',
                    id: '0',
                    label: undefined,
                    dataLabels: {
                        enabled: false,
                    },
                },
                {
                    y: 213,
                    colorIndex: 'base-2',
                    name: '10% VIP',
                    id: '1',
                    label: undefined,
                    dataLabels: {
                        enabled: false,
                    },
                },
                {
                    y: 96,
                    colorIndex: 'base-3',
                    name: '20% в день',
                    id: '2',
                    label: undefined,
                    dataLabels: {
                        enabled: false,
                    },
                },
                {
                    y: 120,
                    colorIndex: 'base-4',
                    name: 'Новогодний сюрприз',
                    id: '3',
                    label: undefined,
                    dataLabels: {
                        enabled: false,
                    },
                },
                {
                    y: 200,
                    colorIndex: 'base-5',
                    name: 'БП для карт',
                    id: '4',
                    label: undefined,
                    dataLabels: {
                        enabled: false,
                    },
                },
            ],
        },
    ],
    chart: {
        type: 'pie',
        height: '100%',
        spacingTop: -10,
        spacingLeft: -10,
        spacingRight: -10,
        spacingBottom: -10,
    },
    title: {
        text: '',
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            animation: {
                duration: true,
            },
            states: {
                hover: {
                    enabled: true,
                    halo: null,
                },
                inactive: {
                    enabled: true,
                },
            },
        },
        pie: {
            dataLabels: {
                enabled: false,
            },
        },
    },
};
