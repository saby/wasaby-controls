import { findPopupParentId } from 'Controls/popupTemplateStrategy';
import jsdom = require('jsdom');
const { JSDOM } = jsdom;
describe('Controls/_popup/Utils/findPopupParentId', () => {
    beforeEach(() => {
        global.document = new JSDOM('');
    });
    afterEach(() => {
        global.document = undefined;
    });
    it('should return parent id', () => {
        const element = {
            closest: () => {
                return {
                    getAttribute: () => {
                        return 'popupId';
                    },
                };
            },
        };
        const result = findPopupParentId(element);
        expect(result).toBe('popupId');
    });
    it('should return false', () => {
        const element = {
            closest: () => {
                return null;
            },
        };
        const result = findPopupParentId(element);
        expect(result).toBe(false);
    });
});
