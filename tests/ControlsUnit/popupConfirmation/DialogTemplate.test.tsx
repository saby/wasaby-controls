/**
 * @jest-environment jsdom
 */

import { unmountComponentAtNode } from 'react-dom';
import { render } from '@testing-library/react';
import 'Controls/markup';
import { DialogTemplate } from 'Controls/popupConfirmation';
describe('Controls/_popupConfirmation/Opener/Dialog', () => {
    let container: HTMLElement;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        container.remove();
        jest.restoreAllMocks();
    });
    it('Корректно рисуется сообщениие с ссылкой', () => {
        render(
            <DialogTemplate
                message={'Текст сообщения содержит<a href="https://ya.ru">ссылку</a>.'}
            />,
            { container }
        );
        expect(container).toMatchSnapshot();
    });
});
