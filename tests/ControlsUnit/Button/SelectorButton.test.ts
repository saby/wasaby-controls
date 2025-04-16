// @ts-ignore
import * as Clone from 'Core/core-clone';
import SelectorButton, { ISelectorButtonOptions } from 'Controls/_lookup/Button';

interface ITestOptions extends ISelectorButtonOptions {
    multiSelect: boolean;
    keyProperty: string;
    displayProperty: string;
    caption: string;
    maxVisibleItems: number;
    readOnly?: boolean;
}

describe('Controls/_lookup/Button/', (): void => {
    const config: ITestOptions = {
        ...SelectorButton.getDefaultOptions(),
        multiSelect: true,
        keyProperty: 'id',
        displayProperty: 'title',
        caption: 'Выберите запись',
        maxVisibleItems: 2,
    };

    const getButton = (cfg: ITestOptions): SelectorButton => {
        const selButton: SelectorButton = new SelectorButton(cfg);
        selButton.saveOptions(cfg);
        return selButton;
    };

    const setTrue = (): void => {
        expect(true).toEqual(true);
    };

    it('_itemClickHandler check open selector', async (): Promise<void> => {
        let isShowSelector: boolean = false;
        const singleConfig: ITestOptions = Clone(config);

        singleConfig.multiSelect = false;
        singleConfig.readOnly = true;

        const button = getButton(singleConfig);

        // @ts-ignore
        button._notify = (eventName: string) => {
            if (eventName === 'showSelector') {
                isShowSelector = true;
            }
        };
        // @ts-ignore
        button._children = { selectorOpener: { open: jest.fn() } };
        // @ts-ignore
        button._itemClickHandler();
        expect(isShowSelector).toBe(false);

        // @ts-ignore
        button._options.readOnly = false;
        // @ts-ignore
        await button._itemClickHandler();
        expect(isShowSelector).toBe(true);
    });

    it('_itemClickHandler check notify itemClick', (): void => {
        const button = getButton(config);
        const item: object = { id: 1 };
        let dataItemClick: object[] = null;

        // @ts-ignore
        button._notify = (eventName: string, data: object[]) => {
            if (eventName === 'itemClick') {
                dataItemClick = data;
            }
        };
        // @ts-ignore
        button._itemClickHandler(null, item);
        expect(dataItemClick[0]).toEqual(item);

        dataItemClick = null;
        // @ts-ignore
        button._options.readOnly = true;
        // @ts-ignore
        button._itemClickHandler(null, item);
        expect(dataItemClick[0]).toEqual(item);
    });
});
