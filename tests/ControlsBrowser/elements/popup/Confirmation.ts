import BaseElement from '../BaseElement';

/**
 * Диалог подтверждения.
 * @author Зайцев А.С.
 */
export default class Confirmation extends BaseElement {
    constructor(selector: string = '.controls-ConfirmationTemplate') {
        super(selector);
    }

    async select(buttonText: string): Promise<void> {
        await $(
            `//*[@class="controls-ConfirmationTemplate__footer"]//*[@class="controls-BaseButton"][text()="${buttonText}"]`
        );
    }
}
