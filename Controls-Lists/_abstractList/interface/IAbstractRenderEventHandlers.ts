/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IAbstractRenderProps } from './IAbstractRender';

type TAbstractRenderItemEventHandlers = Required<
    Pick<IAbstractRenderProps['itemHandlers'], 'onClick' | 'onKeyDown'>
>;

export type IAbstractRenderEventHandlers = {
    itemHandlers: TAbstractRenderItemEventHandlers;
};
