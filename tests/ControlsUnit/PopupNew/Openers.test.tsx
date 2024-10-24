/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode, render } from 'react-dom';
import { ContainerForTest } from 'Controls/_popup/Popup/Container';
import { StackOpener, DialogOpener } from 'Controls/popup';

function PopupTemplate() {
    return <div></div>;
}

describe('Controls/popup', () => {
    describe('Openers', () => {
        let container: HTMLElement | null = null;

        beforeEach(() => {
            container = document.createElement('div');
            document.body.appendChild(container);
            render(<ContainerForTest />, container);
        });
        afterEach(() => {
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
