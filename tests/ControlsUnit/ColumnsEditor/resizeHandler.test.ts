import { resizeHandler } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

describe('Controls-Lists-editors/columnsEditor/resizeHandler', function () {
    // FIXED WIDTH TEST
    // PX UNITS
    test('increase width by 50 px, when its represented with px in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '100px', offset: 50 })
        ).toEqual('150px');
    });
    test('decrease width by 50 px, when its represented with px in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '100px', offset: -50 })
        ).toEqual('50px');
    });
    test('decrease width by 80 px, when its represented with px in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '100px', offset: -80 })
        ).toEqual('30px');
    });
    test('increase width by 1000 px, when its represented with px in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '100px', offset: 1000 })
        ).toEqual('999px');
    });
    // % UNITS
    test('increase width by 50 px, when its represented with % in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '20%', offset: 50 })
        ).toEqual('30%');
    });
    test('decrease width by 50 px, when its represented with % in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '20%', offset: -50 })
        ).toEqual('10%');
    });
    test('decrease width by 80 px, when its represented with % in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '20%', offset: -80 })
        ).toEqual('6%');
    });
    test('decrease width by 80 px, when its represented with % in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '20%', offset: -80 })
        ).toEqual('6%');
    });
    test('increase width by 1000 px, when its represented with % in grid template', function () {
        expect(
            resizeHandler({ columnHTMLWidth: 100, columnTemplateWidth: '5%', offset: 1000 })
        ).toEqual('50%');
    });
    // AUTO WIDTH TESTS
    // MAX-CONTENT
    test('increase width by 50 px, when its represented with max-content in grid template', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 100,
                columnTemplateWidth: 'max-content',
                offset: 50,
            })
        ).toEqual('minmax(150px,999px)');
    });
    test('decrease width by 50 px, when its represented with max-content in grid template', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 100,
                columnTemplateWidth: 'max-content',
                offset: -50,
            })
        ).toEqual('minmax(30px,50px)');
    });
    // MINMAX
    test('decrease width by 50 px, when its represented with minmax in px units in grid template and html has maximum width', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 100,
                columnTemplateWidth: 'minmax(40px, 100px)',
                offset: -50,
            })
        ).toEqual('minmax(40px,50px)');
    });
    test('increase width by 50 px, when its represented with minmax in px units in grid template and html has maximum width', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 100,
                columnTemplateWidth: 'minmax(40px, 100px)',
                offset: 50,
            })
        ).toEqual('minmax(40px,150px)');
    });
    test('increase width by 50 px, when its represented with minmax in px units in grid template and html column width is less than maximum, but more than minimum', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 80,
                columnTemplateWidth: 'minmax(40px, 100px)',
                offset: 50,
            })
        ).toEqual('130px');
    });
    test('decrease width by 50 px, when its represented with minmax in px units in grid template and new width is less than minimum', function () {
        expect(
            resizeHandler({
                columnHTMLWidth: 80,
                columnTemplateWidth: 'minmax(40px, 100px)',
                offset: -50,
            })
        ).toEqual('30px');
    });
});
