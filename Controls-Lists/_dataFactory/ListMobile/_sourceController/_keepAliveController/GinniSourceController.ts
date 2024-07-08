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
