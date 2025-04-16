import { DayRange, IQuantum, MonthRange, Quantum } from 'Controls-Lists/timelineGrid';
import * as privateUtils from 'Controls-Lists/_timelineGrid/utils';

describe('Controls-ListsUnit/TimelineGrid/utils/private', () => {
    describe('zoom', () => {
        let quants: IQuantum[];

        describe('increase', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.Hour,
                    },
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Month,
                            },
                            {
                                value: DayRange.Week,
                            },
                        ],
                    },
                    {
                        name: Quantum.Month,
                    },
                ];
            });

            test('1. Переход от года по месяцам к месяцу по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 0, 1, 0, 0, 0, 0),
                        end: new Date(2023, 11, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Month,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 31, 0, 0, 0, 0));
            });

            test('2. Переход от месяца по дням к неделе по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 1, 27, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 5, 0, 0, 0, 0));
            });

            test('3. Переход от недели по дням к дню по часам', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 1, 27, 0, 0, 0, 0),
                        end: new Date(2023, 2, 5, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });
        });

        describe('decrease', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.Hour,
                    },
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Month,
                            },
                            {
                                value: DayRange.Week,
                            },
                        ],
                    },
                    {
                        name: Quantum.Month,
                    },
                ];
            });

            test('4. Переход от дня по часам к неделе по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 59, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Hour,
                    scaleDirection: 'decrease',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 1, 27, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 5, 0, 0, 0, 0));
            });

            test('5. Переход от недели по дням к месяцу по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 1, 27, 0, 0, 0, 0),
                        end: new Date(2023, 2, 5, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'decrease',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 31, 0, 0, 0, 0));
            });

            test('6. Переход от месяца по дням к году по месяцам', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'decrease',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 0, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 11, 31, 0, 0, 0, 0));
            });
        });

        describe('skip week', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.Hour,
                    },
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Month,
                            },
                        ],
                    },
                    {
                        name: Quantum.Month,
                    },
                ];
            });

            test('7. Переход от месяца по дням к дню по часам', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });

            test('8. Переход от дня по часам к месяцу по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 59, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Hour,
                    scaleDirection: 'decrease',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 31, 0, 0, 0, 0));
            });
        });

        describe('Hours, HalfHours, QuarterHours', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.QuarterHour,
                    },
                    {
                        name: Quantum.HalfHour,
                    },
                    {
                        name: Quantum.Hour,
                    },
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Week,
                            },
                        ],
                    },
                ];
            });

            test('9. Переход от дня по часам к дню по полчаса', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Hour,
                    scaleDirection: 'increase',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.quantum).toEqual(Quantum.HalfHour);
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });

            test('10. Переход от дня по полчаса к дню по 15 минут', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.HalfHour,
                    scaleDirection: 'increase',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.quantum).toEqual(Quantum.QuarterHour);
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });

            test('11. Переход от дня по 15 минут к дню по полчаса', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.QuarterHour,
                    scaleDirection: 'decrease',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.quantum).toEqual(Quantum.HalfHour);
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });

            test('12. Переход от дня по полчаса к дню по часу', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.HalfHour,
                    scaleDirection: 'decrease',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.quantum).toEqual(Quantum.Hour);
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });

            test('13. Переход от дня по часу к неделе по дням', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 1, 23, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Hour,
                    scaleDirection: 'decrease',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 1, 27, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 5, 0, 0, 0, 0));
            });
        });

        describe('skip hours', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.HalfHour,
                    },
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Month,
                            },
                        ],
                    },
                ];
            });

            test('14. Переход от месяца по дням к дню по полчаса', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 2, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.quantum).toEqual(undefined);
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 1, 23, 0, 0, 0));
            });
        });

        describe('accessibility', () => {
            beforeEach(() => {
                quants = [
                    {
                        name: Quantum.Day,
                        scales: [
                            {
                                value: DayRange.Month,
                            },
                        ],
                    },
                    {
                        name: Quantum.Month, // Месяцы = режим год, режим полугодие, режим четверть
                        scales: [
                            {
                                value: MonthRange.Year, // режим год
                                accessibility: 'zoom',
                            },
                            {
                                value: MonthRange.HalfYear, // режим полгода
                                accessibility: 'zoom',
                            },
                            {
                                value: MonthRange.Quarter, // режим четверть
                                accessibility: 'zoom',
                            },
                        ],
                    },
                ];
            });

            test('15. Zoom with "zoom", Next range is Half Year', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 0, 1, 0, 0, 0, 0),
                        end: new Date(2023, 11, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Month,
                    scaleDirection: 'increase',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 0, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 5, 30, 0, 0, 0, 0));
            });

            test('16. Zoom with "header", Next range is Month', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 0, 1, 0, 0, 0, 0),
                        end: new Date(2023, 11, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Month,
                    scaleDirection: 'increase',
                    accessibility: 'header',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 2, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 2, 31, 0, 0, 0, 0));
            });

            test('17. Переход от 3 мес по месяцам к 6 мес по месяцам', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 0, 1, 0, 0, 0, 0),
                        end: new Date(2023, 2, 31, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'decrease',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 0, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 5, 30, 0, 0, 0, 0));
            });

            test('17. Переход от 6 мес по месяцам к году по месяцам', () => {
                const zoomResult = privateUtils.zoom({
                    currentRange: {
                        start: new Date(2023, 0, 1, 0, 0, 0, 0),
                        end: new Date(2023, 5, 30, 0, 0, 0, 0),
                    },
                    quantums: quants,
                    quantum: Quantum.Day,
                    scaleDirection: 'decrease',
                    accessibility: 'zoom',
                    targetDate: new Date(2023, 2, 1, 0, 0, 0, 0),
                });
                expect(zoomResult.range?.start).toEqual(new Date(2023, 0, 1, 0, 0, 0, 0));
                expect(zoomResult.range?.end).toEqual(new Date(2023, 11, 31, 0, 0, 0, 0));
            });
        });
    });
});
