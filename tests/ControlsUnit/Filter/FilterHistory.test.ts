import { FilterHistory } from 'Controls/filter';
import { constants } from 'Env/Env';
import { FilterSource } from 'Controls/history';

describe('getFilterHistorySource', () => {
    const historyId = 'TEST_HISTORY_ID_UTILS';

    it('getFilterHistorySource', function () {
        const isServerSide = constants.isServerSide;
        constants.isServerSide = false;
        const hSource = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource instanceof FilterSource).toBe(true);
        const hSource2 = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource === hSource2).toBe(true);
        constants.isServerSide = isServerSide;
    });

    it('getFilterHistorySource isServerSide', function () {
        const hSource = FilterHistory.getFilterHistorySource({
            historyId,
        });
        const hSource2 = FilterHistory.getFilterHistorySource({
            historyId,
        });
        expect(hSource === hSource2).toBe(true);
    });
});
