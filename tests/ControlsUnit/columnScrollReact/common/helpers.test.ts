import type * as React from 'react';

import {
    getScrollableWidth,
    getScrollableViewPortWidth,
    getMaxScrollPosition,
    getPrevPagePosition,
    getNextPagePosition,
    getLimitedPosition,
    getTransformCSSRule,
    getTransformCSSRuleReact,
} from 'Controls/_columnScrollReact/common/helpers';

import { IColumnScrollWidths } from 'Controls/_columnScrollReact/common/interfaces';

type TPositionsAndWidthsTestCases = {
    widths: IColumnScrollWidths;
    currentPositions: number[];
    unlimitedPositions: number[];
    expected: {
        getScrollableWidth: number;
        getScrollableViewPortWidth: number;
        getMaxScrollPosition: number;
        getPrevPagePosition: number[];
        getNextPagePosition: number[];
        getLimitedPosition: number[];
        getTransformCSSRule: string[];
        getTransformCSSRuleReact: React.CSSProperties[];
    };
}[];

const POSITION_AND_WIDTHS_TEST_CASES: TPositionsAndWidthsTestCases = [
    {
        // TEST CASE #0
        widths: {
            contentWidth: 1230,
            startFixedWidth: 250,
            endFixedWidth: 0,
            viewPortWidth: 610,
        },
        currentPositions: [0, 110, 300, 610, 620],
        unlimitedPositions: [-100, 10, 620, 650],
        expected: {
            getScrollableWidth: 980,
            getScrollableViewPortWidth: 360,
            getMaxScrollPosition: 620,
            getPrevPagePosition: [0, 0, 0, 286, 296],
            getNextPagePosition: [324, 434, 620, 620, 620],
            getLimitedPosition: [0, 10, 620, 620],
            getTransformCSSRule: [
                'transform:translate3d(0px,0,0);',
                'transform:translate3d(110px,0,0);',
                'transform:translate3d(300px,0,0);',
                'transform:translate3d(610px,0,0);',
                'transform:translate3d(620px,0,0);',
            ],
            getTransformCSSRuleReact: [
                { transform: 'translate3d(0px,0,0)' },
                { transform: 'translate3d(110px,0,0)' },
                { transform: 'translate3d(300px,0,0)' },
                { transform: 'translate3d(610px,0,0)' },
                { transform: 'translate3d(620px,0,0)' },
            ],
        },
    },
    {
        // TEST CASE #1
        widths: {
            contentWidth: 500,
            startFixedWidth: 250,
            endFixedWidth: 0,
            viewPortWidth: 600,
        },
        currentPositions: [0, 110, 300, 610, 620],
        unlimitedPositions: [-10, 110, 650],
        expected: {
            getScrollableWidth: 250,
            getScrollableViewPortWidth: 250,
            getMaxScrollPosition: 0,
            getPrevPagePosition: [0, 0, 0, 0, 0],
            getNextPagePosition: [0, 0, 0, 0, 0],
            getLimitedPosition: [0, 0, 0],
            getTransformCSSRule: [
                'transform:translate3d(0px,0,0);',
                'transform:translate3d(110px,0,0);',
                'transform:translate3d(300px,0,0);',
                'transform:translate3d(610px,0,0);',
                'transform:translate3d(620px,0,0);',
            ],
            getTransformCSSRuleReact: [
                { transform: 'translate3d(0px,0,0)' },
                { transform: 'translate3d(110px,0,0)' },
                { transform: 'translate3d(300px,0,0)' },
                { transform: 'translate3d(610px,0,0)' },
                { transform: 'translate3d(620px,0,0)' },
            ],
        },
    },
    {
        // TEST CASE #2
        widths: {
            contentWidth: 1500,
            startFixedWidth: 310,
            endFixedWidth: 0,
            viewPortWidth: 600,
        },
        currentPositions: [0, 110, 300, 610, 620, 750, 900],
        unlimitedPositions: [-100, 0, 110, 900, 1000],
        expected: {
            getScrollableWidth: 1190,
            getScrollableViewPortWidth: 290,
            getMaxScrollPosition: 900,
            getPrevPagePosition: [0, 0, 39, 349, 359, 489, 639],
            getNextPagePosition: [261, 371, 561, 871, 881, 900, 900],
            getLimitedPosition: [0, 0, 110, 900, 900],
            getTransformCSSRule: [
                'transform:translate3d(0px,0,0);',
                'transform:translate3d(110px,0,0);',
                'transform:translate3d(300px,0,0);',
                'transform:translate3d(610px,0,0);',
                'transform:translate3d(620px,0,0);',
                'transform:translate3d(750px,0,0);',
                'transform:translate3d(900px,0,0);',
            ],
            getTransformCSSRuleReact: [
                { transform: 'translate3d(0px,0,0)' },
                { transform: 'translate3d(110px,0,0)' },
                { transform: 'translate3d(300px,0,0)' },
                { transform: 'translate3d(610px,0,0)' },
                { transform: 'translate3d(620px,0,0)' },
                { transform: 'translate3d(750px,0,0)' },
                { transform: 'translate3d(900px,0,0)' },
            ],
        },
    },
];

describe('ControlsUnit/columnScrollReact/common/helpers', () => {
    describe('УТИЛИТЫ РАЗМЕРОВ.', () => {
        describe('getScrollableWidth.', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, index) => {
                it(`#${index}`, () => {
                    expect(getScrollableWidth(testCase.widths)).toEqual(
                        testCase.expected.getScrollableWidth
                    );
                });
            });
        });

        describe('getScrollableViewPortWidth.', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, index) => {
                it(`#${index}`, () => {
                    expect(getScrollableViewPortWidth(testCase.widths)).toEqual(
                        testCase.expected.getScrollableViewPortWidth
                    );
                });
            });
        });
    });

    describe('УТИЛИТЫ ПОЗИЦИИ СКРОЛА.', () => {
        describe('getMaxScrollPosition', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, index) => {
                it(`#${index}`, () => {
                    expect(getMaxScrollPosition(testCase.widths)).toEqual(
                        testCase.expected.getMaxScrollPosition
                    );
                });
            });
        });

        describe('getPrevPagePosition', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, testCaseIndex) => {
                describe(`testCase #${testCaseIndex}`, () => {
                    testCase.currentPositions.forEach((position, positionIndex) => {
                        it(`position=${position}`, () => {
                            expect(getPrevPagePosition(position, testCase.widths)).toEqual(
                                testCase.expected.getPrevPagePosition[positionIndex]
                            );
                        });
                    });
                });
            });
        });

        describe('getNextPagePosition', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, testCaseIndex) => {
                describe(`testCase #${testCaseIndex}`, () => {
                    testCase.currentPositions.forEach((position, positionIndex) => {
                        it(`position=${position}`, () => {
                            expect(getNextPagePosition(position, testCase.widths)).toEqual(
                                testCase.expected.getNextPagePosition[positionIndex]
                            );
                        });
                    });
                });
            });
        });

        describe('getLimitedPosition', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, testCaseIndex) => {
                describe(`testCase #${testCaseIndex}`, () => {
                    testCase.unlimitedPositions.forEach((position, positionIndex) => {
                        it(`position=${position}`, () => {
                            expect(getLimitedPosition(position, testCase.widths)).toEqual(
                                testCase.expected.getLimitedPosition[positionIndex]
                            );
                        });
                    });
                });
            });
        });
    });

    describe('УТИЛИТЫ CSS ТРАНСФОРМАЦИИ.', () => {
        describe('getTransformCSSRule.', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, testCaseIndex) => {
                describe(`testCase #${testCaseIndex}`, () => {
                    testCase.currentPositions.forEach((position, positionIndex) => {
                        it(`position=${position}`, () => {
                            expect(getTransformCSSRule(position)).toEqual(
                                testCase.expected.getTransformCSSRule[positionIndex]
                            );
                        });
                    });
                });
            });
        });

        describe('getTransformCSSRuleReact.', () => {
            POSITION_AND_WIDTHS_TEST_CASES.forEach((testCase, testCaseIndex) => {
                describe(`testCase #${testCaseIndex}`, () => {
                    testCase.currentPositions.forEach((position, positionIndex) => {
                        it(`position=${position}`, () => {
                            expect(getTransformCSSRuleReact(position)).toEqual(
                                testCase.expected.getTransformCSSRuleReact[positionIndex]
                            );
                        });
                    });
                });
            });
        });
    });
});
