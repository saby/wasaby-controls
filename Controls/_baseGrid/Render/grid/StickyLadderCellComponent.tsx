import { createElement } from 'UICore/Jsx';
import { StickyBlock } from 'Controls/stickyBlock';
import StickyLadderCell from 'Controls/_baseGrid/display/StickyLadderCell';

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
                {createElement(
                    props.render ?? column.getOriginalTemplate(),
                    {
                        ...props,
                        stickyProperty: column.getStickyProperty(),
                    },
                    {
                        class: column.getOriginalContentClasses(
                            props.backgroundColorStyle,
                            props.cursor
                        ),
                    }
                )}
            </StickyBlock>
        </div>
    );
}
