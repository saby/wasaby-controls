import { parseCookieValue } from 'Controls-DataEnv/newLists/_listDebug/debugger/utils/parseCookieValue';

const TO_DEFAULT: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        '',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'dasdadasdaasd',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'adfasdfasd|sdfsdfasdfs',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=sdadad',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=sdadad|style=asdasd',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],

    // =========

    [
        'slice=',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],

    // =======
    [
        'style=Dev',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=aadsf',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=lo',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    // =======
];

const ONLY_MODE_DEV: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        'mode=Dev',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=dEv',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=DEV',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=D',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'mode=d',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
];

const ONLY_STYLE_SHORT: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        'style=s',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=S',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=Short',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=ShOrt',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'style=SHORT',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'short',
            },
        },
    ],
];

const ONLY_STYLE_LONG: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        'style=l',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        'style=L',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        'style=Long',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        'style=lOnG',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        'style=LONG',
        {
            debugMode: 'Dev',
            names: [],
            outputConfig: {
                style: 'long',
            },
        },
    ],
];

const ONLY_SLICES: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        'slice=slice1',
        {
            debugMode: 'Dev',
            names: ['slice1'],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'slice=slice1, slice2',
        {
            debugMode: 'Dev',
            names: ['slice1', 'slice2'],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'slice=slice1,slice2',
        {
            debugMode: 'Dev',
            names: ['slice1', 'slice2'],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'slice=slice1, slice1',
        {
            debugMode: 'Dev',
            names: ['slice1'],
            outputConfig: {
                style: 'short',
            },
        },
    ],
    [
        'slice=,,asdsad',
        {
            debugMode: 'Dev',
            names: ['asdsad'],
            outputConfig: {
                style: 'short',
            },
        },
    ],
];

const COMBINATIONS: [string, ReturnType<typeof parseCookieValue>][] = [
    [
        'slice=slice1|mode=DevMin|style=Long',
        {
            debugMode: 'DevMin',
            names: ['slice1'],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        '|mode=DevMax|slice=slice2|style=short||style=Long',
        {
            debugMode: 'DevMax',
            names: ['slice2'],
            outputConfig: {
                style: 'long',
            },
        },
    ],
    [
        '|mode=DevMax|style=short||style=Long|slice=slice2|',
        {
            debugMode: 'DevMax',
            names: ['slice2'],
            outputConfig: {
                style: 'long',
            },
        },
    ],
];

describe('Controls-DataEnv/newLists/_listDebug/debugger/utils/parseCookieValue', () => {
    [
        ...TO_DEFAULT,
        ...ONLY_MODE_DEV,
        ...ONLY_STYLE_SHORT,
        ...ONLY_STYLE_LONG,
        ...ONLY_SLICES,
        ...COMBINATIONS,
    ].forEach(([cookie, expected], index) => {
        it(`Разбираем cookie ${index}: ${cookie}`, () => {
            const result = parseCookieValue(cookie);

            expect(result.debugMode).toBe(expected.debugMode);
            expect(result.outputConfig.style).toBe(expected.outputConfig.style);
            expect(result.names).toEqual(expected.names);
        });
    });
});
