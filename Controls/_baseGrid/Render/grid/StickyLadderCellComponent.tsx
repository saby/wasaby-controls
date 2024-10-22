import { createElement } from 'UICore/Jsx';
import { StickyBlock } from 'Controls/stickyBlock';
import StickyLadderCell from 'Controls/_baseGrid/display/StickyLadderCell';
import * as React from 'react';

interface IProps {
    gridColumn?: StickyLadderCell;
    itemData?: StickyLadderCell;
    subPixelArtifactFix?: boolean;
    pixelRatioBugFix?: boolean;
    backgroundColorStyle?: string;
    cursor?: string;
    render?: React.ReactNode;
}

export default function StickyLadderCellComponent(props: IProps) {
    const column = props.gridColumn || props.itemData;
    const { render, ...clearProps } = props;
    const className =
        clearProps.className +
        ' ' +
        column.getOriginalContentClasses(props.backgroundColorStyle, props.cursor);
    const contentRender = props.render
        ? React.cloneElement(props.render, {
              ...clearProps,
              'data-qa': 'ladder-cell',
              stickyProperty: column.getStickyProperty(),
              className,
          })
        : createElement(column.getOriginalTemplate(), {
              ...clearProps,
              stickyProperty: column.getStickyProperty(),
              'data-qa': 'ladder-cell',
              className,
          });
    return (
        <div className={column.getStickyContentClasses()} style={column.getStickyContentStyles()}>
            <StickyBlock
                position={'topBottom'}
                backgroundStyle={'transparent'}
                shadowVisibility={'hidden'}
                mode={'replaceable'}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                fixedZIndex={column.getZIndex()}
                stickyAttrs={{
                    style: { zIndex: column.getZIndex() },
                    class: column.getStickyHeaderClasses(),
                }}
            >
                {contentRender}
            </StickyBlock>
        </div>
    );
}
