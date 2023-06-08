import BaseElement from '../BaseElement';
import BaseList, { ItemSelector } from '../BaseList';

type ActionSelector =
    | {
          /**
           * Номер элемента, нумерация с 1.
           */
          index?: number;
      }
    | {
          /**
           * Точный текст атрибута title.
           */
          title?: string;
      }
    | {
          /**
           * Класс иконки.
           */
          iconClass?: string;
      };

export interface IEditOptions {
    /**
     * Текст, который нужно ввести.
     */
    newText?: string;
    /**
     * Завершать редактирование.
     */
    commit?: boolean;
    /**
     * Каким образом завершать редактирование (true - нажатием на галочку, false - Enter).
     */
    applyButton?: boolean;
    /**
     * Очищать текущее значение перед вводом нового
     */
    clearValue?: boolean;
}

/**
 * Плоский список.
 * @author Зайцев А.С.
 */
export default class ListView extends BaseElement {
    private _itemsList: BaseList;
    private _groupsList: BaseList;
    constructor(
        listSelector: string = '.controls-ListViewV',
        itemsSelector: string = 'data-qa="item"'
    ) {
        super(listSelector);
        this._itemsList = new BaseList(itemsSelector);
        this._groupsList = new BaseList('data-qa="group"');
    }

    item(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        return this._itemsList.item(selector);
    }

    items(): ReturnType<WebdriverIO.Browser['$$']> {
        return this._itemsList.items();
    }

    marker(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        return this.item(selector).$('[data-qa="marker"]');
    }

    checkbox(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        return this.item(selector).$('.controls-CheckboxMarker');
    }

    editor(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$(
            '.controls-EditingTemplateText__editor input'
        );
    }

    applyButton(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('.controls-EditableArea__applyButton');
    }

    cancelEditingButton(): ReturnType<WebdriverIO.Browser['$']> {
        return this.container().$('.controls-EditableArea__closeButton');
    }

    paging(): ReturnType<WebdriverIO.Browser['$']> {
        return $('.controls-PagingV');
    }

    group(selector: ItemSelector): ReturnType<WebdriverIO.Browser['$']> {
        return this._groupsList.item(selector);
    }

    async collapseGroup(selector: ItemSelector): Promise<void> {
        await this.group(selector).$('[data-qa="group-expander"]').click();
    }

    async expandGroup(selector: ItemSelector): Promise<void> {
        await this.group(selector).$('[data-qa="group-expander"]').click();
    }

    async select(selector: ItemSelector): Promise<void> {
        const item = await this.item(selector);
        await item.moveTo();
        await item.$('.controls-CheckboxMarker__icon-checked').click();
    }

    async selectItemAction(
        selector: ItemSelector,
        actionSelector: ActionSelector
    ): Promise<void> {
        const item = await this.item(selector);
        await item.moveTo();
        if ('index' in actionSelector) {
            await item
                .$$('[data-qa="controls-itemActions__action"]')
                [actionSelector.index - 1].click();
        }
        if ('title' in actionSelector) {
            await item
                .$(
                    `[data-qa="controls-itemActions__action"][title="${actionSelector.title}"]`
                )
                .click();
        }
        if ('iconClass' in actionSelector) {
            await item
                .$(
                    `[data-qa="controls-itemActions__action"] .${actionSelector.iconClass}`
                )
                .click();
        }
    }

    async openItemActionMenu(selector: ItemSelector): Promise<void> {
        await this.selectItemAction(selector, {
            iconClass: 'icon-SettingsNew',
        });
    }

    async openContextMenu(selector: ItemSelector): Promise<void> {
        await this.item(selector).click({
            button: 'right',
        });
    }

    async delete(selector: ItemSelector): Promise<void> {
        await this.selectItemAction(selector, {
            iconClass: 'icon-Erase',
        });
    }

    async edit(
        selector: ItemSelector,
        {
            newText,
            commit = false,
            applyButton = true,
            clearValue = false,
        }: IEditOptions
    ): Promise<void> {
        await this.item(selector).click();
        if (clearValue) {
            // Это единственный рабочий способ очистить значение при помощи клавиш на клавиатуре.
            // До этого испробовали отправку значений CTRL+A, Delete через set и через keys.
            // CTRL+A не успевает выделить значения и тест переходит дальше.
            await this.editor().setValue([' ', 'Backspace']);
        }
        if (newText) {
            await this.editor().addValue(newText);
        }
        if (commit) {
            if (applyButton) {
                await this.applyButton().waitForClickable();
                await this.applyButton().click();
            } else {
                await this.editor().addValue('Enter');
            }
        }
    }

    async checkCheckboxState(
        selector: ItemSelector,
        expectedState: boolean | null
    ): Promise<void> {
        let expectedClass;
        if (expectedState) {
            expectedClass = 'controls-CheckboxMarker__state-true';
        } else if (expectedState === null) {
            expectedClass = 'controls-CheckboxMarker__state-null';
        } else {
            expectedClass = 'controls-CheckboxMarker__state-false';
        }
        await expect(this.checkbox(selector)).toHaveElementClass(expectedClass);
    }

    async checkValidationState(isValid: boolean): Promise<void> {
        let selector = '.controls-EditingTemplateText__editor';
        if (isValid) {
            selector += '.controls-Render_state-valid';
        } else {
            selector += '.controls-Render_state-invalid';
            selector +=
                ',.controls-EditingTemplateText__editor.controls-Render_state-invalidAccent';
        }
        await this.container().$(selector).waitForExist();
    }
}
