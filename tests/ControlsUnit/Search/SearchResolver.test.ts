import { SearchResolver } from 'Controls/search';
import { ISearchResolverOptions } from 'Controls/_search/SearchResolver';

const defaultOptions = {
    searchCallback: () => {
        return null;
    },
    searchResetCallback: () => {
        return null;
    },
};

const initSearchDelay = (options?: Partial<ISearchResolverOptions>) => {
    const searchCallback = jest.fn();
    const searchResolver = new SearchResolver({
        ...defaultOptions,
        searchCallback,
        ...options,
    });
    return {
        searchResolver,
        searchCallback,
    };
};

describe('Controls/search:SearchDelay', () => {
    const now = new Date().getTime();

    describe('searchDelay', () => {
        it('should callback when delay is undefined', () => {
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
            });

            searchResolver.resolve('test');
            expect(searchCallback).toHaveBeenCalled();
        });

        it('should callback when delay is 0', () => {
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 0,
            });

            searchResolver.resolve('test');
            expect(searchCallback).toHaveBeenCalled();
        });

        it('should callback after delay', () => {
            jest.useFakeTimers().setSystemTime(now);

            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 1000,
            });

            searchResolver.resolve('test');
            jest.advanceTimersByTime(1001);
            expect(searchCallback).toHaveBeenCalled();

            jest.useRealTimers();
        });
    });

    describe('searchStarted', () => {
        it("shouldn't resolve callback if search isn't started", () => {
            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 1000,
                searchResetCallback,
            });
            searchResolver.resolve('');

            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).not.toHaveBeenCalled();
        });

        it('searchStarted = false when length is > 0', () => {
            jest.useFakeTimers().setSystemTime(now);

            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 1000,
                searchResetCallback,
            });
            searchResolver.resolve('te');

            jest.advanceTimersByTime(1001);

            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).not.toHaveBeenCalled();
            expect(searchResolver._searchStarted).toBe(false);

            jest.useRealTimers();
        });

        it('searchStarted = true when searchDelay = 0, length > minLength', () => {
            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 0,
                searchResetCallback,
            });
            searchResolver.resolve('test');

            expect(searchCallback).toHaveBeenCalled();
            expect(searchResetCallback).not.toHaveBeenCalled();
            expect(searchResolver._searchStarted).toBe(true);
        });
    });

    describe('minValueLength', () => {
        it('should resetCallback when value is empty', () => {
            jest.useFakeTimers().setSystemTime(now);

            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 1000,
                searchResetCallback,
            });
            searchResolver._searchStarted = true;
            searchResolver.resolve('');

            jest.advanceTimersByTime(1001);

            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).toHaveBeenCalled();

            jest.useRealTimers();
        });

        it('should resetCallback when value is null', () => {
            jest.useFakeTimers().setSystemTime(now);

            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 3,
                searchDelay: 1000,
                searchResetCallback,
            });

            searchResolver._searchStarted = true;
            searchResolver.resolve(null);
            jest.advanceTimersByTime(1001);

            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).toHaveBeenCalled();

            jest.useRealTimers();
        });

        it("shouldn't callback when minSearchValueLength is undefined", () => {
            jest.useFakeTimers().setSystemTime(now);

            const { searchResolver, searchCallback } = initSearchDelay({
                searchDelay: 1000,
            });

            searchResolver.resolve('test');
            jest.advanceTimersByTime(1001);
            expect(searchCallback).not.toHaveBeenCalled();

            jest.useRealTimers();
        });

        it("shouldn't callback when minSearchValueLength is null and valueLength is 0", () => {
            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                searchDelay: 1000,
                minSearchLength: null,
                searchResetCallback,
            });

            searchResolver._searchStarted = true;
            searchResolver.resolve('');

            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).toHaveBeenCalled();
        });

        it("shouldn't callback when minSearchValueLength is null", () => {
            jest.useFakeTimers().setSystemTime(now);

            const searchResetCallback = jest.fn();
            const { searchResolver, searchCallback } = initSearchDelay({
                searchDelay: 1000,
                minSearchLength: null,
                searchResetCallback,
            });

            searchResolver.resolve('test');

            jest.advanceTimersByTime(1001);
            expect(searchCallback).not.toHaveBeenCalled();
            expect(searchResetCallback).not.toHaveBeenCalled();

            jest.useRealTimers();
        });

        it('should callback when minSearchValueLength is 0', () => {
            jest.useFakeTimers().setSystemTime(now);

            const { searchResolver, searchCallback } = initSearchDelay({
                minSearchLength: 0,
                searchDelay: 1000,
            });

            searchResolver.resolve('t');
            jest.advanceTimersByTime(1001);
            expect(searchCallback).toHaveBeenCalled();

            jest.useRealTimers();
        });
    });
});
