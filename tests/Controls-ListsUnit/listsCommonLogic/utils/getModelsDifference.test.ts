import { helpers } from 'Controls/listsCommonLogic';
const { getModelsDifference } = helpers;

const map = (...args: [number, boolean | null | undefined][]) => new Map(args);

describe('Controls/listsCommonLogic:helpers.getModelsDifference', () => {
    describe('has no changes', () => {
        const emptyMap = new Map();
        const cases = [
            [map(), map()],
            [map([1, true]), map([1, true])],
            [map([1, false]), map([1, false])],
            [map([1, undefined]), map([1, undefined])],
            [map([1, null]), map([1, null])],
            [map([1, true], [2, false]), map([1, true], [2, false])],
            [map([1, false], [2, false]), map([1, false], [2, false])],
            [map([1, undefined], [2, false]), map([1, undefined], [2, false])],
            [map([1, null], [2, false]), map([1, null], [2, false])],
        ];
        cases.forEach(([m1, m2], i) => {
            it(`test case ${i + 1}`, () => {
                expect(getModelsDifference(m1, m2)).toEqual(emptyMap);
            });
        });
    });

    describe('has changes', () => {
        describe('same length', () => {
            it('test case 1', () => {
                expect(
                    getModelsDifference(map([1, true], [2, true]), map([1, false], [2, false]))
                ).toEqual(map([1, false], [2, false]));
            });

            it('test case 2', () => {
                expect(
                    getModelsDifference(map([1, true], [2, null]), map([1, false], [2, false]))
                ).toEqual(map([1, false], [2, false]));
            });

            it('test case 3', () => {
                expect(
                    getModelsDifference(map([1, null], [2, true]), map([1, false], [2, true]))
                ).toEqual(map([1, false]));
            });

            it('test case 4', () => {
                expect(
                    getModelsDifference(map([1, null], [2, true]), map([3, false], [4, true]))
                ).toEqual(map([1, false], [2, false], [3, false], [4, true]));
            });
        });

        describe('prev longer', () => {
            it('test case 1', () => {
                expect(getModelsDifference(map([1, true]), map())).toEqual(map([1, false]));
            });
            it('test case 2', () => {
                expect(getModelsDifference(map([1, null], [2, true]), map([1, false]))).toEqual(
                    map([1, false], [2, false])
                );
            });
            it('test case 3', () => {
                expect(getModelsDifference(map([1, null], [2, true]), map([3, false]))).toEqual(
                    map([1, false], [2, false], [3, false])
                );
            });
            it('test case 4', () => {
                expect(getModelsDifference(map([1, null], [2, true]), map([2, true]))).toEqual(
                    map([1, false])
                );
            });
            it('test case 5', () => {
                expect(getModelsDifference(map([3, null], [4, true]), map([2, true]))).toEqual(
                    map([2, true], [3, false], [4, false])
                );
            });
            it('test case 6', () => {
                expect(getModelsDifference(map([4, true]), map([1, false], [2, false]))).toEqual(
                    map([1, false], [2, false], [4, false])
                );
            });
            it('test case 7', () => {
                expect(getModelsDifference(map([4, true]), map([1, true], [2, true]))).toEqual(
                    map([1, true], [2, true], [4, false])
                );
            });
        });

        describe('next longer', () => {
            it('test case 1', () => {
                expect(getModelsDifference(map(), map([1, true]))).toEqual(map([1, true]));
            });
            it('test case 2', () => {
                expect(getModelsDifference(map([1, false]), map([1, null], [2, true]))).toEqual(
                    map([1, null], [2, true])
                );
            });
            it('test case 3', () => {
                expect(getModelsDifference(map([3, false]), map([1, null], [2, true]))).toEqual(
                    map([1, null], [2, true], [3, false])
                );
            });
            it('test case 4', () => {
                expect(getModelsDifference(map([2, true]), map([1, null], [2, true]))).toEqual(
                    map([1, null])
                );
            });
            it('test case 5', () => {
                expect(getModelsDifference(map([1, false], [2, false]), map([1, true]))).toEqual(
                    map([1, true], [2, false])
                );
            });
            it('test case 6', () => {
                expect(getModelsDifference(map([1, true], [2, true]), map([1, true]))).toEqual(
                    map([2, false])
                );
            });
            it('test case 7', () => {
                expect(getModelsDifference(map([2, true]), map([3, null], [4, true]))).toEqual(
                    map([2, false], [3, null], [4, true])
                );
            });
            it('test case 8', () => {
                expect(getModelsDifference(map([1, false], [2, false]), map([4, true]))).toEqual(
                    map([1, false], [2, false], [4, true])
                );
            });
            it('test case 9', () => {
                expect(getModelsDifference(map([1, true], [2, true]), map([4, true]))).toEqual(
                    map([1, false], [2, false], [4, true])
                );
            });
        });
    });
});
