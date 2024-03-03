function check(isIt, cb) {
   if (!isIt) {
      return null;
   }

   try {
      return cb();
   } catch (e) {
      return null;
   }
}

function checkXP(ua) {
   return /(Windows NT 5\.1|Windows XP)/i.test(ua) || null;
}

function checkIE(ua) {
   var msie = /(msie)\s+([\w.]+)/i;
   var edge = /(edge)\/([\w]+)/i;
   var trident = /(trident)(?:.*rv:[ ]?([\w.]+))?/i;

   var match = msie.exec(ua) || edge.exec(ua) || trident.exec(ua);
   if (match) {
      return !!parseInt(match[2], 10);
   }
   return null;
}

function checkChrome(ua) {
   return check(
      /\bCriOS\b/.test(ua) || /Chrome\/[.\d]* Mobile/i.test(ua) || /Chrome/i.test(ua),
      function () {
         var v = parseInt(ua.match(/Chrome\/[\d]*./)[0].substr(7, 8), 10);
         return v < 57;
      }
   );
}

function checkFF(ua) {
   return check(/Firefox\/[\d]*./.test(ua), function () {
      var v = parseInt(ua.match(/Firefox\/[\d]*./)[0].substr(8, 8), 10);
      return v < 52;
   });
}

function checkMobileSafari(ua) {
   return check(/(iPhone|iPad|iPod)/i.test(ua), function () {
      var versionEntire = /\bCPU\s+((iPhone OS)|(i?OS)) ((\d|_)*)/;
      var match = versionEntire.exec(ua);
      if (!match || !match[4]) {
         return true;
      }
      var version = match[4].split('_').map(function (item) {
         return parseInt(item, 10);
      });

      return version[0] < 12;
   });
}

function checkDesktopSafari(ua) {
   return check(/Version\/[\d]*.[\d].[\d] Safari/.test(ua), function () {
      var vEntire = /Version\/(\d+).(\d+).(\d+) Safari/;
      var vMajorMinor = /Version\/(\d+).(\d+) Safari/;
      // Additionally, we check the version without the patch, for example 12.0
      var matchD = vEntire.exec(ua) || vMajorMinor.exec(ua);
      var v = matchD && parseInt(matchD[1], 10);

      return v < 13;
   });
}

function checkOneC(ua) {
   // ДОЛЖНА ПРОВЕРЯТЬСЯ ПОСЛЕДНЕЙ
   return /V8WebKit/.test(ua) || null;
}

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

function isNotFullGridSupport() {
   var ua = getUserAgent();

   // 1С ДОЛЖНА ПРОВЕРЯТЬСЯ ПОСЛЕДНЕЙ
   return [
      checkXP,
      checkIE,
      checkChrome,
      checkFF,
      checkMobileSafari,
      checkDesktopSafari,
      checkOneC
   ].reduce(function (prev, currentCheck) {
      return prev === null ? currentCheck(ua) : prev;
   }, null);
}

function getDeps() {
   if (isNotFullGridSupport()) {
      return ['Controls/gridIE', 'css!Controls/gridIE'];
   }
   return [];
}

define('Controls/Utils/GridLoader', getDeps(), function (GridIE) {
   return {
      '[Controls/gridIE]': !!GridIE
   };
});
