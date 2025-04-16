/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractRenderProps } from './IAbstractRender';

type TAbstractRenderItemEventHandlers = Required<
    Pick<
        IAbstractRenderProps['itemHandlers'],
        | 'onClick'
        | 'onKeyDown'
        | 'onMouseDown'
        | 'onMouseMove'
        | 'onContextMenu'
        | 'onSwipeCallback'
    >
>;

export type IAbstractRenderEventHandlers = Pick<
    IAbstractRenderProps,
    'onViewTriggerVisibilityChanged'
> & {
    itemHandlers: TAbstractRenderItemEventHandlers;
};
