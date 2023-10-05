import { __ValueInField, BaseViewModel } from 'Controls/input';

describe('Controls/input:ValueInField', () => {
    let inst: __ValueInField;
    const fieldValue = 'test field';
    const field: HTMLInputElement = {
        value: fieldValue,
    } as HTMLInputElement;
    const model = new BaseViewModel.ViewModel({}, 'test model');
    const stateValue = model.displayValue;
    beforeEach(() => {
        inst = new __ValueInField();
    });
    it('Control is be mount', () => {
        inst.beforeMount(stateValue);
        expect(inst.detectFieldValue({ model })).toEqual(stateValue);
    });
    it('Control is mounted', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        expect(inst.detectFieldValue({ model, field })).toEqual(fieldValue);
    });
    it('Start processing the input', () => {
        inst.beforeMount(stateValue);
        inst.afterMount();
        inst.startInputProcessing();
        expect(inst.detectFieldValue({ model, field })).toEqual(stateValue);
        inst.afterUpdate();
        expect(inst.detectFieldValue({ model, field })).toEqual(fieldValue);
    });
    it('Field is be mount.', () => {
        expect(inst.detectFieldValue({ model })).toEqual(model.displayValue);
    });
});
