import ListView, { IEditOptions } from '../list/View';
import { UNICODE_CHARACTERS } from '../../helpers/constants';

/**
 * Таблица.
 * @author Аверкиев П.А.
 */
export default class GridView extends ListView {
    constructor(selector: string = '.controls-Grid') {
        super(selector, 'data-qa="row"');
    }

    cell(rowIndex: number, cellIndex: number = 1): ReturnType<WebdriverIO.Browser['$']> {
        const itemSelector = { index: rowIndex };
        return this.item(itemSelector).$$('[data-qa="cell"]')[cellIndex - 1];
    }

    cellEditor(rowIndex: number, cellIndex: number): ReturnType<WebdriverIO.Browser['$']> {
        return this.cell(rowIndex, cellIndex).$('.controls-EditingTemplateText__editor input');
    }

    async editCell(
        rowIndex: number,
        cellIndex: number,
        { newText, commit = false, applyButton = true, clearValue = false }: IEditOptions
    ): Promise<void> {
        await this.cell(rowIndex, cellIndex).click();
        if (clearValue) {
            // Это единственный рабочий способ очистить значение при помощи клавиш на клавиатуре.
            // До этого испробовали отправку значений CTRL+A, Delete через set и через keys.
            // CTRL+A не успевает выделить значения и тест переходит дальше.
            await this.cellEditor(rowIndex, cellIndex).setValue([' ', 'Backspace']);
        }
        if (newText) {
            await this.cellEditor(rowIndex, cellIndex).addValue(newText);
        }
        if (commit) {
            if (applyButton) {
                await this.applyButton().waitForClickable();
                await this.applyButton().click();
            } else {
                await this.cellEditor(rowIndex, cellIndex).addValue(UNICODE_CHARACTERS.Enter);
            }
        }
    }
}
