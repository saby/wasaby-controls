import { isRequired } from 'Controls/toggle';

describe('Controls/toggle:isRequired', () => {
    it('TriState = true', () => {
        const args = {
            value: false,
        };

        let value = isRequired(args);
        expect(value).toEqual(true);

        args.value = true;
        value = isRequired(args);
        expect(value).toEqual(true);

        args.value = null;
        value = isRequired(args);
        expect(typeof value).not.toEqual('boolean');
    });

    it('TriState = false', () => {
        const args = {
            value: true,
            triState: false,
        };

        let value = isRequired(args);
        expect(value).toEqual(true);

        args.value = false;
        value = isRequired(args);
        expect(typeof value).not.toEqual('boolean');
    });
});
