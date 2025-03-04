import { Quantum } from 'Controls-Lists/timelineGrid';
import * as privateFactoryUtils from 'Controls-Lists/_timelineGrid/factory/utils';

describe('Controls-ListsUnit/TimelineGrid/factory/utils/private', () => {
    describe('getQuantsReplacementMap', () => {
        test('mapping by default', () => {
            const expectedMap = {
                [Quantum.Hour]: Quantum.Hour,
            };
            const resultMap = privateFactoryUtils.getQuantsReplacementMap([
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
                },
            ]);
            expect(resultMap).toEqual(expectedMap);
        });
        test('mapping quantum marked as default', () => {
            const expectedMap = {
                [Quantum.Hour]: Quantum.HalfHour,
            };
            const resultMap = privateFactoryUtils.getQuantsReplacementMap([
                {
                    name: Quantum.QuarterHour,
                },
                {
                    name: Quantum.HalfHour,
                    default: true,
                },
                {
                    name: Quantum.Hour,
                },
                {
                    name: Quantum.Day,
                },
            ]);
            expect(resultMap).toEqual(expectedMap);
        });
        test('skip hours', () => {
            const expectedMap = {
                [Quantum.Hour]: Quantum.HalfHour,
            };
            const resultMap = privateFactoryUtils.getQuantsReplacementMap([
                {
                    name: Quantum.HalfHour,
                },
                {
                    name: Quantum.Day,
                },
            ]);
            expect(resultMap).toEqual(expectedMap);
        });
    });
});
