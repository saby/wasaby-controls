import Composer from 'Controls/_display/itemsStrategy/Composer';

describe('Controls/_display/itemsStrategy/Composer', () => {
    interface IStrategy {
        source: any;
    }

    function getStrategy<T = any>(): T {
        return function (options: object): void {
            Object.assign(this, options || {});
        } as any as T;
    }

    describe('.append()', () => {
        it('should append a strategy to the empty composer', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            composer.append(Strategy);
            expect(composer.getResult()).toBeInstanceOf(Strategy);
        });

        it('should append a strategy to the end', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const composer = new Composer();

            composer.append(StrategyA).append(StrategyB);

            expect(composer.getResult()).toBeInstanceOf(StrategyB);
            expect(composer.getInstance<IStrategy>(StrategyA).source).not.toBeDefined();
            expect(composer.getInstance<IStrategy>(StrategyB).source).toBeInstanceOf(StrategyA);
        });

        it('should append a strategy after given', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const StrategyC = getStrategy();
            const composer = new Composer();

            composer.append(StrategyA).append(StrategyB).append(StrategyC, {}, StrategyA);

            expect(composer.getResult()).toBeInstanceOf(StrategyB);
            expect(composer.getInstance<IStrategy>(StrategyA).source).not.toBeDefined();
            expect(composer.getInstance<IStrategy>(StrategyC).source).toBeInstanceOf(StrategyA);
            expect(composer.getInstance<IStrategy>(StrategyB).source).toBeInstanceOf(StrategyC);
        });
    });

    describe('.prepend()', () => {
        it('should prepend a strategy to the empty composer', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            composer.prepend(Strategy);
            expect(composer.getResult()).toBeInstanceOf(Strategy);
        });

        it('should prepend a strategy to the begin', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const composer = new Composer();

            composer.prepend(StrategyA).prepend(StrategyB);

            expect(composer.getResult()).toBeInstanceOf(StrategyA);
            expect(composer.getInstance<IStrategy>(StrategyB).source).not.toBeDefined();
            expect(composer.getInstance<IStrategy>(StrategyA).source).toBeInstanceOf(StrategyB);
        });

        it('should prepend a strategy before given', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const StrategyC = getStrategy();
            const composer = new Composer();

            composer.prepend(StrategyA).prepend(StrategyB);

            const instanceB = composer.getInstance(StrategyB);

            composer.prepend(StrategyC, {}, StrategyA);

            expect(composer.getResult()).toBeInstanceOf(StrategyA);
            expect(composer.getInstance<IStrategy>(StrategyB).source).not.toBeDefined();
            expect(composer.getInstance<IStrategy>(StrategyB)).toBe(instanceB);
            expect(composer.getInstance<IStrategy>(StrategyC).source).toBeInstanceOf(StrategyB);
            expect(composer.getInstance<IStrategy>(StrategyA).source).toBeInstanceOf(StrategyC);
        });
    });

    describe('.remove()', () => {
        it('should return undefined for empty composer', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            expect(composer.remove(Strategy)).not.toBeDefined();
            expect(composer.getResult()).toBeNull();
        });

        it('should return removed instance', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const StrategyC = getStrategy();
            const composer = new Composer();

            composer.append(StrategyA).append(StrategyB).append(StrategyC);

            expect(composer.remove(StrategyB)).toBeInstanceOf(StrategyB);
            expect(composer.getResult()).toBeInstanceOf(StrategyC);
            expect(composer.getInstance<IStrategy>(StrategyA).source).not.toBeDefined();
            expect(composer.getInstance(StrategyB)).not.toBeDefined();
            expect(composer.getInstance<IStrategy>(StrategyC).source).toBeInstanceOf(StrategyA);
        });

        it('should affect result', () => {
            const StrategyA = getStrategy();
            const StrategyB = getStrategy();
            const composer = new Composer();

            composer.append(StrategyA).append(StrategyB);

            expect(composer.remove(StrategyB)).toBeInstanceOf(StrategyB);
            expect(composer.getResult()).toBeInstanceOf(StrategyA);
        });
    });

    describe('.reset()', () => {
        it('should reset result', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            composer.append(Strategy).reset();

            expect(composer.getResult()).toBeNull();
        });
    });

    describe('.getInstance()', () => {
        it('should return an instance', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            composer.append(Strategy);
            expect(composer.getInstance(Strategy)).toBeInstanceOf(Strategy);
        });

        it('should return undefined if strategy not composed', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            expect(composer.getInstance(Strategy)).not.toBeDefined();
        });
    });

    describe('.getResult()', () => {
        it('should return null by default', () => {
            const composer = new Composer();
            expect(composer.getResult()).toBeNull();
        });

        it('should return instance of given stratgey', () => {
            const Strategy = getStrategy();
            const composer = new Composer();

            composer.append(Strategy);
            expect(composer.getResult()).toBeInstanceOf(Strategy);
        });
    });
});
