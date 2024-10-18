/*
 * Файл содержит компонент sticky-ячейки
 */
import * as React from 'react';
import { GridStickyLadderCell as StickyLadderCell } from 'Controls/baseGrid';
import { StickyPropertyContext } from 'Controls/_grid/gridReact/ladder/StickyPropertyContext';
import { getStyleObjectFromString } from 'Controls/_grid/utils/cssStringToObject';
import { createElement } from 'UICore/Jsx';
import { StickyBlock } from 'Controls/stickyBlock';

interface IStickyLadderCellComponentProps {
    cell: StickyLadderCell;
    render?: React.ReactNode;
}

interface IStickyLadderCellContentRenderProps {
    backgroundColorStyle?: string;
    cursor?: string;
    cell: StickyLadderCell;
    pixelRatioBugFix?: boolean;
    render?: React.ReactNode;
    subPixelArtifactFix?: boolean;
}

// endregion utils

function StickyLadderCellContentRender(props: IStickyLadderCellContentRenderProps) {
    const cell: StickyLadderCell = props.cell;
    const { render, ...clearProps } = props;
    const className =
        clearProps.className +
        ' ' +
        cell.getOriginalContentClasses(props.backgroundColorStyle, props.cursor);
    const contentRender = props.render
        ? React.cloneElement(props.render, {
              ...clearProps,
              'data-qa': 'ladder-cell',
              stickyProperty: cell.getStickyProperty(),
              className,
          })
        : createElement(cell.getOriginalTemplate(), {
              ...clearProps,
              stickyProperty: cell.getStickyProperty(),
              'data-qa': 'ladder-cell',
              className,
          });
    return (
        <div className={cell.getStickyContentClasses()} style={cell.getStickyContentStyles()}>
            <StickyBlock
                position={'topBottom'}
                backgroundStyle={'transparent'}
                shadowVisibility={'hidden'}
                mode={'replaceable'}
                subPixelArtifactFix={props.subPixelArtifactFix}
                pixelRatioBugFix={props.pixelRatioBugFix}
                fixedZIndex={cell.getZIndex()}
                stickyAttrs={{
                    style: { zIndex: cell.getZIndex() },
                    class: cell.getStickyHeaderClasses(),
                }}
            >
                {contentRender}
            </StickyBlock>
        </div>
    );
}

/*
 * TODO Компонент sticky-ячейки лесенки являетя dirty, лезет во все возсможные wrapperClasses на всех уровнях.
 *  Надо распиливать вместе с CellComponent
 */
function StickyLadderCellComponent(props: IStickyLadderCellComponentProps): React.ReactElement {
    const { cell } = props;
    const style = getStyleObjectFromString(cell.getWrapperStyles() || '');

    const contentRender = props.render;

    return (
        <StickyPropertyContext.Provider value={cell.getStickyProperty()}>
            <div className={cell.getWrapperClasses()} style={style} data-qa="cell">
                <StickyLadderCellContentRender cell={cell} render={contentRender} />
            </div>
        </StickyPropertyContext.Provider>
    );
}

export default React.memo(StickyLadderCellComponent);
