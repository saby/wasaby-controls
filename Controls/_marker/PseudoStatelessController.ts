import {Controller} from './Controller';
import { CrudEntityKey } from 'Types/source';

export class PseudoStatelessController extends Controller {
    setMarkedKey(prevKey: CrudEntityKey, nextKey: CrudEntityKey): void {
        // TODO после перехода на новую модель, удалить _model.setMarkedKey и работать с CollectionItem
        if (prevKey !== nextKey) {
            this._model.setMarkedKey(prevKey, false);
        }
        this._model.setMarkedKey(nextKey, true);
    }
}