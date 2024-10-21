/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { Rpc } from 'Types/source';
import type { TGinniSourceConstructorOptions } from './interfaces';

/**
 * Источник данных
 * @private
 */
export class GinniSourceController extends Rpc {
    constructor(props: TGinniSourceConstructorOptions) {
        super(props);
    }
}
