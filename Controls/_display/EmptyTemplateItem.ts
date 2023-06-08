/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import CollectionItem, { IOptions } from './CollectionItem';
import { TemplateFunction } from 'UI/Base';

export interface IEmptyTemplateItemOptions extends IOptions<null> {
    template: TemplateFunction;
    templateOptions?: object;
}

export class EmptyTemplateItem extends CollectionItem<null> {
    private _template: TemplateFunction;
    private _templateOptions: object;

    constructor(options: IEmptyTemplateItemOptions) {
        super(options);
        this._template = options.template;
        this._templateOptions = options.templateOptions || {};
    }

    getTemplate(
        userTemplate: TemplateFunction | string
    ): TemplateFunction | string {
        return userTemplate || this._template;
    }

    getContentClasses(
        params: {
            align?: string;
            isEditing?: boolean;
            topSpacing?: string;
            bottomSpacing?: string;
        } = {}
    ): string {
        const rightPadding = this.getOwner().getRightPadding().toLowerCase();
        let classes = 'controls-ListView__empty';
        classes += ` controls-ListView__empty-textAlign_${
            params.align || 'center'
        }`;
        classes += ` controls-ListView__empty_topSpacing_${
            params.topSpacing || 'l'
        }`;
        classes += ` controls-ListView__empty_bottomSpacing_${
            params.bottomSpacing || 'l'
        }`;

        if (this._$rowSeparatorSize) {
            const rowSeparatorSize = this.getRowSeparatorSize();
            classes += ` controls-ListView__rowSeparator_size-${rowSeparatorSize}`;
            classes += ` controls-ListView__rowSeparator_bottom_size-${rowSeparatorSize}`;
        }

        if (params.align && params.align !== 'center') {
            classes += ` ${this._getLeftSpacingContentClasses()}`;
            classes += ` controls-ListView__item-rightPadding_${rightPadding}`;
        }

        if (params.isEditing) {
            classes += ' controls-ListView__empty_background-editing';
        }

        return classes;
    }
}

export default EmptyTemplateItem;
