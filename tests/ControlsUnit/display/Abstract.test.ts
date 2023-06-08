import {
    Abstract as Display,
    Collection,
    CollectionItem,
} from 'Controls/display';

import { List } from 'Types/collection';

describe('Controls/_display/Abstract', () => {
    describe('.getDefaultDisplay()', () => {
        it('should return a display', () => {
            const list = new List();

            expect(Display.getDefaultDisplay(list)).toBeInstanceOf(Display);
        });

        it('should return the special display for Array', () => {
            const options = { keyProperty: 'foo' };
            const display = Display.getDefaultDisplay<
                string,
                CollectionItem<string>,
                Collection<string>
            >([], options);
            expect(display).toBeInstanceOf(Collection);
            expect(display.getKeyProperty()).toEqual(options.keyProperty);
        });

        it('should return the special display for List', () => {
            const collection = new List();
            const display = Display.getDefaultDisplay(collection);
            expect(display).toBeInstanceOf(Collection);
        });

        it('should throw an error for not IEnumerable', () => {
            expect(() => {
                Display.getDefaultDisplay({} as any);
            }).toThrow();
            expect(() => {
                Display.getDefaultDisplay(null);
            }).toThrow();
            expect(() => {
                Display.getDefaultDisplay(undefined);
            }).toThrow();
        });

        it('should return various instances', () => {
            const list = new List();
            const displayA = Display.getDefaultDisplay(list);
            const displayB = Display.getDefaultDisplay(list);

            expect(displayA).not.toEqual(displayB);
        });

        it('should return same instances', () => {
            const list = new List();
            const displayA = Display.getDefaultDisplay(list, {}, true);
            const displayB = Display.getDefaultDisplay(list, {}, true);

            expect(displayA).toBe(displayB);
        });
    });

    describe('.releaseDefaultDisplay()', () => {
        it('should return true if the display has been retrieved as singleton', () => {
            const list = new List();
            const display = Display.getDefaultDisplay(list, {}, true);

            expect(Display.releaseDefaultDisplay(display)).toBe(true);
        });

        it('should return true if the display has been retrieved as not singleton', () => {
            const list = new List();
            const display = Display.getDefaultDisplay(list);

            expect(Display.releaseDefaultDisplay(display)).toBe(false);
        });

        it('should destroy the instance after last one was released', () => {
            const list = new List();
            const displayA = Display.getDefaultDisplay(list, {}, true);
            const displayB = Display.getDefaultDisplay(list, {}, true);

            Display.releaseDefaultDisplay(displayA);
            expect(displayA.destroyed).toBe(false);

            Display.releaseDefaultDisplay(displayB);
            expect(displayA.destroyed).toBe(true);
            expect(displayB.destroyed).toBe(true);
        });

        it('should force getDefaultDisplay return a new instance after last one was released', () => {
            const list = new List();
            const displayA = Display.getDefaultDisplay(list, {}, true);
            const displayB = Display.getDefaultDisplay(list, {}, true);

            Display.releaseDefaultDisplay(displayA);
            Display.releaseDefaultDisplay(displayB);

            const displayC = Display.getDefaultDisplay(list, {}, true);
            expect(displayC).not.toEqual(displayA);
            expect(displayC).not.toEqual(displayB);
        });
    });
});
