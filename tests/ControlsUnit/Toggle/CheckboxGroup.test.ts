import { Control as CheckboxGroup } from 'Controls/CheckboxGroup';

describe('Controls.CheckboxGroup:Control', () => {
    describe('methods', () => {
        it('operations with key', () => {
            const Group = new CheckboxGroup({});
            Group._triStateKeys = ['4'];

            Group._addTriStateKey('4');
            expect(Group._triStateKeys.length).toEqual(1);

            Group._addTriStateKey('5');
            expect(Group._triStateKeys.length).toEqual(2);

            Group._removeTriStateKey('4');
            expect(Group._triStateKeys.length).toEqual(1);

            Group._removeTriStateKey('5');
            expect(Group._triStateKeys.length).toEqual(0);

            Group._removeTriStateKey = () => {
                return true;
            };
            Group._updateItemChildSelection = () => {
                return true;
            };

            Group._selectedKeys = ['4', '3'];
            Group._addKey('5');
            expect(Group._selectedKeys.length).toEqual(3);

            Group._removeKey('5');
            expect(Group._selectedKeys.length).toEqual(2);

            Group.destroy();
        });

        it('_isSelected', () => {
            const Group = new CheckboxGroup({});
            Group._selectedKeys = ['1', '2'];
            Group._triStateKeys = ['3', '4'];
            Group._getItemKey = (key) => {
                return key;
            };
            expect(Group._isSelected('5')).toEqual(false);
            expect(Group._isSelected('2')).toEqual(true);
            expect(Group._isSelected('3')).toEqual(null);

            Group.destroy();
        });

        it('_getItemKey', () => {
            const Group = new CheckboxGroup({});
            const item = {};
            item.get = (key) => {
                return '5';
            };
            const options = {
                keyProperty: 'key',
            };
            expect(Group._getItemKey(item, options)).toEqual('5');
            Group.destroy();
        });

        it('_valueChangedHandler', () => {
            const Group = new CheckboxGroup({});
            let result = '';
            Group._addKey = () => {
                result += '_addKey';
            };
            Group._removeKey = () => {
                result += '_removeKey';
            };
            Group._updateItemChildSelection = () => {
                result += '_updateItemChildSelection';
            };
            Group._notifySelectedKeys = () => {
                result += '_notifySelectedKeys';
            };
            Group._getItemKey = () => {
                return true;
            };
            Group._valueChangedHandler(null, null, true);
            expect(result).toEqual('_addKey_notifySelectedKeys');

            result = '';
            Group._valueChangedHandler(null, null, null);
            expect(result).toEqual('_removeKey_updateItemChildSelection_notifySelectedKeys');

            result = '';
            Group._valueChangedHandler(null, null, false);
            expect(result).toEqual('_removeKey_updateItemChildSelection_notifySelectedKeys');
            Group.destroy();
        });

        it('Selection', () => {
            const Group = new CheckboxGroup({});
            let result = '';
            const fakeItem = {
                get(arg) {
                    return arg !== 1;
                },
            };
            Group._addKey = () => {
                result += '_addKey';
            };
            Group._removeKey = () => {
                result += '_removeKey';
            };
            Group._notifySelectedKeys = () => {
                result += '_notifySelectedKeys';
            };
            Group._setItemsSelection = () => {
                result += '_setItemsSelection';
            };
            Group._getItemKey = () => {
                return '3';
            };
            Group._groups = {
                3: [fakeItem],
            };
            Group.keyProperty = 'key';
            Group.parentProperty = 'parent';
            Group._items = {
                getRecordById: () => {
                    return fakeItem;
                },
            };

            Group._options = { keyProperty: true };
            Group._updateItemChildSelection('3', true);
            expect(result).toEqual('_addKey_removeKey_setItemsSelection');

            result = '';
            Group._updateItemChildSelection('2', false);
            expect(result).toEqual('_removeKey_setItemsSelection');

            Group._items = {
                getRecordById: () => {
                    return 2;
                },
            };
            Group._selectedKeys = ['8', '4'];
            Group._nodeProperty = true;
            result = '';
            Group._setItemsSelection(fakeItem, Group._options);
            expect(result).toEqual('_setItemsSelection');

            Group._nodeProperty = 2;
            Group._options = { parentProperty: 1 };
            Group._setItemsSelection(fakeItem, Group._options);
            expect(result).toEqual('_setItemsSelection_setItemsSelection');
            Group.destroy();
        });
    });
});
