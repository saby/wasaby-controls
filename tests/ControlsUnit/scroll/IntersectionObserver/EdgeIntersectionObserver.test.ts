import EdgeIntersectionObserver from 'Controls/_scroll/IntersectionObserver/EdgeIntersectionObserver';

describe('Controls/scroll:EdgeIntersectionObserverContainer', () => {
    let component;
    beforeEach(() => {
        component = {
            getInstanceId: () => {
                return 'instId';
            },
            _notify: jest.fn(),
        };
    });
    describe('constructor', () => {
        it('should initialize observers', () => {
            const observer = new EdgeIntersectionObserver(
                component,
                jest.fn(),
                'topTrigger',
                'bottomTrigger'
            );

            expect(component._notify).toHaveBeenCalledTimes(2);
            component._notify.mock.calls.forEach((call) => {
                expect(call).toEqual(
                    expect.arrayContaining(['intersectionObserverRegister'])
                );
            });
        });
    });

    describe('_observeHandler', () => {
        [
            {
                entry: {
                    target: 'topTrigger',
                    isIntersecting: true,
                },
                result: 'topIn',
            },
            {
                entry: {
                    target: 'topTrigger',
                    isIntersecting: false,
                },
                result: 'topOut',
            },
            {
                entry: {
                    target: 'bottomTrigger',
                    isIntersecting: true,
                },
                result: 'bottomIn',
            },
            {
                entry: {
                    target: 'bottomTrigger',
                    isIntersecting: false,
                },
                result: 'bottomOut',
            },
        ].forEach((test) => {
            it(`should generate "${test.result}" event`, () => {
                const observer = new EdgeIntersectionObserver(
                    component,
                    jest.fn(),
                    'topTrigger',
                    'bottomTrigger'
                );

                jest.spyOn(observer, '_handler')
                    .mockClear()
                    .mockImplementation();
                observer._observeHandler({ nativeEntry: test.entry });
                expect(observer._handler).toHaveBeenCalledWith(test.result);
                jest.restoreAllMocks();
            });
        });
    });

    describe('destroy', () => {
        it('should destroy all objects', () => {
            const observer = new EdgeIntersectionObserver(
                component,
                jest.fn(),
                'topTrigger',
                'bottomTrigger'
            );

            observer.destroy();

            expect(component._notify).toHaveBeenCalledWith(
                'intersectionObserverUnregister',
                expect.anything(),
                expect.anything()
            );
            expect(observer._component).toBeNull();
            expect(observer._topTriggerElement).toBeNull();
            expect(observer._bottomTriggerElement).toBeNull();
            expect(observer._handler).toBeNull();
        });
    });
});
