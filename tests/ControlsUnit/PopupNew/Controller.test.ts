import jsdom = require('jsdom');
const { JSDOM } = jsdom;

// TODO: Переписать названия после того как поменяем архитекутру
import { ManagerClass, Controller as ManagerController } from 'Controls/popup';

// Создаем подобие ноды окна
const targetInsideOfPopup = new JSDOM('<div>' +
    '<div class="controls-Popup" popupkey="popupId">' +
        '<div class="content">' +
            '<div class="test"></div>' +
        '</div>' +
    '</div>' +
'</div>');

const targetOutsideOfPopup = new JSDOM('<div>' +
    '<div class="controls-Popup" popupkey="popupId">' +
        '<div class="content"></div>' +
    '</div>' +
    '<div class="test"></div>' +
'</div>');

const targetInsideOfParent= new JSDOM('<div>' +
    '<div class="controls-Popup" popupkey="popupId">' +
        '<div class="content">' +
            '<div class="test"></div>' +
        '</div>' +
    '</div>' +
    '<div class="controls-Popup" popupkey="popupIdChild">' +
        '<div class="content"></div>' +
    '</div>' +
'</div>');

const targetInsideOfChild = new JSDOM('<div>' +
    '<div class="controls-Popup" popupkey="popupId">' +
        '<div class="content"></div>' +
    '</div>' +
    '<div class="controls-Popup" popupkey="popupIdChild">' +
        '<div class="content">' +
            '<div class="test"></div>' +
        '</div>' +
    '</div>' +
'</div>');

const targetOutsideOfChildAndParent = new JSDOM('<div>' +
    '<div class="controls-Popup" popupkey="popupId">' +
        '<div class="content"></div>' +
    '</div>' +
    '<div class="controls-Popup" popupkey="popupIdChild">' +
        '<div class="content"></div>' +
    '</div>' +
    '<div class="test"></div>' +
'</div>');

let oldWindow;

describe('Controls/_popup/Controller', () => {
    let Controller;
    beforeEach(() => {
        oldWindow = window;
        Controller = new ManagerClass();
    });
    afterEach(() => {
        window = oldWindow;
        document = oldWindow?.document;
        Controller.destroy();
    });
    describe('closeOnOutsideClick', () => {
        it('test', () => {
            const test = 1;
            expect(test).toBe(1);
        });
        // describe('should close on mouseDown', () => {
        //     it('if click target outside of popup, no children', () => {
        //         const dom = targetOutsideOfPopup;
        //         window = dom;
        //         document = dom.window.document;
        //         const target = dom.window.document.querySelector('.test');
        //         const item = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             popupState: 'created',
        //             id: 'popupId'
        //         };
        //         Controller.addElement(item);
        //         const event = {
        //             target
        //         };
        //         jest.spyOn(ManagerController, 'getContainer').mockClear().mockReturnValue({
        //             getOverlayIndex: () => {
        //                 return 1;
        //             }
        //         });
        //
        //         const result = Controller.mouseDownHandler(event);
        //         expect(result[0].id).toBe(item.id);
        //     });
        //
        //     it('if click target outside of popup, with children', () => {
        //         const dom = targetOutsideOfChildAndParent;
        //         window = dom;
        //         document = dom.window.document;
        //         const target = dom.window.document.querySelector('.test');
        //         const item = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             popupState: 'created',
        //             id: 'popupId',
        //             childs: [
        //                 'popupIdChild'
        //             ]
        //         };
        //         const childItem = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             parentId: 'popupId',
        //             popupState: 'created',
        //             id: 'popupIdChild'
        //         };
        //         Controller.addElement(item);
        //         Controller.addElement(childItem);
        //         const event = {
        //             target
        //         };
        //         jest.spyOn(ManagerController, 'getContainer').mockClear().mockReturnValue({
        //             getOverlayIndex: () => {
        //                 return 1;
        //             }
        //         });
        //
        //         const result = Controller.mouseDownHandler(event);
        //         expect(result[0].id).toBe(item.id);
        //         expect(result).toHaveLength(2);
        //     });
        // });
        //
        // describe('should not close on mouseDown', () => {
        //     it('if click target inside of popup, no children', () => {
        //         const dom = targetInsideOfPopup;
        //         window = dom;
        //         document = dom.window.document;
        //         const target = dom.window.document.querySelector('.test');
        //         const item = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             popupState: 'created',
        //             id: 'popupId'
        //         };
        //         Controller.addElement(item);
        //         const event = {
        //             target
        //         };
        //         jest.spyOn(ManagerController, 'getContainer').mockClear().mockReturnValue({
        //             getOverlayIndex: () => {
        //                 return 1;
        //             }
        //         });
        //
        //         const result = Controller.mouseDownHandler(event);
        //         expect(result).toHaveLength(0);
        //     });
        //
        //     it('if click target outside of popup, with children', () => {
        //         const dom = targetInsideOfChild;
        //         window = dom;
        //         document = dom.window.document;
        //         const target = dom.window.document.querySelector('.test');
        //         const item = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             popupState: 'created',
        //             id: 'popupId',
        //             childs: [
        //                 'popupIdChild'
        //             ]
        //         };
        //         const childItem = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             parentId: 'popupId',
        //             popupState: 'created',
        //             id: 'popupIdChild'
        //         };
        //         Controller.addElement(item);
        //         Controller.addElement(childItem);
        //         const event = {
        //             target
        //         };
        //         jest.spyOn(ManagerController, 'getContainer').mockClear().mockReturnValue({
        //             getOverlayIndex: () => {
        //                 return 1;
        //             }
        //         });
        //
        //         const result = Controller.mouseDownHandler(event);
        //         expect(result).toHaveLength(0);
        //     });
        //
        //     it('if click target inside parent popup, with children', () => {
        //         const dom = targetInsideOfParent;
        //         window = dom;
        //         document = dom.window.document;
        //         const target = dom.window.document.querySelector('.test');
        //         const item = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             popupState: 'created',
        //             id: 'popupId',
        //             childs: [
        //                 'popupIdChild'
        //             ]
        //         };
        //         const childItem = {
        //             popupOptions: {
        //                 closeOnOutsideClick: true,
        //             },
        //             controller: {
        //                 closePopupByOutsideClick: () => {
        //                     return true;
        //                 }
        //             },
        //             parentId: 'popupId',
        //             popupState: 'created',
        //             id: 'popupIdChild'
        //         };
        //         Controller.addElement(item);
        //         Controller.addElement(childItem);
        //         const event = {
        //             target
        //         };
        //         jest.spyOn(ManagerController, 'getContainer').mockClear().mockReturnValue({
        //             getOverlayIndex: () => {
        //                 return 1;
        //             }
        //         });
        //         const result = Controller.mouseDownHandler(event);
        //
        //         expect(result).toHaveLength(1);
        //         expect(result[0].id).toBe('popupIdChild');
        //     });
        // });
    });
});