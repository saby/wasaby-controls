/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode, render } from 'react-dom';
import { ContainerForTest } from 'Controls/_popup/Popup/Container';
import { StackOpener, DialogOpener } from 'Controls/popup';
import { Controller as PopupController } from 'Controls/popupTemplateStrategy';
import { act } from 'react-dom/test-utils';

function PopupTemplate() {
    return <div></div>;
}

// TODO:
PopupTemplate.isReact = true;

describe('Controls/popup', () => {
    describe('Openers', () => {
        let container = null;
        let Controller;

        const initContainer = async () => {
            let control;
            await act(async () => {
                render(
                    <ContainerForTest
                        ref={(instance) => {
                            control = instance;
                        }}
                    />,
                    container
                );
            });
            let afterMountPromiseResolver;
            let afterMountPromise = new Promise((resolve) => {
                afterMountPromiseResolver = resolve;
            });
            const controlAfterMount = control._afterMount.bind(control);
            control._afterMount = () => {
                controlAfterMount();
                afterMountPromiseResolver();
            };

            if (control._mounted) {
                afterMountPromise = Promise.resolve();
            }

            await afterMountPromise;
        };

        beforeEach(async () => {
            Controller = new PopupController();
            Controller.init();
            jest.spyOn(Controller, '_logTemplateName').mockImplementation();
            container = document.createElement('div');
            document.body.appendChild(container);
            await initContainer();
        });
        afterEach(() => {
            Controller.destroy();
            Controller = null;
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        });

        test('Dialog: should open and close popup', async () => {
            await new Promise(async (resolve) => {
                const opener = new DialogOpener();
                await opener.open({
                    template: PopupTemplate,
                    // Передадим id сами, для того чтобы снепшот корректно работал
                    id: 'popup-123',
                    eventHandlers: {
                        onClose: () => {
                            expect(container.childNodes[0].childElementCount).toBe(0);
                            resolve();
                        },
                    },
                });
                expect(container.childNodes[0].childElementCount).toBe(1);
                expect(container).toMatchSnapshot();
                opener.close();
            });
        });

        test('Stack: should open and close popup', async () => {
            await new Promise(async (resolve) => {
                const opener = new StackOpener();
                await opener.open({
                    template: PopupTemplate,
                    // Передадим id сами, для того чтобы снепшот корректно работал
                    id: 'popup-123',
                    eventHandlers: {
                        onClose: () => {
                            expect(container.childNodes[0].childElementCount).toBe(0);
                            resolve();
                        },
                    },
                });
                expect(container.childNodes[0].childElementCount).toBe(1);
                expect(container).toMatchSnapshot();
                opener.close();
            });
        });

        test('should return correct isOpened state', async () => {
            await new Promise(async (resolve) => {
                const opener = new StackOpener();
                expect(opener.isOpened()).toBeFalsy();
                await opener.open({
                    template: PopupTemplate,
                    eventHandlers: {
                        onClose: () => {
                            expect(opener.isOpened()).toBeFalsy();
                            resolve();
                        },
                    },
                });
                expect(opener.isOpened()).toBeTruthy();
                opener.close();
            });
        });
    });
});
