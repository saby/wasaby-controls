import { showSelector } from 'Controls/lookup';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { Dialog, Stack, StackOpener, DialogOpener } from 'Controls/popup';
import { Input } from 'Controls/lookup';

describe('Controls/_lookup/showSelector', () => {
    let lastPopupOptions;
    let isShowSelector = false;

    const getBaseController = (options = {}): Input => {
        const defaultOptions = {
            items: new RecordSet(),
            selectedKeys: [],
            source: new Memory(),
            selectorTemplate: {
                templateOptions: {
                    selectedTab: 'defaultTab',
                },
                popupOptions: {
                    width: 100,
                },
            },
        };
        const lookupOptions = { ...defaultOptions, ...options };
        const baseController = new Input(lookupOptions);

        baseController._beforeMount(lookupOptions);
        baseController.saveOptions(lookupOptions);

        baseController._opener = {
            open: (popupOptions) => {
                isShowSelector = true;
                lastPopupOptions = popupOptions;
                return Promise.resolve();
            },
            close: jest.fn(),
        };

        return baseController;
    };

    it('showSelector without params', () => {
        const baseController = getBaseController();

        showSelector(baseController);
        expect(isShowSelector).toBeTruthy();
        expect(lastPopupOptions.templateOptions.selectedTab).toEqual(
            'defaultTab'
        );
        expect(lastPopupOptions.width).toEqual(100);
        expect(lastPopupOptions.opener).toEqual(baseController);
        expect(lastPopupOptions.multiSelect).toEqual(undefined);
    });

    it('showSelector with templateOptions', () => {
        const baseController = getBaseController({ selectedKeys: ['test'] });
        baseController._options.selectorTemplate.templateOptions = {};
        isShowSelector = false;
        showSelector(baseController, {
            templateOptions: {
                selectedTab: 'Employees',
                selectedKeys: [],
            },
        });
        expect(isShowSelector).toBeTruthy();
        expect(lastPopupOptions.templateOptions.selectedTab).toEqual(
            'Employees'
        );
        expect(lastPopupOptions.templateOptions.selectedKeys).toEqual([]);
        expect(lastPopupOptions.width).toEqual(100);
        expect(lastPopupOptions.opener).toEqual(baseController);
    });

    it('showSelector with popupOptions', () => {
        const baseController = getBaseController();
        isShowSelector = false;
        showSelector(baseController, {
            width: 50,
            height: 20,
        });
        expect(isShowSelector).toBeTruthy();
        expect(lastPopupOptions.width).toEqual(50);
        expect(lastPopupOptions.height).toEqual(20);
        expect(lastPopupOptions.opener).toEqual(baseController);
    });

    it('showSelector with handlers on templateOptions', () => {
        const baseController = getBaseController();
        baseController._options.selectorTemplate = {
            templateOptions: {
                handlers: {
                    onTestAction: jest.fn(),
                },
            },
        };
        showSelector(baseController, {});

        expect(
            typeof lastPopupOptions.templateOptions.handlers
                .onSelectComplete === 'function'
        ).toBeTruthy();
        expect(
            typeof lastPopupOptions.templateOptions.handlers.onTestAction ===
                'function'
        ).toBeTruthy();
    });

    it('showSelector with multiSelect', () => {
        const baseController = getBaseController();
        let selectCompleted = false;
        let selectorClosed = false;

        baseController._selectCallback = () => {
            selectCompleted = true;
        };
        jest.spyOn(Stack, 'closePopup')
            .mockClear()
            .mockImplementation(() => {
                selectorClosed = true;
                expect(!selectCompleted).toBeTruthy();
            });
        baseController._options.isCompoundTemplate = true;

        showSelector(baseController, undefined, true);
        lastPopupOptions.templateOptions.handlers.onSelectComplete();
    });

    it('showSelector notify selector close', () => {
        const baseController = getBaseController();
        let selectorCloseNotified = false;
        baseController._closeHandler = jest.fn();
        baseController.notify = (eventName) => {
            if (eventName === 'selectorClose') {
                selectorCloseNotified = true;
            }
        };
        showSelector(baseController, undefined, true);
        lastPopupOptions.eventHandlers.onClose();
        expect(!selectorCloseNotified).toBeTruthy();
    });

    it('showSelector with isCompoundTemplate:false', () => {
        const baseController = getBaseController();
        const stub = jest
            .spyOn(baseController, '_selectCallback')
            .mockClear()
            .mockImplementation();
        jest.spyOn(Stack, 'closePopup').mockClear().mockImplementation();
        baseController._options.isCompoundTemplate = false;
        showSelector(baseController, undefined, true);
        lastPopupOptions.templateOptions.handlers.onSelectComplete();

        expect(stub).not.toHaveBeenCalled();
    });

    it('opening showSelector', () => {
        const baseController = getBaseController();
        isShowSelector = false;
        showSelector(baseController, {});
        expect(isShowSelector).toBeTruthy();
    });

    it('showSelector without selectorTemplate', () => {
        const baseController = getBaseController();
        baseController._options.selectorTemplate = null;

        expect(showSelector(baseController, {})).toBeTruthy();
    });

    it('showSelector without selectorTemplate and popupOptions template', () => {
        const baseController = getBaseController();
        baseController._options.selectorTemplate = null;
        showSelector(baseController, {});
    });

    it('showSelector without selectorTemplate and with popupOptions template', () => {
        const baseController = getBaseController();
        baseController._options.selectorTemplate = null;
        showSelector(baseController, {
            template: 'testTemplate',
        });
        expect(lastPopupOptions.template).toEqual('testTemplate');
    });

    it('showSelector with selectorTemplate', () => {
        const baseController = getBaseController();
        baseController._options.selectorTemplate = {
            templateName: 'selectorTemplate',
            templateOptions: {
                searchValue: 'testValue',
            },
        };
        showSelector(baseController, {
            templateOptions: {
                searchValue: '',
            },
        });
        expect(lastPopupOptions.template).toEqual('selectorTemplate');
        expect(lastPopupOptions.templateOptions.searchValue).toEqual('');
    });
});
