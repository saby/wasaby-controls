import * as React from 'react';
import { ITableCellTemplateOptions } from '../interface/ITableCellTemplate';
import { IColumnTemplateProps } from 'Controls/grid';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import ImageRender from './ImageRender';

interface CleanGridCellProps extends ITableCellTemplateOptions, IColumnTemplateProps {
    src: string;
    item: CollectionItem;
    fallbackImage: string;
    isNode: boolean;
    imageSrc: string;
}

const CleanGridCell = React.memo(function (props: CleanGridCellProps): React.ReactElement {
    return (
        <div className={'controls-listTemplates__tableCellTemplate'}>
            { props.isNode ? (
                props.contentTemplate && <props.contentTemplate {...props} />
            ) : (
                <>
                    {props.imageViewMode !== 'none' && (
                        <ImageRender
                            className={'controls-listTemplates_tableCellTemplate-image'}
                            imageFit={props.imageFit}
                            fallbackImage={props.fallbackImage}
                            viewMode={props.imageViewMode}
                            src={props.imageSrc}
                        />
                    )}
                    <div
                        className={`controls-listTemplates__tableCellTemplate__content ${
                            props.imageViewMode !== 'none'
                                ? 'controls-listTemplates__tableCellTemplate__content-withPhoto'
                                : ''
                        }`}
                    >
                        {props.contentTemplate && <props.contentTemplate {...props} />}
                        {props.footerTemplate && (
                            <div className="controls-listTemplates__tableCellTemplate__footer">
                                <props.footerTemplate
                                    {...props}
                                />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
});

export default CleanGridCell;
