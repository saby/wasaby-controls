import { detection } from 'Env/Env';

// Проверка для идентификации старого браузера. Одного флага isIE недостаточно, так как в реестрах с 1с
// используется старый 1с-овский браузер, который эту проверку не проходит. Там можно завязаться только на флаг
// isNotFullGridSupport, но сафари на десктопе и хром на андроиде эту проверку тоже пройдёт, поэтому их нужно исключить.
export const isOldBrowser =
    detection.isIE ||
    (detection.isNotFullGridSupport &&
        !detection.safari &&
        !(detection.isMobileAndroid && detection.chrome));
