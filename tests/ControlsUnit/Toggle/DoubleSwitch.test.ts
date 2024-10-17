import { DoubleSwitch } from 'Controls/toggle';

let SW;
let switcherClickedFlag;
describe('Controls/_toggle/DoubleSwitch', () => {
    afterEach(() => {
        if (SW) {
            SW.destroy();
        }
        SW = undefined;
        switcherClickedFlag = undefined;
    });
    describe('update captions (function _beforeUpdate)', () => {
        beforeEach(() => {
            SW = new DoubleSwitch({
                onCaption: 'capt1',
                offCaption: 'capt2',
            });
        });

        it('with one captions', () => {
            const temp = {
                onCaption: 'newcapt1',
            };
            try {
                SW._beforeUpdate(temp);
                expect(false).toBeTruthy();
            } catch (e) {
                expect(e.message === 'You must set offCaption and onCaption.').toBeTruthy();
            }
        });

        it('with two captions', () => {
            const temp = {
                onCaption: 'newcapt1',
                offCaption: 'newcapt2',
            };
            SW._beforeUpdate(temp);
            expect(true).toBeTruthy();
        });
    });

    describe('checked captions in constructor', () => {
        it('without captions', () => {
            try {
                SW = new DoubleSwitch({});
            } catch (e) {
                expect(e.message === 'You must set offCaption and onCaption.').toBeTruthy();
            }
        });

        it('with one caption', () => {
            try {
                SW = new DoubleSwitch({
                    onCaption: 'newcapt1',
                });
            } catch (e) {
                expect(e.message === 'You must set offCaption and onCaption.').toBeTruthy();
            }
        });

        it('with two captions', () => {
            SW = new DoubleSwitch({
                onCaption: 'capt1',
                offCaption: 'capt2',
            });
            expect(true).toBeTruthy();
        });
    });

    describe('click', () => {
        beforeEach(() => {
            SW = new DoubleSwitch({
                onCaption: 'capt1',
                offCaption: 'capt2',
            });
            switcherClickedFlag = false;
            // subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
            // (дефолтный метод для vdom компонент который стреляет событием).
            // он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
            // событие и оно полетит с корректными параметрами.
            SW._notify = (event) => {
                if (event === 'valueChanged') {
                    switcherClickedFlag = true;
                }
            };
        });
        describe('click to Switcher', () => {
            describe('click to toggle(function _clickToggleHandler)', () => {
                it('click', () => {
                    SW._clickToggleHandler();
                    expect(switcherClickedFlag).toBe(true);
                    expect(SW._toggleHoverState === false).toBe(true);
                });
            });

            describe('click to captions(function _clickTextHandler)', () => {
                it('click to double Switcher "On" caption and "On" value', () => {
                    const opt = {
                        onCaption: 'capt1',
                        offCaption: 'capt2',
                        value: true,
                    };
                    SW.saveOptions(opt);
                    SW._clickTextHandler(null, true);
                    expect(switcherClickedFlag === false).toBeTruthy();
                });

                it('click to double Switcher "On" caption and "Off" value', () => {
                    const opt = {
                        onCaption: 'capt1',
                        offCaption: 'capt2',
                        value: false,
                    };
                    SW.saveOptions(opt);
                    SW._clickTextHandler(null, true);
                    expect(switcherClickedFlag).toBeTruthy();
                });

                it('click to double Switcher "Off" caption and "On" value', () => {
                    const opt = {
                        onCaption: 'capt1',
                        offCaption: 'capt2',
                        value: true,
                    };
                    SW.saveOptions(opt);
                    SW._clickTextHandler(null, false);
                    expect(switcherClickedFlag).toBeTruthy();
                });

                it('click to double Switcher "Off" caption and "Off" value', () => {
                    const opt = {
                        onCaption: 'capt1',
                        offCaption: 'capt2',
                        value: false,
                    };
                    SW.saveOptions(opt);
                    SW._clickTextHandler(null, false);
                    expect(switcherClickedFlag === false).toBeTruthy();
                });
            });
        });
        describe('private function', () => {
            describe('checkCaptions', () => {
                it('checked with 0 captions', () => {
                    const opt = {};
                    SW.saveOptions(opt);
                    try {
                        SW._checkCaptions(SW._options);
                        expect(false).toBeTruthy();
                    } catch (e) {
                        expect(e.message === 'You must set offCaption and onCaption.').toBeTruthy();
                    }
                });

                it('checked with 1 captions', () => {
                    const opt = {
                        onCaption: 'capt1',
                    };
                    SW.saveOptions(opt);
                    try {
                        SW._checkCaptions(SW._options);
                        expect(false).toBeTruthy();
                    } catch (e) {
                        expect(e.message === 'You must set offCaption and onCaption.').toBeTruthy();
                    }
                });

                it('checked with 2 captions', () => {
                    const opt = {
                        onCaption: 'capt1',
                        offCaption: 'capt2',
                    };
                    SW.saveOptions(opt);
                    SW._checkCaptions(SW._options);
                    expect(true).toBeTruthy();
                });
            });
        });
        describe('state hover of toggle', () => {
            beforeEach(() => {
                SW = new DoubleSwitch({
                    onCaption: 'capt1',
                    offCaption: 'capt2',
                });
            });

            it('_toggleSwitchHoverState with selected caption', () => {
                SW._toggleSwitchHoverState(null, false);
                expect(SW._toggleHoverState === false).toBe(true);
            });

            it('_toggleSwitchHoverState with unselected caption', () => {
                SW._toggleSwitchHoverState(null, true);
                expect(SW._toggleHoverState === true).toBe(true);
            });
        });
    });
});
