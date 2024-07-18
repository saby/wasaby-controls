/**
 * Модуль выполняет динамическую загрузку констант ширин символов для разных браузеров.
 */

function getUserAgent() {
   if (typeof process !== 'undefined') {
      return (
         process.domain &&
         process.domain.req &&
         process.domain.req.headers &&
         process.domain.req.headers['user-agent']
      );
   }

   return navigator.userAgent;
}

function isIE(ua) {
   var msie = /(msie)\s+([\w.]+)/i;
   var edge = /(edge)\/([\w]+)/i;
   var trident = /(trident)(?:.*rv:[ ]?([\w.]+))?/i;

   var match = msie.exec(ua) || edge.exec(ua) || trident.exec(ua);
   return !!(match && parseInt(match[2], 10));
}

function getBrowser() {
   var ua = getUserAgent();
   return isIE(ua)
      ? 'IE'
      : /Firefox\/[\d]*./.test(ua)
      ? 'FF'
      : /^((?!chrome|android).)*safari/i.test(ua)
      ? 'Safari'
      : 'Chrome';
}

define('Controls/Utils/FontConstantsLoader', [
   'Controls/Utils/FontWidthConstants/' + getBrowser()
], function (fontConstants) {
   return fontConstants[getBrowser()];
});
