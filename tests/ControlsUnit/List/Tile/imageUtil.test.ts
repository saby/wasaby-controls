import {
    getItemSize,
    getImageClasses,
    getImageUrl,
    getImageSize,
    IMAGE_FIT,
    getImageRestrictions,
} from 'Controls/_tile/utils/imageUtil';

function mockHTMLElement(width, height) {
    return {
        classList: {
            _classList: [],
            add(className) {
                this._classList.push(className);
            },
            remove(className) {
                this._classList.splice(this._classList.indexOf(className), 1);
            },
            contains(className) {
                return this._classList.indexOf(className) >= 0;
            },
        },
        style: {},
        getBoundingClientRect() {
            return {
                width,
                height,
            };
        },
    };
}

describe('tileImageUtil', () => {
    describe('getImageClasses', () => {
        expect(getImageClasses(IMAGE_FIT.CONTAIN)).toBe(
            ' controls-TileView__image-contain'
        );
        expect(getImageClasses(IMAGE_FIT.COVER)).toBe(
            ' controls-TileView__image-cover'
        );
    });
    describe('getImageUrl', () => {
        it('get url', () => {
            const imageUrlResolver = () => {
                return 'resolvedUrl';
            };
            const baseUrl = '/online.sbis.ru/doc';
            const defaultPrefix = '/previewer/c';
            let defaultUrl = getImageUrl(0, 100, baseUrl, null);
            expect(defaultUrl).toBe(`${defaultPrefix}/100${baseUrl}`);

            defaultUrl = getImageUrl(100, 0, baseUrl, null);
            expect(defaultUrl).toBe(`${defaultPrefix}/100${baseUrl}`);

            defaultUrl = getImageUrl(100, 100, baseUrl, null);
            expect(defaultUrl).toBe(`${defaultPrefix}/100/100${baseUrl}`);

            defaultUrl = getImageUrl(100, 0, baseUrl, null, imageUrlResolver);
            expect(defaultUrl).toBe('resolvedUrl');
        });
    });
    describe('getImageSize', () => {
        describe('cover image fit', () => {
            it('Если широкая картинка (imageDeltaW > tileDeltaW), и шире увеличенной плитки', () => {
                const wideImage = getImageSize(
                    200,
                    200,
                    'static',
                    100,
                    300,
                    'cover'
                );
                expect(wideImage.height === 0).toBe(true);
                expect(wideImage.width === 300).toBe(true);
            });

            it('Если широкая картинка (imageDeltaW > tileDeltaW), и не шире увеличенной плитки', () => {
                const wideImage = getImageSize(
                    200,
                    200,
                    'static',
                    100,
                    120,
                    'cover'
                );
                expect(wideImage.height === 300).toBe(true);
                expect(wideImage.width === 0).toBe(true);
            });

            it('Если картинка высокая (imageDeltaW < tileDeltaW), но не выше увеличенной плитки', () => {
                const tallImage = getImageSize(
                    100,
                    400,
                    'static',
                    300,
                    100,
                    'cover'
                );
                expect(tallImage.height === 600).toBe(true);
                expect(tallImage.width === 0).toBe(true);
            });
            it('Пропорциональная картинка ограничивается по ширине', () => {
                const proportionalImage = getImageSize(
                    100,
                    100,
                    'static',
                    300,
                    300,
                    'cover'
                );
                expect(proportionalImage.width === 150).toBe(true);
                expect(proportionalImage.height === 0).toBe(true);
            });
        });
        describe('none and contain image fit', () => {
            it('returns image original sizes', () => {
                let imageSizes = getImageSize(
                    200,
                    300,
                    'static',
                    1,
                    1,
                    'contain'
                );
                expect(imageSizes.width === 1).toBe(true);
                expect(imageSizes.height === 1).toBe(true);

                imageSizes = getImageSize(200, 300, 'static', 1, 1, 'none');
                expect(imageSizes.width === 1).toBe(true);
                expect(imageSizes.height === 1).toBe(true);
            });
        });

        describe('getImageRestrictions', () => {
            it('image without sizes', () => {
                const restrictions = getImageRestrictions(0, null, 200, 300);
                expect(restrictions.width && restrictions.height).toBe(true);
            });
            it('Картинка пропорциоально шире плитки', () => {
                const restrictions = getImageRestrictions(100, 300, 400, 400);
                expect(restrictions.height).toBe(true);
            });
            it('Картинка пропорционально ниже плитки', () => {
                const restrictions = getImageRestrictions(300, 100, 400, 400);
                expect(restrictions.width).toBe(true);
            });
            it('Картинка пропорционально равна по ширине плитке, но выше', () => {
                const restrictions = getImageRestrictions(5760, 3840, 196, 142);
                expect(restrictions.height).toBe(true);
            });
            it('Картинка пропорционально выше плитки', () => {
                const restrictions = getImageRestrictions(300, 100, 200, 100);
                expect(restrictions.width).toBe(true);
            });
            it('Картинка полностью пропорциональна плитке', () => {
                const restrictions = getImageRestrictions(300, 300, 500, 500);
                expect(restrictions.height).toBe(true);
            });
        });

        describe('getItemSize', () => {
            let items;
            let item;

            beforeEach(() => {
                items = {
                    '.controls-TileView__itemContent': mockHTMLElement(
                        100,
                        100
                    ),
                    '.controls-TileView__imageWrapper': mockHTMLElement(
                        100,
                        75
                    ),
                };
                item = {
                    querySelector: (selector) => {
                        return items[selector];
                    },
                } as HTMLElement;
            });

            it('without imageWrapper', () => {
                let hasError = false;

                delete items['.controls-TileView__imageWrapper'];

                try {
                    getItemSize(item, 1, 'static');
                } catch (e) {
                    hasError = true;
                }

                expect(hasError).toBe(false);
            });
            it('do not change final classes', () => {
                items['.controls-TileView__itemContent'].classList.add(
                    'controls-TileView__item_hovered'
                );
                getItemSize(item, 1, 'static');
                expect(
                    items['.controls-TileView__itemContent'].classList.contains(
                        'controls-TileView__item_hovered'
                    )
                ).toBe(true);
                expect(
                    items['.controls-TileView__itemContent'].classList.contains(
                        'controls-TileView__item_unfixed'
                    )
                ).toBe(false);
            });
        });
    });
});
