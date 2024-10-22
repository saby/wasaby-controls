import { DOMUtil } from 'Controls/sizeUtils';

class ClassList extends Array {
    add: Function = Array.prototype.push;
}

describe('Controls/sizeUtils:DOMUtil', () => {
    describe('Calculating sizes of DOM elements', () => {
        let isNode;
        let createElementStub;
        let appendChildStub;
        let removeChildStub;
        let getComputedStyleStub;

        function restoreAll(): void {
            createElementStub.mockRestore();
            appendChildStub.mockRestore();
            removeChildStub.mockRestore();
            getComputedStyleStub.mockRestore();
        }

        before(() => {
            isNode = typeof document === 'undefined';
            if (isNode) {
                global.document = {
                    body: {
                        appendChild: jest.fn(),
                        removeChild: jest.fn(),
                    },
                    createElement: jest.fn(),
                };
                global.window = {
                    getComputedStyle: jest.fn(),
                };
            }
        });

        beforeEach(() => {
            createElementStub = jest
                .spyOn(document, 'createElement')
                .mockClear()
                .mockImplementation();
            const fakeChild = {
                style: {
                    position: 'static',
                    left: '0px',
                    top: '0px',
                },
                // @ts-ignore
                clientWidth: 123,
            };
            const fakeElement = {
                clientWidth: 321,
                innerHTML: '',
                style: {
                    position: 'static',
                    left: '0px',
                    top: '0px',
                },
                // @ts-ignore
                classList: new ClassList(),
                setAttribute: jest.fn(),
                getElementsByClassName: () => {
                    return [fakeChild, fakeChild];
                },
                appendChild: (child) => {
                    return jest.fn();
                },
                getBoundingClientRect: () => {
                    return {
                        width: 321,
                        height: 10,
                        top: 3,
                        right: 3,
                        bottom: 3,
                        left: 3,
                    };
                },
            };
            // @ts-ignore
            createElementStub.mockImplementation((...args) => {
                if (args[0] === 'div') {
                    return fakeElement;
                }
            });
            appendChildStub = jest
                .spyOn(document.body, 'appendChild')
                .mockClear()
                .mockImplementation();
            removeChildStub = jest
                .spyOn(document.body, 'removeChild')
                .mockClear()
                .mockImplementation();
            getComputedStyleStub = jest
                .spyOn(window, 'getComputedStyle')
                .mockClear()
                .mockImplementation();
            // @ts-ignore
            getComputedStyleStub.mockImplementation((...args) => {
                if (args[0] === fakeChild) {
                    return {
                        marginLeft: '2px',
                        marginRight: '2px',
                    };
                }
            });
        });

        after(() => {
            if (isNode) {
                global.document = undefined;
                global.window = undefined;
            }
        });

        // Метод должен правильно считать размеры элементов и отступы их родительского контейнера
        it('getElementsWidth() should return array with sizes considering margins', () => {
            const result = DOMUtil.getElementsWidth(
                ['<div class="items-class">1</div>', '<div class="items-class">2</div>'],
                'items-class',
                true
            );
            restoreAll();
            expect(result).toEqual([127, 127]);
        });

        it('getElementsWidth() should return array with sizes not considering margins', () => {
            const result = DOMUtil.getElementsWidth(
                ['<div class="items-class">1</div>', '<div class="items-class">2</div>'],
                'items-class',
                false
            );
            restoreAll();
            expect(result).toEqual([123, 123]);
        });

        it('getWidthForCssClass() should return size not considering margins', () => {
            const result = DOMUtil.getWidthForCssClass('block-class');
            restoreAll();
            expect(result).toEqual(321);
        });
    });
});
