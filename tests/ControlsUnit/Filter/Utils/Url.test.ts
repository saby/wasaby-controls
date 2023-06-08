import {
    getQueryParamsByFilter,
    updateUrlByFilter,
    getFilterFromUrl,
} from 'Controls/_filter/Utils/Url';
import { query } from 'Application/Env';
import { MaskResolver } from 'Router/router';

describe('Controls/_filter/Utils/Url', () => {
    it('getQueryParamsByFilter empty filterButtonItems', () => {
        expect(getQueryParamsByFilter([])).toEqual({});
    });

    it('getQueryParamsByFilter', () => {
        const queryParams = getQueryParamsByFilter([
            {
                name: 'testName',
                value: 'testValue',
                textValue: 'testText',
                resetValue: null,
            },
            {
                name: 'testName2',
                value: { value: 'testValue' },
                textValue: 'testText',
                resetValue: null,
            },
            {
                name: 'testName',
                value: [{ value: 'testValue' }],
                textValue: 'testText',
                resetValue: null,
                visibility: true,
            },
        ]);
        const expected = {
            filter:
                '[{"name":"testName","value":"testValue","textValue":"testText","visibility":' +
                '{"$serialized$":"undef"}},{"name":"testName2","value":{"value":"testValue"},"textValue":"testText",' +
                '"visibility":{"$serialized$":"undef"}},{"name":"testName","value":[{"value":"testValue"}],' +
                '"textValue":"testText","visibility":true}]',
        };

        expect(queryParams).toEqual(expected);
    });

    it('updateUrlByFilter', () => {
        const items = [
            {
                name: 'testName',
                value: 'testValue',
                textValue: 'testText',
                resetValue: null,
                visibility: true,
            },
        ];
        const queryParams = getQueryParamsByFilter(items);
        const state = MaskResolver.calculateQueryHref(queryParams);

        expect(queryParams).toEqual({
            filter:
                '[{"name":"testName","value":"testValue",' +
                '"textValue":"testText","visibility":true}]',
        });
        expect(state).toEqual(
            '/?filter=%5B%7B%22name%22%3A%22testName%22%2C%22value%22%3A%22testValue' +
                '%22%2C%22textValue%22%3A%22testText%22%2C%22visibility%22%3Atrue%7D%5D'
        );
    });

    it('getFilterFromUrl', () => {
        const urlFilter = {
            filter:
                '%5B%7B%22name%22%3A%22Organization%22%2C%22value%22%3A21391705%2C%22textValue' +
                '%22%3A%22%D0%9D%D0%9E%D0%92%D0%AB%D0%99%20%D0%A2%D0%95%D0%A1%D0%A2%22%7D%5D',
        };
        jest.spyOn(query, 'get', 'get').mockReturnValue(urlFilter);

        expect(getFilterFromUrl()).toEqual([
            {
                name: 'Organization',
                value: 21391705,
                textValue: 'НОВЫЙ ТЕСТ',
            },
        ]);
    });
});
