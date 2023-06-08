import { MultiSelectorCheckbox } from 'Controls/operations';

function getMultiSelectorCheckbox(options): MultiSelectorCheckbox {
    const checkbox = new MultiSelectorCheckbox(options);
    checkbox.saveOptions(options);
    return checkbox;
}

const checkboxCheckedOptions = {
    isAllSelected: true,
    selectedKeys: [null],
};

const checkboxNotCheckedOptions = {
    isAllSelected: false,
    selectedKeys: [],
};

const checkboxPartialCheckedOptions = {
    selectedKeysCount: 10,
    selectedKeys: [1],
    isAllSelected: false,
};

describe('Controls/_operations/MultiSelector/Checkbox', () => {
    describe('Lifecycle hooks', () => {
        describe('_beforeMount', () => {
            const checkbox = getMultiSelectorCheckbox({});

            it('checkbox checked', () => {
                checkbox._beforeMount(checkboxCheckedOptions);
                expect(checkbox._checkboxValue).toBe(true);
            });

            it('checkbox partial checked', () => {
                checkbox._beforeMount(checkboxPartialCheckedOptions);
                expect(checkbox._checkboxValue).toBeNull();
            });

            it('checkbox not checked', () => {
                checkbox._beforeMount(checkboxNotCheckedOptions);
                expect(checkbox._checkboxValue).toBe(false);
            });
        });

        describe('_beforeUpdate', () => {
            const checkbox = getMultiSelectorCheckbox({});

            it('checkbox checked', () => {
                checkbox._beforeUpdate(checkboxCheckedOptions);
                expect(checkbox._checkboxValue).toBe(true);
            });

            it('checkbox partial checked', () => {
                checkbox._beforeUpdate(checkboxPartialCheckedOptions);
                expect(checkbox._checkboxValue).toBeNull();
            });

            it('checkbox not checked', () => {
                checkbox._beforeUpdate(checkboxNotCheckedOptions);
                expect(checkbox._checkboxValue).toBe(false);
            });
        });

        describe('_onCheckBoxClick', () => {
            let checkbox;
            let actionName;

            beforeEach(() => {
                checkbox = getMultiSelectorCheckbox({});
                checkbox._notify = (event, eventArgs) => {
                    actionName = eventArgs[0];
                };
            });

            afterEach(() => {
                actionName = undefined;
            });

            it('checked checkbox readOnly click', () => {
                checkbox._checkboxValue = true;
                checkbox._onCheckBoxClick();
                expect(actionName).not.toBeDefined();
            });

            it('checked checkbox click', () => {
                checkbox._checkboxValue = true;
                checkbox._onCheckBoxClick();
                expect(actionName).toEqual('unselectAll');
            });

            it('checked not checkbox click', () => {
                checkbox._checkboxValue = false;
                checkbox._onCheckBoxClick();
                expect(actionName).toEqual('selectAll');
            });

            it('checked partial checkbox click', () => {
                checkbox._checkboxValue = null;
                checkbox._onCheckBoxClick();
                expect(actionName).toEqual('unselectAll');
            });
        });
    });
});
