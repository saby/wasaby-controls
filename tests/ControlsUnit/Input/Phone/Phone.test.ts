import { Phone } from 'Controls/input';

function setSelectionRange(start: number, end: number): void {
    this.selectionStart = start;
    this.selectionEnd = end;
}

const createComponent = (Component, cfg) => {
    if (Component.getDefaultOptions) {
        // eslint-disable-next-line no-param-reassign
        cfg = { ...cfg, ...Component.getDefaultOptions(), preferSource: true };
    }
    const cmp = new Component(cfg);
    cmp.saveOptions(cfg);
    cmp._beforeMount(cfg);
    cmp._children[cmp._fieldName] = {
        selectionStart: 0,
        selectionEnd: 0,
        value: '',
        focus: jest.fn(),
        setSelectionRange,
    };
    return cmp;
};

describe('Controls/_input/Phone', () => {
    describe('_focusInHandler', () => {
        it('should set selection position to end', () => {
            const component = createComponent(Phone, { value: '12' });
            component._viewModel.selection = {
                start: 10,
                end: 10,
            };
            component._focusInHandler({
                target: {},
            });
            expect(component._viewModel.selection).toEqual({
                start: 2,
                end: 2,
            });
        });
        it('should not update selection position if the focus was set by a mouse click', () => {
            const component = createComponent(Phone, { value: '12' });
            component._viewModel.selection = {
                start: 1,
                end: 1,
            };
            component._mouseDownHandler();
            component._focusInHandler({
                target: {},
            });
            expect(component._viewModel.selection).toEqual({
                start: 1,
                end: 1,
            });
        });
    });
    describe('handleInput', () => {
        it('Remove 7', () => {
            const component = createComponent(Phone, { value: '+79721161' });
            component._viewModel.handleInput(
                {
                    after: ' (972) 116-1',
                    before: '+',
                    delete: '7',
                    insert: '',
                },
                'deleteBackward'
            );
            expect(component._viewModel.displayValue).toEqual('+972 116 1');
        });
    });
    describe('onlyMobile', () => {
        it('Remove +7', () => {
            const component = createComponent(Phone, {
                value: '+7',
                onlyMobile: true,
            });
            component._viewModel.handleInput(
                {
                    after: '',
                    before: '',
                    delete: '+7',
                    insert: '',
                },
                'delete'
            );
            expect(component._viewModel.displayValue).toEqual('+');
        });
        it('Added +7 in focus', () => {
            const component = createComponent(Phone, {
                value: '',
                onlyMobile: true,
            });
            component._focusInHandler();
            expect(component._viewModel.displayValue).toEqual('+7');
        });
        it('update area code', () => {
            const component = createComponent(Phone, {
                value: '+79721161120',
                onlyMobile: true,
            });
            component._viewModel.updateAreaCode(375);
            expect(component._viewModel.value).toEqual('+3759721161120');
            component._viewModel.updateAreaCode(1);
            expect(component._viewModel.value).toEqual('+19721161120');
        });
    });
});
