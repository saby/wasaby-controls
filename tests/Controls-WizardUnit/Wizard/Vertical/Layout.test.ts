import { IVerticalItem, Layout } from 'Controls-Wizard/vertical';
import { getProxyClass } from 'ControlsUnit/Utils/ProxyClass';

describe('Controls-Wizard/vertical:Layout', () => {
    describe('_updateMarkerSize', () => {
        const getItems = (count: number): IVerticalItem[] => {
            const items: IVerticalItem[] = [];
            for (let i = 0; i < count; i++) {
                items.push({ title: i.toString(), contentTemplate: '' });
            }
            return items;
        };

        [
            {
                itemsCount: 1,
                markerSize: 'default',
                result: 's',
            },
            {
                itemsCount: 9,
                markerSize: 'default',
                result: 's',
            },
            {
                itemsCount: 10,
                markerSize: 'default',
                result: 'm',
            },
            {
                itemsCount: 1,
                markerSize: 'm',
                result: 'm',
            },
            {
                itemsCount: 9,
                markerSize: 'm',
                result: 'm',
            },
            {
                itemsCount: 10,
                markerSize: 's',
                result: 's',
            },
        ].forEach((test) => {
            it(`should set ${test.result} marker. ${test.itemsCount}, ${test.markerSize}`, () => {
                const component = getProxyClass(Layout);
                component.proxy('_updateMarkerSize', {
                    items: getItems(test.itemsCount),
                    selectedStepIndex: 0,
                    markerSize: test.markerSize,
                });
                expect(component.proxyState('_markerSize')).toEqual(test.result);
            });
        });
    });
});
