import { forwardRef, LegacyRef, useMemo, useRef } from 'react';
import { Button } from 'Controls/buttons';
import { StickyOpener } from 'Controls/popup';
import { Dialog } from 'Controls/popupTemplate';
import { EventSubscriber } from 'UI/Events';

interface ISize {
    width: number;
    height: number;
}

function Template(props) {
    return (
        <EventSubscriber
            onPopupDragStart={props.onPopupDragStart}
            onPopupDragEnd={props.onPopupDragEnd}
            onPopupMovingSize={props.handleChangeSize}
        >
            <Dialog
                draggable={true}
                resizable={true}
                resizingOptions={{ step: 10, position: 'right-bottom' }}
                headingCaption="Заголовок"
                bodyContentTemplate={() => (
                    <div>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis
                        dignissimos laborum nihil soluta tempora! Aut, eligendi eum incidunt ipsa
                        modi nulla placeat reprehenderit voluptatum! Eos illum, possimus. Dolorum,
                        eius, vero!
                    </div>
                )}
            />
        </EventSubscriber>
    );
}

export default forwardRef(function ResizableWithDragDialogDemo(
    _: unknown,
    ref: LegacyRef<HTMLDivElement>
) {
    const sizes = useRef<ISize>({
        width: 450,
        height: 300,
    });
    const stickyOpener = useMemo(() => new StickyOpener(), []);
    const minHeight = 200;
    const minWidth = 200;
    const maxHeight = 700;
    const maxWidth = 700;
    const handleChangeSize = (_: Event, offset) => {
        let newWidth = sizes.current.width + offset.x;
        let newHeight = sizes.current.height + offset.y;
        if (newHeight < minHeight) {
            newHeight = minHeight;
        } else if (newHeight > maxHeight) {
            newHeight = maxHeight;
        }
        if (newWidth < minWidth) {
            newWidth = minWidth;
        } else if (newWidth > maxWidth) {
            newWidth = maxWidth;
        }
        sizes.current.width = newWidth;
        sizes.current.height = newHeight;

        stickyOpener.open({
            width: sizes.current.width,
            height: sizes.current.height,
            maxHeight,
            minHeight,
            maxWidth,
            minWidth,
            template: Template,
            templateOptions: {
                handleChangeSize,
            },
        });
    };

    return (
        <div ref={ref} className="tw-flex">
            <div>
                <Button
                    caption="Открыть диалоговое окно"
                    onClick={() => {
                        stickyOpener.open({
                            width: sizes.current.width,
                            height: sizes.current.height,
                            maxHeight,
                            minHeight,
                            maxWidth,
                            minWidth,
                            template: Template,
                            templateOptions: {
                                handleChangeSize,
                            },
                        });
                    }}
                />
            </div>
        </div>
    );
});
