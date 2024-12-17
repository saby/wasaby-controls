import * as React from 'react';
import { ITableCellTemplateOptions } from '../interface/ITableCellTemplate';
import { IColumnTemplateProps } from 'Controls/grid';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import ImageRender from './ImageRender';

export interface ICleanGridCellProps extends ITableCellTemplateOptions, IColumnTemplateProps {
    item: CollectionItem;
    fallbackImage: string;
    isNode: boolean;
    imageSrc: string;
    className?: string;
}

export default function ListTemplatesTableCellRenderCleanGridCell(
    props: ICleanGridCellProps
): React.ReactElement {
    const shouldDrawImage = !!(props.imageSrc || props.fallbackImage);
    let contentClassName = 'controls-listTemplates__tableCellTemplate__content';
    // Если режим отображения картинки не none, рисуем или картинку или плейсхолдер.
    if (props.imageViewMode !== 'none') {
        // При наличии картинки растягиваем блок с контентом до высоты картинки.
        if (shouldDrawImage) {
            contentClassName += ' controls-listTemplates__tableCellTemplate__content_image-height';
        }
        // Если картинки нет, добавляем слева к контенту плейсхолдер под картинку
        contentClassName += ' controls-listTemplates__tableCellTemplate__content_image-placeholder';
    }

    return (
        <div
            className={
                'controls-listTemplates__tableCellTemplate' +
                (props.className ? ` ${props.className}` : '')
            }
        >
            {props.isNode ? (
                props.contentTemplate && <props.contentTemplate {...props} />
            ) : (
                <>
                    {props.imageViewMode !== 'none' && shouldDrawImage ? (
                        <ImageRender
                            className={'controls-listTemplates_tableCellTemplate-image'}
                            imageFit={props.imageFit}
                            fallbackImage={props.fallbackImage}
                            viewMode={props.imageViewMode}
                            src={props.imageSrc}
                        />
                    ) : null}
                    <div className={contentClassName}>
                        {props.contentTemplate && <props.contentTemplate {...props} />}
                        {props.footerTemplate && (
                            <div className="controls-listTemplates__tableCellTemplate__footer">
                                <props.footerTemplate {...props} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
