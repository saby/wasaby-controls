import { InputHelper as BaseInputHelper } from 'Controls/editInPlace';
import type { Model } from 'Types/entity';

class InputActivationHelper extends BaseInputHelper {
    _tryActivateByEditingTargetClick(beforeFocus?: (target: HTMLElement) => void): boolean {
        return super._tryActivateByEditingTargetClick(beforeFocus);
    }

    _tryActivateByInputClick(beforeFocus?: (target: HTMLElement) => void): boolean {
        return super._tryActivateByInputClick(beforeFocus);
    }

    _activateDomElement(element: HTMLElement): boolean {
        throw Error('Method must be mocked in each test!');
    }
}

describe('Controls/editInPlace:InputActivationHelper', () => {
    let helper: InputActivationHelper;

    function initActivationHelper(params?: { itemsContainerClass: string; isReact: boolean }) {
        helper = new InputActivationHelper(params);
        const container = {
            querySelector: () => {
                return {};
            },
            children: [
                {
                    children: [{}, {}],
                },
                {
                    children: [{}, {}],
                },
            ],
        };
        // Заказываем активацию, происходит при любом старте редактирования и является
        // последней по приоритету, вызывается тогда, когда не смогли активировать
        // поля ввода "по-умному". Активирует первое поле ввода в строке.
        helper.shouldActivate();

        // Заказываем активацию по клику.
        helper.setClickInfo({} as MouseEvent, {} as Model);
        helper.setEditingTarget(
            {} as Model,
            {
                closest: (selector) => {
                    if (selector === '.controls-GridViewV__itemsContainer') {
                        return container;
                    } else if (
                        selector === '.controls-Grid__row' ||
                        selector === '.controls-GridReact__row'
                    ) {
                        return container.children[0];
                    } else if (
                        selector === '.controls-Grid__row-cell' ||
                        selector === '.controls-GridReact__cell'
                    ) {
                        return container.children[0].children[0];
                    }
                },
            } as HTMLElement
        );
    }

    // Проверяем, что если не получилось активировать инпут по которому кликнули,
    // то будет совершена попытка активировать ближайшее поле ввода.
    it('Closest input in editable area activation', () => {
        initActivationHelper();
        let isDomElementActivated = false;

        // Не получилось активировать инпут по которому кликнули.
        jest.spyOn(helper, '_tryActivateByInputClick').mockClear().mockReturnValue(false);

        // mock платформенного метода активации, работает по DOM.
        jest.spyOn(helper, '_activateDomElement')
            .mockClear()
            .mockImplementation(() => {
                isDomElementActivated = true;
                return true;
            });

        // Сама активация после асинхронного старта редактирования.
        helper.activateInput(() => {
            // Не должна случиться активация первого поля ввода в строке, если активировали ближайшее поле ввода.
            throw Error(
                'activateRowCallback should not be called if nearest input was activated! ' +
                    'See comment in method InputActivationHelper:activateInput.'
            );
        });

        expect(isDomElementActivated).toBe(true);
    });

    describe('Activation with react', () => {
        beforeEach(() => {
            initActivationHelper({
                isReact: true,
                itemsContainerClass: 'controls-GridViewV__itemsContainer',
            });
        });

        it('activateInput with beforeFocusCallback', () => {
            // Не получилось активировать инпут по которому кликнули.
            jest.spyOn(helper, '_tryActivateByInputClick').mockClear().mockReturnValue(false);
            // Не активировали ближайшее поле
            const spyActivateDomElement = jest
                .spyOn(helper, '_activateDomElement')
                .mockClear()
                .mockReturnValue(false);
            const activateRowCallback = jest.fn();
            const beforeFocusCallback = jest.fn();

            helper.activateInput(activateRowCallback, beforeFocusCallback);
            expect(beforeFocusCallback).toHaveBeenCalled();
            expect(spyActivateDomElement).toHaveBeenCalled();
        });

        it('activateInput without beforeFocusCallback', () => {
            // Не получилось активировать инпут по которому кликнули.
            jest.spyOn(helper, '_tryActivateByInputClick').mockClear().mockReturnValue(false);
            // Не активировали ближайшее поле
            const spyActivateDomElement = jest
                .spyOn(helper, '_activateDomElement')
                .mockClear()
                .mockReturnValue(false);
            const activateRowCallback = jest.fn();

            helper.activateInput(activateRowCallback);
            expect(spyActivateDomElement).toHaveBeenCalled();
        });
    });
});
