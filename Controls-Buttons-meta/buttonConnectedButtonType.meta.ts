import { ButtonType, IConnectedInputType } from 'Controls-meta/controls';
import * as translate from 'i18n!Controls';

/**
 * Мета-описание кнопки  {@link Controls-Button/buttonConnected:Button Button}, работающей с контекстом
 */
/*
 * FIXME: временная мета для включения в магазин до разработки Controls-Button/buttonConnected:Button
 */
const buttonConnectedButtonTypeMeta = ButtonType.id('Controls/buttons:Button')
    .title(translate('Кнопка'))
    .category(translate('Базовые'))
    .attributes({
        ...ButtonType.attributes(),
        ...IConnectedInputType.attributes(),
    });

export default buttonConnectedButtonTypeMeta;
