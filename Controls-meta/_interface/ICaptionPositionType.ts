import * as rk from 'i18n!Controls';
import { IStartEndPositionType } from './IStartEndPositionType';

export const ICaptionPositionType = IStartEndPositionType.id('Controls/meta:ICaptionPositionType')
    .title(rk('Расположение надписи'))
    .description(rk('Определяет, с какой стороны расположен текст кнопки относительно иконки.'));
