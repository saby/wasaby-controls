import { CalmTimer } from 'Controls/popup';

describe('Controls/Popup/fastOpenUtils/FastOpen', () => {
    describe('CalmTimer', () => {
        it('CalmTimer: resetTimeOut', () => {
            const calmTimer = new CalmTimer();
            calmTimer._openId = 300;
            expect(calmTimer._openId).toEqual(300);
            calmTimer.stop();
            expect(calmTimer._openId).toEqual(null);
        });
    });
});
