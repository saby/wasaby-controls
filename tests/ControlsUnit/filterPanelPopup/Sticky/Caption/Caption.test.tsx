/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { Sticky } from 'Controls/filterPanelPopup';
import { TFilterItemViewMode } from 'Controls/filter';
import { render } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import 'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests';

function getPanel(container: HTMLElement): HTMLElement {
    return container.querySelector('.controls-FilterViewPanel');
}

describe('Controls/filterPanelPopup:Sticky caption tests', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });
    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    describe('Тест меток редакторов', () => {
        it('Метки в блоке "Отбираются", редактор с меткой и редактор без метки', () => {
            const filterDescription = [
                {
                    name: 'withoutCaption',
                    viewMode: 'basic' as TFilterItemViewMode,
                    value: [null],
                    resetValue: [null],
                    editorTemplateName:
                        'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                },
                {
                    name: 'withCaption',
                    caption: 'Метка',
                    viewMode: 'basic' as TFilterItemViewMode,
                    value: [null],
                    resetValue: [null],
                    editorTemplateName:
                        'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                },
            ];

            render(<Sticky items={filterDescription} />, { container });
            expect(getPanel(container)).toMatchSnapshot();
        });

        it('Метка в блоке "Еще можно отобрать"', () => {
            const filterDescription = [
                {
                    name: 'withCaption',
                    extendedCaption: 'Метка',
                    viewMode: 'extended' as TFilterItemViewMode,
                    value: [null],
                    resetValue: [null],
                    editorTemplateName:
                        'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                },
            ];

            render(<Sticky items={filterDescription} />, { container });
            expect(getPanel(container)).toMatchSnapshot();
        });

        describe('Разный текст метки при переходе из блока "Еще можно отобрать" в блок "Отбираются"', () => {
            it('Редактор в блоке "Отбираются"', () => {
                const filterDescription = [
                    {
                        name: 'withCaption',
                        caption: 'Метка для блока "Отбираются"',
                        extendedCaption: 'Метка для блока "Ещё можно отобрать"',
                        viewMode: 'basic' as TFilterItemViewMode,
                        value: [null],
                        resetValue: ['test'],
                        editorTemplateName:
                            'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                    },
                ];

                render(<Sticky items={filterDescription} />, { container });
                expect(getPanel(container)).toMatchSnapshot();
            });
            it('Редактор в блоке "Ещё можно отобрать"', () => {
                const filterDescription = [
                    {
                        name: 'withCaption',
                        caption: 'Метка для блока "Отбираются"',
                        extendedCaption: 'Метка для блока "Ещё можно отобрать"',
                        viewMode: 'extended' as TFilterItemViewMode,
                        value: [null],
                        resetValue: [null],
                        editorTemplateName:
                            'ControlsUnit/filterPanelPopup/Sticky/EmptyEditorForTests',
                    },
                ];

                render(<Sticky items={filterDescription} />, { container });
                expect(getPanel(container)).toMatchSnapshot();
            });
        });
    });
});
