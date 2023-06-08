/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { GridFooterCell, IGridFooterCellOptions } from 'Controls/grid';
import TreeGridFooterRow, {
    ITreeGridFooterRowAspectOptions,
} from './TreeGridFooterRow';

export interface ITreeGridFooterCellOptions
    extends IGridFooterCellOptions,
        ITreeGridFooterRowAspectOptions {}

/**
 * Ячейка футера иерархической коллекции
 * @private
 */
export default class TreeGridFooterCell<
    TOwner extends TreeGridFooterRow
> extends GridFooterCell<TOwner> {
    /**
     * Признак, означающий что нужно рисовать отступ вместо экспандеров
     * @protected
     */
    protected _$displayExpanderPadding: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__footer';

    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover: boolean
    ): string {
        const classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover
        );
        return `${classes} ${this._getExpanderPaddingClasses('cellWrapper')}`;
    }

    getWrapperStyles(containerSize?: number): string {
        let styles = this.getColspanStyles();
        if (
            containerSize &&
            this._$isActsAsRowTemplate &&
            this._$owner.isFullGridSupport()
        ) {
            // FIXME: Убрать после выполнения.
            //  https://online.sbis.ru/opendoc.html?guid=1c18ad72-594b-4d5f-8a50-9488ee140de4
            styles += this._getContainerWidthStyles(
                containerSize,
                this.getOwner().getExpanderSize() || 's'
            );
        }
        return styles;
    }

    getContentClasses(
        height?: 'default' | 'auto',
        needItemActionsSpacing?: boolean
    ): string {
        return `${super.getContentClasses(
            height,
            needItemActionsSpacing
        )} ${this._getExpanderPaddingClasses('contentWrapper')}`;
    }

    // region HasNodeWithChildren

    setDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        if (this._$displayExpanderPadding !== displayExpanderPadding) {
            this._$displayExpanderPadding = displayExpanderPadding;
            this._nextVersion();
        }
    }

    // endregion HasNodeWithChildren

    private _shouldDisplayExpanderPadding(): boolean {
        const isFirstColumnWithCorrectingForCheckbox =
            this._$owner.hasMultiSelectColumn()
                ? this.getColumnIndex() === 1
                : this.isFirstColumn();
        return (
            isFirstColumnWithCorrectingForCheckbox &&
            this._$displayExpanderPadding
        );
    }

    private _getExpanderPaddingClasses(
        target: 'cellWrapper' | 'contentWrapper'
    ): string {
        // Отступ под экспандер. При табличной верстки корневой блок ячейки - <td>, который не поддерживает
        // отступы. В таком случае, отступ применяется на обертке контента ячейки.
        if (
            this._shouldDisplayExpanderPadding() &&
            (this._$owner.isFullGridSupport()
                ? target === 'cellWrapper'
                : target === 'contentWrapper')
        ) {
            const expanderVisibility = this.getOwner().getExpanderVisibility();
            const hasExpander =
                this.getOwner().getExpanderIcon() !== 'none' &&
                (expanderVisibility === 'hasChildren'
                    ? this.getOwner().hasNodeWithChildren()
                    : this.getOwner().hasNode());

            if (hasExpander) {
                const expanderSize =
                    this.getOwner().getExpanderSize() || 'default';
                return `controls-TreeView__expanderPadding-${expanderSize}`;
            }
        }
        return '';
    }

    // FIXME: Убрать после выполнения.
    //  https://online.sbis.ru/opendoc.html?guid=1c18ad72-594b-4d5f-8a50-9488ee140de4
    private _getContainerWidthStyles(
        containerSize: number,
        expanderSize: string
    ): string {
        const getStyle = (iconSize, paddingSize) => {
            const iconVar = `--size_${iconSize}_image`;
            const paddingVar =
                paddingSize === 's'
                    ? '--image_s_padding-right_treeGrid'
                    : `--offset_${paddingSize}`;

            let styles = `width: calc(${containerSize}px - var(${iconVar}) - var(${paddingVar}));`;

            if (
                this.getOwner().hasNewColumnScroll() &&
                this.getOwner().isFullGridSupport()
            ) {
                styles += `left: calc(var(${iconVar}) + var(${paddingVar}));`;
            }

            return styles;
        };
        switch (expanderSize) {
            case 's':
                return getStyle('xs', 's');
            case 'm':
                return getStyle('s', 'xs');
            case 'l':
                return getStyle('m', 'xs');
            case 'xl':
                return getStyle('l', 'xs');
        }
    }
}

Object.assign(TreeGridFooterCell.prototype, {
    '[Controls/treeGrid:TreeGridFooterCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridFooterCell',
    _instancePrefix: 'tree-grid-footer-cell-',
    _$displayExpanderPadding: true,
});
