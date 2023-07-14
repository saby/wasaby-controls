import InputRender from 'Controls/_lookup/BaseLookupView/InputRender';

function getInputRender(cfg: object = {}) {
    const render = new InputRender(cfg);
    render.saveOptions(cfg);
    render._children = {
        readOnlyField: 'readOnlyInput',
        input: 'input',
    };
    return render;
}

describe('LookupView/InputRender', () => {
    describe('_getReadOnlyField', () => {
        it('isInputVisible: true', () => {
            const render = getInputRender({
                isInputVisible: true,
            });
            expect(render._getReadOnlyField()).toEqual('readOnlyInput');
        });
    });
});
