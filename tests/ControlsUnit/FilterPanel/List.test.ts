import { default as ListEditor } from 'Controls/_filterPanel/Editors/_List';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';

describe('Controls/filterPanel:ListEditor', () => {
    describe('_beforeMount', () => {
        const navigation = {
            pageSize: 3,
        };
        const keyProperty = 'id';
        const getEditorOptions = () => {
            return {
                propertyValue: [1],
                filter: {},
                keyProperty,
                navigation,
                selectorTemplate: 'template',
            };
        };

        const getEditorOptionsWithEmptyValue = () => {
            return {
                propertyValue: [],
                filter: {},
                keyProperty,
                navigation,
            };
        };
        const getEditor = () => {
            const listEditor = new ListEditor({});
            const options = getEditorOptions();
            listEditor._beforeMount(options);
            listEditor.saveOptions(options);
            return listEditor;
        };

        it('propertyValue is not empty', () => {
            const listEditor = new ListEditor({});
            listEditor._beforeMount(getEditorOptions());
            expect(listEditor._navigation).toBeNull();
            expect(listEditor._filter[keyProperty]).toEqual([1]);
        });

        it('propertyValue is equal to resetValue', () => {
            const listEditor = new ListEditor({});
            const options = getEditorOptions();
            options.resetValue = 1;
            listEditor._beforeMount(options);
            expect(listEditor._filter[keyProperty]).not.toBeDefined();
        });

        it('propertyValue is empty', () => {
            const listEditor = new ListEditor({});
            listEditor._beforeMount(getEditorOptionsWithEmptyValue());
            expect(listEditor._navigation).toEqual(navigation);
        });

        it('with itemActions and historyId', () => {
            const config = {
                ...getEditorOptionsWithEmptyValue(),
                itemActions: [
                    {
                        id: 'testAction',
                    },
                ],
                historyId: 'testHistoryId',
            };
            const listEditor = new ListEditor({});
            listEditor._beforeMount(config);
            expect(listEditor._itemActions.length === 3).toBeTruthy();
            expect(listEditor._itemActions[0].id === 'testAction').toBeTruthy();
            expect(listEditor._itemActions[1].id === 'PinOff').toBeTruthy();
        });
    });

    describe('_beforeUpdate', () => {
        const getEditorOptions = () => {
            return {
                propertyValue: [1],
                filter: {},
                keyProperty: 'id',
            };
        };
        const getEditor = () => {
            const listEditor = new ListEditor({});
            const options = getEditorOptions();
            listEditor._beforeMount(options);
            listEditor.saveOptions(options);
            return listEditor;
        };

        it('propertyValue changed', () => {
            const newPropertyValue = [];
            const listEditor = getEditor();
            const options = getEditorOptions();
            options.propertyValue = newPropertyValue;
            listEditor._beforeUpdate(options);
            expect(listEditor._filter).toEqual({});
        });

        it('propertyValue changed with multiSelect', () => {
            const listEditor = getEditor();
            const newPropertyValue = [1];
            const options = getEditorOptions();
            options.propertyValue = newPropertyValue;
            options.filter = listEditor._options.filter;
            options.multiSelect = true;
            listEditor._beforeUpdate(options);
            expect(listEditor._filter.id).not.toBe(newPropertyValue);
        });

        it('_beforeUpdate with same value in propertyValue', () => {
            const listEditor = getEditor();
            const newPropertyValue = [2];
            const options = getEditorOptions();
            options.propertyValue = newPropertyValue;

            listEditor._selectedKeys = [2];
            listEditor._beforeUpdate(options);
            expect(listEditor._filter.id).not.toEqual(newPropertyValue);
        });
    });

    describe('_handleItemClick', () => {
        const getEditorOptions = () => {
            return {
                propertyValue: [1],
                filter: {},
                keyProperty: 'id',
            };
        };

        const getEditorOptionsWithMultiSelet = () => {
            return {
                propertyValue: [1],
                filter: {},
                keyProperty: 'id',
                multiSelect: true,
            };
        };
        const getEditor = (multiSelect) => {
            const listEditor = new ListEditor({});
            const options = multiSelect ? getEditorOptionsWithMultiSelet() : getEditorOptions();
            listEditor._beforeMount(options);
            listEditor.saveOptions(options);
            listEditor._items = new RecordSet({
                rawData: [],
                keyProperty: 'id',
            });
            listEditor._getTextValue = () => {
                return '';
            };
            return listEditor;
        };
        const clickEvent = {
            target: {
                closest: () => {
                    return true;
                },
            },
        } as unknown as SyntheticEvent;

        it('selectedKeys are not empty', () => {
            const listEditor = getEditor(true);
            const item = new Model({
                rawData: { id: 2, title: 'second' },
                keyProperty: 'id',
            });
            listEditor._handleItemClick(null, item, clickEvent);
            expect(listEditor._selectedKeys).toEqual([2, 1]);
        });

        it('selectedKeys includes selectedItem', () => {
            const listEditor = getEditor(true);
            const item = new Model({
                rawData: { id: 1, title: 'first' },
                keyProperty: 'id',
            });
            listEditor._handleItemClick(null, item, clickEvent);
            expect(listEditor._selectedKeys).toEqual([]);
        });

        it('multiSelect is false', () => {
            const listEditor = getEditor(false);
            const notifyStub = jest.spyOn(listEditor, '_notify').mockClear().mockImplementation();
            const item = new Model({
                rawData: { id: 2, title: 'second' },
                keyProperty: 'id',
            });
            listEditor._handleItemClick(null, item, clickEvent);
            expect(listEditor._selectedKeys).toEqual([2]);
            expect(notifyStub).toHaveBeenCalledWith(
                'propertyValueChanged',
                [{ value: 2, textValue: '' }],
                { bubbling: true }
            );
            expect(notifyStub).toHaveBeenCalledTimes(1);
        });

        it('empty _selectedKeys', () => {
            const listEditor = new ListEditor({});
            listEditor._items = new RecordSet({});
            listEditor._selectedKeys = [];
            const options = getEditorOptionsWithMultiSelet();
            options.propertyValue = null;
            listEditor._beforeMount(options);
            const item = new Model({
                rawData: { id: 2, title: 'second' },
                keyProperty: 'id',
            });
            let hasError = false;

            try {
                listEditor._handleItemClick(null, item, clickEvent);
            } catch (e) {
                hasError = true;
            }
            expect(hasError).toBe(false);
        });
    });

    describe('_handleSelectorResult', () => {
        const getEditorOptions = () => {
            return {
                propertyValue: [],
                filter: {},
                keyProperty: 'id',
                multiSelect: true,
                displayProperty: 'title',
                selectorTemplate: 'template',
            };
        };
        const getEditor = () => {
            const listEditor = new ListEditor({});
            const options = getEditorOptions();
            listEditor._beforeMount(options);
            listEditor.saveOptions(options);
            listEditor._items = new RecordSet({
                rawData: [],
                keyProperty: 'id',
            });
            return listEditor;
        };

        it('navigation is null', async () => {
            const listEditor = getEditor();
            const result = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        title: 'Test',
                    },
                ],
                keyProperty: 'id',
            });
            await listEditor._handleSelectorResult(result);
            expect(listEditor._navigation).toBeNull();
            expect(listEditor._filter).toEqual({ id: [1] });
        });
    });

    describe('_itemActionVisibilityCallback', () => {
        const getEditorOptions = () => {
            return {
                propertyValue: [],
                filter: {},
                keyProperty: 'id',
                displayProperty: 'title',
                historyId: 'testId',
                emptyKey: 'emptyKey',
                itemActions: [],
            };
        };
        const getEditor = () => {
            const listEditor = new ListEditor({});
            const options = getEditorOptions();
            listEditor._beforeMount(options);
            listEditor.saveOptions(options);
            return listEditor;
        };
        const item = new Model({
            rawData: { id: 2, title: 'second' },
            keyProperty: 'id',
            pinned: false,
        });
        it('itemActions with history', () => {
            const listEditor = getEditor();
            const action = {
                id: 'PinNull',
            };
            expect(listEditor._itemActionVisibilityCallback(action, item)).toBe(true);
        });

        it('itemActions with history and emptyKey', () => {
            const listEditor = getEditor();
            const item = new Model({
                rawData: { id: 'emptyKey', title: 'emptyKey' },
                keyProperty: 'id',
            });
            const action = {
                id: 'PinNull',
            };
            expect(listEditor._itemActionVisibilityCallback(action, item)).toBe(false);
        });

        it('itemActions with history and itemActionVisibilityCallback', () => {
            const listEditor = getEditor();
            const options = getEditorOptions();
            options.itemActionVisibilityCallback = () => {
                return false;
            };
            listEditor.saveOptions(options);
            const action = {
                id: 'PinNull',
            };
            expect(listEditor._itemActionVisibilityCallback(action, item)).toBe(true);
        });

        it('itemActions without history and itemActionVisibilityCallback', () => {
            const listEditor = getEditor();
            const options = getEditorOptions();
            options.itemActionVisibilityCallback = () => {
                return false;
            };
            options.historyId = null;
            listEditor.saveOptions(options);
            const action = {
                id: 'actionId',
            };
            expect(listEditor._itemActionVisibilityCallback(action, item)).toBe(false);
        });
    });
});
