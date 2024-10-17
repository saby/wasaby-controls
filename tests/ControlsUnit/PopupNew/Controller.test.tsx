/**
 * @jest-environment jsdom
 */
import { ContainerForTest, StackOpener } from 'Controls/popup';
import StackController from 'Controls/_popupTemplateStrategy/Stack/StackController';
import { waitFor } from '@testing-library/react';

import { Controller as GlobalController } from 'Controls/popup';
import { Controller as PopupController } from 'Controls/popupTemplateStrategy';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

function PopupTemplate(props) {
    return (
        <div>
            <div className="inside-area"></div>
            {props.testField ? (
                <div className={'test-field-container'}>{props.testField}</div>
            ) : null}
        </div>
    );
}

describe('Controls/_popup/Controller', () => {
    let container = null;
    let Controller = null;

    beforeEach(() => {
        Controller = new PopupController();
        Controller.init();
        jest.spyOn(Controller, '_logTemplateName').mockImplementation();
        container = document.createElement('div');
        document.body.appendChild(container);
        render(<ContainerForTest />, container);
    });
    afterEach(() => {
        Controller.destroy();
        Controller = null;
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    describe('show', () => {
        test('should return new popup id and add it in stack', () => {
            jest.spyOn(GlobalController, 'getContainer').mockReturnValue({
                setPopupItems: () => {
                    return Promise.resolve();
                },
            });
            const result = Controller.show({}, StackController);
            expect(result.indexOf('popup-') !== -1).toBeTruthy();
            expect(Controller.getPopupItems().getCount()).toBe(1);
        });

        test('should return old popup id and do not add it to stack again, if item already exists', async () => {
            const opener = new StackOpener();
            const firstCallPopupId = await opener.open({
                template: PopupTemplate,
            });
            const secondCallPopupId = await opener.open({
                template: PopupTemplate,
            });
            expect(firstCallPopupId).toBe(secondCallPopupId);
            expect(Controller.getPopupItems().getCount()).toBe(1);
        });
    });

    describe('remove', () => {
        test('should close popup', async () => {
            const popupId = await new StackOpener().open({ template: PopupTemplate });
            expect(Controller.getPopupItems().getCount()).toBe(1);
            await Controller.remove(popupId);
            expect(Controller.getPopupItems().getCount()).toBe(0);
        });

        test('should close popup width children', async () => {
            const parentOpener = new StackOpener({
                template: PopupTemplate,
            });
            const parentPopupId = await parentOpener.open({});
            expect(Controller.getPopupItems().getCount()).toBe(1);
            const childPopup = new StackOpener({
                template: PopupTemplate,
                opener: document.body.querySelector('.inside-area'),
            });
            await childPopup.open({});
            expect(Controller.getPopupItems().getCount()).toBe(2);
            await Controller.remove(parentPopupId);
            expect(Controller.getPopupItems().getCount()).toBe(0);
        });
    });

    describe('update', () => {
        test('should update popup options and return id', async () => {
            const popupId = await new StackOpener().open({
                template: PopupTemplate,
                templateOptions: { testField: 'beforeUpdate' },
            });
            expect(container.textContent).toBe('beforeUpdate');
            const popupItem = Controller.find(popupId);
            const updatedPopupId = Controller.update(popupId, {
                ...popupItem.popupOptions,
                autofocus: false,
                templateOptions: {
                    testField: 'afterUpdate',
                },
            });
            expect(updatedPopupId).toBe(popupId);
            await waitFor(() => {
                expect(container.textContent).toBe('afterUpdate');
            });
        });

        test('should not update popup options and not return id if item does not exist', () => {
            const result = Controller.update('popup-123', {});
            expect(result).toBe(null);
            expect(Controller.getPopupItems().getCount()).toBe(0);
        });
    });

    describe('closeOnOutsideClick', () => {
        describe('should close on mouseDown', () => {
            test('if click target outside of popup, no children', async () => {
                await new Promise(async (resolve) => {
                    const opener = new StackOpener();
                    await opener.open({
                        template: PopupTemplate,
                        closeOnOutsideClick: true,
                        eventHandlers: {
                            onClose: () => {
                                expect(container.childNodes[0].childElementCount).toBe(0);
                                resolve();
                            },
                        },
                    });
                    const elementOutsideOfPopup = document.createElement('div');
                    elementOutsideOfPopup.className = 'outside-area';
                    document.body.appendChild(elementOutsideOfPopup);
                    const event = {
                        target: document.querySelector('.outside-area'),
                    };
                    expect(container.childNodes[0].childElementCount).toBe(1);
                    Controller.mouseDownHandler(event);
                });
            });
            test('if click target outside of popup, with children', async () => {
                await new Promise(async (resolve) => {
                    const opener = new StackOpener();
                    await opener.open({
                        template: PopupTemplate,
                        closeOnOutsideClick: true,
                        eventHandlers: {
                            onClose: () => {
                                expect(container.childNodes[0].childElementCount).toBe(0);
                                resolve();
                            },
                        },
                    });
                    const elementOutsideOfPopup = document.createElement('div');
                    elementOutsideOfPopup.className = 'outside-area';
                    document.body.appendChild(elementOutsideOfPopup);
                    const event = {
                        target: document.querySelector('.outside-area'),
                    };
                    expect(container.childNodes[0].childElementCount).toBe(1);
                    const logicOpener = document.querySelector('.inside-area');
                    const childOpener = new StackOpener();
                    await childOpener.open({
                        template: PopupTemplate,
                        opener: logicOpener,
                        closeOnOutsideClick: true,
                    });
                    expect(container.childNodes[0].childElementCount).toBe(2);
                    Controller.mouseDownHandler(event);
                });
            });
        });

        describe('should not close on mouseDown', () => {
            test('if click target inside of popup, no children', async () => {
                const opener = new StackOpener();
                await opener.open({
                    template: PopupTemplate,
                    closeOnOutsideClick: true,
                });
                const event = {
                    target: document.querySelector('.inside-area'),
                };
                expect(container.childNodes[0].childElementCount).toBe(1);
                const result = Controller.mouseDownHandler(event);
                expect(result).toHaveLength(0);
            });
            test('if click target inside of parent popup, with children', async () => {
                const opener = new StackOpener();
                await opener.open({
                    template: PopupTemplate,
                    closeOnOutsideClick: true,
                });
                expect(container.childNodes[0].childElementCount).toBe(1);
                const logicOpener = document.querySelector('.inside-area');
                const childOpener = new StackOpener();
                await childOpener.open({
                    template: PopupTemplate,
                    opener: logicOpener,
                    closeOnOutsideClick: true,
                });
                expect(container.childNodes[0].childElementCount).toBe(2);
                const event = {
                    target: document.querySelector('.inside-area'),
                };
                const result = Controller.mouseDownHandler(event);
                expect(result).toHaveLength(1);
            });

            test('if click target inside children popup, with children', async () => {
                const opener = new StackOpener();
                await opener.open({
                    template: PopupTemplate,
                    closeOnOutsideClick: true,
                });
                expect(container.childNodes[0].childElementCount).toBe(1);
                const logicOpener = document.querySelector('.inside-area');
                const childOpener = new StackOpener();
                await childOpener.open({
                    template: PopupTemplate,
                    opener: logicOpener,
                    closeOnOutsideClick: true,
                });
                expect(container.childNodes[0].childElementCount).toBe(2);
                const event = {
                    target: document.querySelectorAll('.inside-area')[1],
                };
                const result = Controller.mouseDownHandler(event);
                expect(result).toHaveLength(0);
            });
        });
    });
});
