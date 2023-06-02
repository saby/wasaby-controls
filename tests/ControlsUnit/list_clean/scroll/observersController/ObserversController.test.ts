import jsdom = require('jsdom');
const { JSDOM } = jsdom;

import { ObserversController } from 'Controls/_baseList/Controllers/ScrollController/ObserverController/ObserversController';
import {
    getCollection,
    getListControl,
    getScrollContainerWithList,
    ListContainerUniqueClass,
    TriggerClass,
} from 'ControlsUnit/list_clean/scroll/DomUtils';

const DEFAULT_TRIGGERS_OFFSET_COEFF = 1 / 3;

describe('Controls/_baseList/Controllers/ObserversController', () => {
    let listContainer: HTMLElement;
    let triggers: HTMLElement[];

    let oldWindow;

    const isNode = typeof document === 'undefined';

    before(() => {
        if (isNode) {
            oldWindow = window;
            window = new JSDOM('').window;
        }
    });

    after(() => {
        if (isNode) {
            window = oldWindow;
        }
    });

    beforeEach(() => {
        const collection = getCollection([{ key: 1 }]);
        const scrollContainer = getScrollContainerWithList(collection);
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;
        triggers = Array.from(
            listContainer.querySelectorAll(`.${TriggerClass}`)
        ) as HTMLElement[];
    });

    it('should apply offsets to triggers', () => {
        const controller = new ObserversController({
            listContainer,
            listControl: getListControl(),
            triggersQuerySelector: `.${TriggerClass}`,
            triggersPositions: { backward: 'offset', forward: 'offset' },
            triggersVisibility: { backward: true, forward: true },
            triggersOffsetCoefficients: {
                backward: DEFAULT_TRIGGERS_OFFSET_COEFF,
                forward: DEFAULT_TRIGGERS_OFFSET_COEFF,
            },
            additionalTriggersOffsets: { backward: 0, forward: 0 },
            observersCallback: jest.fn(),
            viewportSize: 300,
            contentSize: 1000,
            scrollPosition: 0,
        });

        expect(triggers[0].style.top).toEqual('100px');
        expect(triggers[0].style.bottom).toEqual('');
        expect(triggers[1].style.top).toEqual('');
        expect(triggers[1].style.bottom).toEqual('100px');
    });
});
