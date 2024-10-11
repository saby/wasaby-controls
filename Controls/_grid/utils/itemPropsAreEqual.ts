import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';

export function itemPropsAreEqual(
    prevProps: IRowComponentProps,
    nextProps: IRowComponentProps
): boolean {
    // itemActionsTemplateMountedCallback и itemActionsTemplateUnmountedCallback - нужны для кейса,
    // когда пересоздался itemActions:Controller
    return (
        prevProps.itemVersion === nextProps?.itemVersion &&
        prevProps.item === nextProps.item &&
        prevProps.className === nextProps.className &&
        !(
            prevProps.itemActionsTemplateMountedCallback === undefined &&
            prevProps.itemActionsTemplateMountedCallback !==
                nextProps.itemActionsTemplateMountedCallback
        ) &&
        !(
            prevProps.itemActionsTemplateUnmountedCallback === undefined &&
            prevProps.itemActionsTemplateUnmountedCallback !==
                nextProps.itemActionsTemplateUnmountedCallback
        ) &&
        prevProps.backgroundColorStyle === nextProps.backgroundColorStyle &&
        prevProps.cursor === nextProps.cursor &&
        prevProps.fontColorStyle === nextProps.fontColorStyle &&
        prevProps.fontSize === nextProps.fontSize &&
        prevProps.fontWeight === nextProps.fontWeight &&
        prevProps.highlightOnHover === nextProps.highlightOnHover &&
        prevProps.tagStyle === nextProps.tagStyle &&
        prevProps.baseline === nextProps.baseline &&
        prevProps.borderStyle === nextProps.borderStyle &&
        prevProps.borderVisibility === nextProps.borderVisibility &&
        prevProps.displayProperty === nextProps.displayProperty &&
        prevProps.shadowVisibility === nextProps.shadowVisibility &&
        prevProps.itemActionsClass === nextProps.itemActionsClass &&
        prevProps.marker === nextProps.marker &&
        prevProps.markerClassName === nextProps.markerClassName &&
        prevProps.shadowVisibility === nextProps.shadowVisibility &&
        prevProps.markerSize === nextProps.markerSize &&
        prevProps.readOnly === nextProps.readOnly &&
        prevProps.actionsVisibility === nextProps.actionsVisibility
    );
}
