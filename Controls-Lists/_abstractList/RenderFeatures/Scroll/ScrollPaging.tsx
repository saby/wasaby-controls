import { StickyBlock } from 'Controls/stickyBlock';
import { Paging } from 'Controls/paging';
import { TemplateFunction } from 'UICommon/Base';
import { INavigationViewConfig } from 'Controls/interface';
import Async from 'Controls/Container/Async';
import { ScrollControllerLib } from 'Controls/listsCommonLogic';
import { useStableCallback } from 'Controls/hooks';

export interface ScrollPagingProps {
    pagingLeftTemplate?: TemplateFunction | string;
    pagingRightTemplate?: TemplateFunction | string;
    pagingContentTemplate?: TemplateFunction | string;
    viewConfig: INavigationViewConfig;
    onDirectionChange: (
        direction: ScrollControllerLib.IDirectionNew,
        scrollToEdge: boolean
    ) => void;
}

type PagingDirection = 'Next' | 'Prev' | 'Begin' | 'End' | 'Reset';

const DIRECTIONS_MAP = new Map<PagingDirection, ScrollControllerLib.IDirectionNew>([
    ['Prev', 'backward'],
    ['Begin', 'backward'],
    ['End', 'forward'],
    ['Next', 'forward'],
]);

function ScrollPaging(props: ScrollPagingProps) {
    const onArrowClick = useStableCallback(
        (arrow: PagingDirection) => {
            const direction = DIRECTIONS_MAP.get(arrow);
            if (direction) {
                props.onDirectionChange(direction, ['Begin', 'End'].includes(arrow));
            }
        },
        [props]
    );

    return (
        <StickyBlock
            className="controls-BaseControl__pagingContainer_stickyBlock"
            backgroundStyle="transparent"
            mode="stackable"
            shadowVisibility="hidden"
            position="bottom"
            zIndex={30}
            fixedZIndex={30}
        >
            <div className="controls-BaseControl__pagingContainer">
                <div
                    className={`controls-BaseControl__pagingWrapper
    controls-BaseControl__pagingWrapper_position-${
        props.viewConfig.pagingPosition === 'left' ? 'left' : 'right'
    }`}
                >
                    {props.pagingLeftTemplate && (
                        <Async templateName={props.pagingLeftTemplate} templateOptions={{}} />
                    )}
                    <Paging
                        className="controls-BaseControl__scrollPaging"
                        contrastBackground
                        pagingMode={props.viewConfig.pagingMode}
                        digitRenderCallback={props.viewConfig.digitRenderCallback}
                        contentTemplate={props.pagingContentTemplate}
                        arrowState={{
                            begin: 'visible',
                            prev: 'visible',
                            next: 'visible',
                            end: props.viewConfig.showEndButton ? 'visible' : 'hidden',
                        }}
                        // @ts-expect-error Триггер происходит через _notify, и поэтому его нет в типах
                        onOnArrowClick={onArrowClick}
                    />
                    {props.pagingRightTemplate && (
                        <Async templateName={props.pagingRightTemplate} templateOptions={{}} />
                    )}
                </div>
            </div>
        </StickyBlock>
    );
}

export default ScrollPaging;
