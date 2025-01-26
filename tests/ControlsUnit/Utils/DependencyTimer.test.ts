import { DependencyTimer } from 'Controls/popup';

describe('Controls/Utils/DependencyTimer', (): void => {
    const now = new Date().getTime();

    it('callback should called', (): void => {
        jest.useFakeTimers().setSystemTime(now);

        const callbackFunction = jest.fn();
        const dependencyTimer = new DependencyTimer();

        dependencyTimer.start(callbackFunction);
        jest.advanceTimersByTime(100);
        expect(callbackFunction).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    it('timer should stop', (): void => {
        jest.useFakeTimers().setSystemTime(now);

        const callbackFunction = jest.fn();
        const dependencyTimer = new DependencyTimer();

        dependencyTimer.start(callbackFunction);
        jest.advanceTimersByTime(79);
        dependencyTimer.stop();
        jest.advanceTimersByTime(10);
        expect(callbackFunction).not.toHaveBeenCalled();

        jest.useRealTimers();
    });
});
