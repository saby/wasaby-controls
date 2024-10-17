import { parseColumnWidth } from 'Controls-Lists-editors/_columnsEditor/utils/columnEditor';

describe('Controls-Lists-editors/columnsEditor/parseColumnWidth', function () {
    // ГЛАВНАЯ КОЛОНКА
    test('minmax(200px, 1fr)  main column', function () {
        expect(parseColumnWidth('minmax(200px, 1fr)')).toEqual({
            mode: 'auto',
            units: 'px',
            maxLimit: '1fr',
            minLimit: 200,
        });
    });
    test('minmax(40px, max-content) main column', function () {
        expect(parseColumnWidth('minmax(40px, max-content)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 40,
            maxLimit: 'max-content',
        });
    });
    test('minmax(40px, 1fr)', function () {
        expect(parseColumnWidth('minmax(40px, 1fr)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 40,
            maxLimit: '1fr',
        });
    });
    test('minmax(200px, 600px)', function () {
        expect(parseColumnWidth('minmax(200px, 600px)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 200,
            maxLimit: 600,
        });
    });
    test('minmax(30px, 600px)', function () {
        expect(parseColumnWidth('minmax(30px, 600px)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 30,
            maxLimit: 600,
        });
    });
    test('minmax(30px, 1fr)', function () {
        expect(parseColumnWidth('minmax(30px, 1fr)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 30,
            maxLimit: '1fr',
        });
    });
    // ВТОРОСТЕПЕННАЯ КОЛОНКА
    test('max-content', function () {
        expect(parseColumnWidth('max-content')).toEqual({ mode: 'auto', units: 'px' });
    });
    test('minmax(40px, max-content)', function () {
        expect(parseColumnWidth('minmax(40px, max-content)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 40,
            maxLimit: 'max-content',
        });
    });
    test('minmax(30px, 60px)', function () {
        expect(parseColumnWidth('minmax(30px, 60px)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 30,
            maxLimit: 60,
        });
    });
    test('minmax(40px, 60px)', function () {
        expect(parseColumnWidth('minmax(40px, 60px)')).toEqual({
            mode: 'auto',
            units: 'px',
            minLimit: 40,
            maxLimit: 60,
        });
    });
});
