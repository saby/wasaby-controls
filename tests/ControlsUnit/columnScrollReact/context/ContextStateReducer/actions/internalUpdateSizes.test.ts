import {
    internalUpdateSizes,
    TInternalUpdateSizesState,
    TInternalUpdateSizesAction,
} from 'Controls/_columnScrollReact/context/ContextStateReducer/actions/internalUpdateSizes';
import { EdgeState } from 'Controls/_columnScrollReact/common/types';
import { IColumnScrollWidths } from 'Controls/_columnScrollReact/common/interfaces';

type TSizesForInternalUpdate = Pick<
    TInternalUpdateSizesAction,
    'startFixedWidth' | 'endFixedWidth' | 'scrollableWidth' | 'viewPortWidth'
>;

const getState = (partialState: Partial<TInternalUpdateSizesState>): TInternalUpdateSizesState => ({
    contentWidth: 0,
    viewPortWidth: 0,
    startFixedWidth: 0,
    endFixedWidth: 0,
    position: 0,
    columnScrollStartPosition: undefined,
    isNeedByWidth: false,
    leftEdgeState: EdgeState.Visible,
    rightEdgeState: EdgeState.Visible,
    leftTriggerEdgeState: EdgeState.Visible,
    rightTriggerEdgeState: EdgeState.Visible,
    previousAppliedPosition: 0,
    ...partialState,
});

const getAction = (widths: TSizesForInternalUpdate): TInternalUpdateSizesAction => ({
    type: 'internalUpdateSizes',
    ...widths,
});

describe('ControlsUnit/columnScrollReact/context/ContextStateReducer/actions/internalUpdateSizes', () => {
    describe('Only sizes', () => {
        const getWidthsFromState = (state: TInternalUpdateSizesState): IColumnScrollWidths => ({
            contentWidth: state.contentWidth,
            startFixedWidth: state.startFixedWidth,
            endFixedWidth: state.endFixedWidth,
            viewPortWidth: state.viewPortWidth,
        });

        const testCases: Record<
            string,
            {
                from: IColumnScrollWidths;
                to: TSizesForInternalUpdate;
                expected: IColumnScrollWidths;
            }
        > = {
            'Первый расчет. Нет фиксированной части.': {
                from: {
                    contentWidth: 0,
                    viewPortWidth: 0,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
            },
            'Первый расчет. Фиксированная часть справа.': {
                from: {
                    contentWidth: 0,
                    viewPortWidth: 0,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 800,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 200,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 200,
                },
            },
            'Первый расчет. Фиксированная часть слева.': {
                from: {
                    contentWidth: 0,
                    viewPortWidth: 0,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 900,
                    viewPortWidth: 500,
                    startFixedWidth: 100,
                    endFixedWidth: 0,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 100,
                    endFixedWidth: 0,
                },
            },
            'Первый расчет. Фиксированные части с двух сторон.': {
                from: {
                    contentWidth: 0,
                    viewPortWidth: 0,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 750,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
            },

            'Перерасчет. Не было фиксации, появилась только правая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 850,
                    viewPortWidth: 400,
                    startFixedWidth: 0,
                    endFixedWidth: 150,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 0,
                    endFixedWidth: 150,
                },
            },
            'Перерасчет. Не было фиксации, появилась только левая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 800,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 0,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 0,
                },
            },
            'Перерасчет. Не было фиксации, появились обе фиксированные части.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 0,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 750,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 400,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
            },

            'Перерасчет. Была фиксация справа, изменилась только правая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 300,
                },
                to: {
                    scrollableWidth: 750,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 250,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 250,
                },
            },
            'Перерасчет. Была фиксация справа, изменилась только левая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 300,
                },
                to: {
                    scrollableWidth: 500,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 300,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 300,
                },
            },
            'Перерасчет. Была фиксация справа, изменились обе фиксированные части.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 0,
                    endFixedWidth: 300,
                },
                to: {
                    scrollableWidth: 650,
                    viewPortWidth: 500,
                    startFixedWidth: 100,
                    endFixedWidth: 250,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 100,
                    endFixedWidth: 250,
                },
            },

            'Перерасчет. Была фиксация слева, изменилась только правая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 150,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 800,
                    viewPortWidth: 500,
                    startFixedWidth: 150,
                    endFixedWidth: 50,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 150,
                    endFixedWidth: 50,
                },
            },
            'Перерасчет. Была фиксация слева, изменилась только левая фиксированная часть.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 150,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 800,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 0,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 0,
                },
            },
            'Перерасчет. Была фиксация слева, изменились обе фиксированные части.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 150,
                    endFixedWidth: 0,
                },
                to: {
                    scrollableWidth: 750,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
            },

            'Перерасчет. Была фиксация с двух сторон, изменилась только правая фиксированная часть.':
                {
                    from: {
                        contentWidth: 1000,
                        viewPortWidth: 500,
                        startFixedWidth: 300,
                        endFixedWidth: 100,
                    },
                    to: {
                        scrollableWidth: 650,
                        viewPortWidth: 500,
                        startFixedWidth: 300,
                        endFixedWidth: 50,
                    },
                    expected: {
                        contentWidth: 1000,
                        viewPortWidth: 500,
                        startFixedWidth: 300,
                        endFixedWidth: 50,
                    },
                },
            'Перерасчет. Была фиксация с двух сторон, изменилась только левая фиксированная часть.':
                {
                    from: {
                        contentWidth: 1000,
                        viewPortWidth: 500,
                        startFixedWidth: 300,
                        endFixedWidth: 100,
                    },
                    to: {
                        scrollableWidth: 700,
                        viewPortWidth: 500,
                        startFixedWidth: 200,
                        endFixedWidth: 100,
                    },
                    expected: {
                        contentWidth: 1000,
                        viewPortWidth: 500,
                        startFixedWidth: 200,
                        endFixedWidth: 100,
                    },
                },
            'Перерасчет. Была фиксация с двух сторон, изменились обе фиксированные части.': {
                from: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 300,
                    endFixedWidth: 100,
                },
                to: {
                    scrollableWidth: 750,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
                expected: {
                    contentWidth: 1000,
                    viewPortWidth: 500,
                    startFixedWidth: 200,
                    endFixedWidth: 50,
                },
            },
        };

        Object.keys(testCases).forEach((testCaseName) => {
            it(testCaseName, () => {
                const testCase = testCases[testCaseName];

                const oldState = getState(testCase.from);
                const newState = internalUpdateSizes(oldState, getAction(testCase.to));
                const expectedState = getState(testCase.expected);

                expect(getWidthsFromState(newState)).toEqual(getWidthsFromState(expectedState));
            });
        });
    });
});
