/**
 * Библиотека содержащая компоненты, которые позволяют определить видимость прикладных компонентов.
 * @library
 * @public
 */

export { default as FreezeConsumer } from 'Controls/_freezeContext/Consumer';
export {
    Context,
    default as ContextProvider,
    IFreezeContext,
} from 'Controls/_freezeContext/Provider';
