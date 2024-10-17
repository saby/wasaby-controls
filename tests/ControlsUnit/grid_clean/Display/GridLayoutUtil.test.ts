import { GridLayoutUtil } from 'Controls/display';

describe('Controls/grid_clean/_display/utils/GridLayoutUtil', () => {
    describe('.isValidWidthValue()', () => {
        describe('invalid cases', () => {
            [
                '0fr',
                'fr',
                '1fl',
                '1f',
                '01fr',
                '-1fr',
                '!2fr',
                '10fr!',
                '1.5.5fr',
                '1..5fr',
                '.5fr',
                '0.0fr',
                '010.5fr',
                '-1px',
                '-0px',
                'px',
                '010px',
                '10pn',
                '10ph',
                '%',
                '01%',
                '-1%',
                '!2%',
                '10%!',
                'Auto',
                'auTo',
                'mincontent',
                'maxcontent',
                'fit-content',
                'fitcontent(12px)',
                'fit-content(auto)',
                'fit-content(min-content)',
                'fit-content(max-content)',
                'min-max(10px, 20px)',
                'minmax()',
                'minmax(,)',
                'minmax(10px,)',
                'minmax(, 10px)',
                'minmax(10px)',
                'minmax(01px, 10px)',
                'minmax(10px, 0fr)',
                'minmax(-1px, 0fr)',
                'minmax(10px, minmax(20px, 30px))',
            ].forEach((width) => {
                it(`${width} is invalid`, () => {
                    expect(GridLayoutUtil.isValidWidthValue(width)).toBe(false);
                });
            });
        });
        describe('valid cases', () => {
            [
                '1fr',
                '123fr',
                '1.5fr',
                '0.5fr',
                '1.01fr',
                '1.010fr',
                '0px',
                '10px',
                '100px',
                '0%',
                '1%',
                '100%',
                'auto',
                'min-content',
                'max-content',
                'fit-content(100%)',
                'fit-content(100px)',
                'fit-content(10fr)',
                'minmax(min-content, auto)',
                'minmax(10px, 100%)',
                'minmax(0px, 100%)',
                'minmax(0%, 100%)',
            ].forEach((width) => {
                it(`${width} is valid`, () => {
                    expect(GridLayoutUtil.isValidWidthValue(width)).toBe(true);
                });
            });
        });
    });
});
