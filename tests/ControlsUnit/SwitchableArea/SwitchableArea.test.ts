import { View, ISwitchableAreaItem, ISwitchableOptions } from 'Controls/switchableArea';
import { default as ViewModel } from 'Controls/_switchableArea/ViewModel';
import { Logger } from 'UI/Utils';

const testItems: ISwitchableAreaItem[] = [
    {
        key: '1',
    },
    {
        key: '2',
    },
    {
        key: '3',
    },
    {
        key: 0,
    },
];

const additionalTestItems: ISwitchableAreaItem[] = [
    {
        key: '1',
        title: 'title',
    },
];

describe('Controls.switchableArea:View', () => {
    it('ViewModel', function () {
        const switchAreaModel = new ViewModel(testItems, '1');

        switchAreaModel.updateSelectedKey('2');
        let items = switchAreaModel.getItems();

        expect(items[0].loaded).toEqual(true);
        expect(items[1].loaded).toEqual(true);

        switchAreaModel.updateSelectedKey('1');
        switchAreaModel.updateItems(additionalTestItems);
        items = switchAreaModel.getItems();
        expect(items[0].title).toEqual('title');
    });

    it('correctSelectedKey', () => {
        const opt1 = {
            items: testItems,
            selectedKey: 0,
        };
        const opt2 = {
            items: testItems,
            selectedKey: '7',
        };
        const opt: ISwitchableOptions = {
            items: testItems,
            selectedKey: '1',
        };
        const SwitchArea = new View(opt);
        jest.spyOn(Logger, 'error').mockImplementation();
        let selectedKey = SwitchArea._correctSelectedKey(opt1);
        expect(selectedKey).toEqual(0);
        expect(Logger.error).toHaveBeenCalledTimes(0);

        selectedKey = SwitchArea._correctSelectedKey(opt2);
        expect(selectedKey).toEqual('1');
        expect(Logger.error).toHaveBeenCalledWith(
            'SwitchableArea: Incorrect selectedKey',
            SwitchArea
        );
    });
});
