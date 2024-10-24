import { StringType } from 'Meta/types';
import * as translate from 'i18n!Controls-editors';

/*
 * Тип "Лицо"
 */
type TFace = string;

/**
 * Мета-тип "Лицо"
 */
const FaceType = StringType.id('ArgumentsEditor/fakeTypes:FaceType')
    .title(translate('Лицо'))
    .editor('Controls-editors/function:FaceEditor');

export { TFace, FaceType };
