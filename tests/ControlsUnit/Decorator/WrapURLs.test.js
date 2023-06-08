define(['Controls/extendedDecorator'], function (decorator) {
   'use strict';

   describe('Controls.extendedDecorator.WrapURLs', function () {
      describe('parseText', function () {
         var ctrl;
         beforeEach(function () {
            ctrl = decorator.WrapWRLsFunction;
         });

         it('Simple URL', function () {
            expect(ctrl.parseText('http://regexpal.com/')).toEqual([
               {
                  type: 'link',
                  href: 'http://regexpal.com/',
                  scheme: 'http://'
               }
            ]);
         });
         it('Simple URL with whitespaces', function () {
            expect(ctrl.parseText('  http://regexpal.com/    ')).toEqual([
               {
                  type: 'plain',
                  value: '  '
               },
               {
                  type: 'link',
                  href: 'http://regexpal.com/',
                  scheme: 'http://'
               },
               {
                  type: 'plain',
                  value: '    '
               }
            ]);
         });
         it('Simple URL with punctuation mark', function () {
            expect(ctrl.parseText('?http://regexpal.com/')).toEqual([
               {
                  type: 'plain',
                  value: '? '
               },
               {
                  type: 'link',
                  href: 'http://regexpal.com/',
                  scheme: 'http://'
               }
            ]);
         });
         it('Simple URL with params', function () {
            expect(
               ctrl.parseText('http://regexpal.com/home.php?request=q&theme=2')
            ).toEqual([
               {
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  scheme: 'http://'
               }
            ]);
         });
         it('Ru link', function () {
            expect(ctrl.parseText('http://почта.рф/')).toEqual([
               {
                  type: 'link',
                  href: 'http://почта.рф/',
                  scheme: 'http://'
               }
            ]);
         });
         it('Link with port', function () {
            expect(ctrl.parseText('http://ya.ru:80')).toEqual([
               {
                  type: 'link',
                  href: 'http://ya.ru:80',
                  scheme: 'http://'
               }
            ]);
         });
         it('Link inside text', function () {
            expect(ctrl.parseText('find here: http://ya.ru/, please')).toEqual([
               {
                  type: 'plain',
                  value: 'find here: '
               },
               {
                  type: 'link',
                  href: 'http://ya.ru/',
                  scheme: 'http://'
               },
               {
                  type: 'plain',
                  value: ', please'
               }
            ]);
         });
         it("Symbol ' inside link", function () {
            expect(
               ctrl.parseText(
                  "https://wiki.postgresql.org/wiki/What's_new_in_PostgreSQL_9.5"
               )
            ).toEqual([
               {
                  type: 'link',
                  href: "https://wiki.postgresql.org/wiki/What's_new_in_PostgreSQL_9.5",
                  scheme: 'https://'
               }
            ]);
         });
         it('Link with anchor', function () {
            expect(
               ctrl.parseText(
                  'http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4'
               )
            ).toEqual([
               {
                  type: 'link',
                  href: 'http://axure.tensor.ru/ereport/#p=реестр_по_приложению_№4',
                  scheme: 'http://'
               }
            ]);
         });
         it('Link ends dot', function () {
            expect(
               ctrl.parseText('http://regexpal.com/home.php?request=q&theme=2.')
            ).toEqual([
               {
                  type: 'link',
                  href: 'http://regexpal.com/home.php?request=q&theme=2',
                  scheme: 'http://'
               },
               {
                  type: 'plain',
                  value: '.'
               }
            ]);
         });
         it('Simple localFile', function () {
            const localFile = '\\\\test\\test';
            expect(ctrl.parseText(localFile)).toEqual([
               {
                  type: 'link',
                  href: localFile,
                  scheme: ''
               }
            ]);
         });
         it('Simple mail', function () {
            expect(ctrl.parseText('e@mail.ru')).toEqual([
               {
                  type: 'email',
                  address: 'e@mail.ru'
               }
            ]);
         });
         it('Mail with seperators', function () {
            expect(ctrl.parseText('my-e.ma@il.ru')).toEqual([
               {
                  type: 'email',
                  address: 'my-e.ma@il.ru'
               }
            ]);
         });
         it('Ru mail', function () {
            expect(ctrl.parseText('почтальон@почта.рф')).toEqual([
               {
                  type: 'email',
                  address: 'почтальон@почта.рф'
               }
            ]);
         });
         it('Colon mail', function () {
            expect(ctrl.parseText('git@git.sbis.ru:')).toEqual([
               {
                  type: 'email',
                  address: 'git@git.sbis.ru'
               },
               {
                  type: 'plain',
                  value: ':'
               }
            ]);
         });
         it('After colon mail', function () {
            expect(ctrl.parseText('git@git.sbis.ru: abc')).toEqual([
               {
                  type: 'email',
                  address: 'git@git.sbis.ru'
               },
               {
                  type: 'plain',
                  value: ': abc'
               }
            ]);
         });
         it('Top level domailn mail', function () {
            expect(ctrl.parseText('email@topleveldomain')).toEqual([
               {
                  type: 'plain',
                  value: 'email@topleveldomain'
               }
            ]);
         });
         it('www', function () {
            expect(ctrl.parseText('www.yandex.ru text after')).toEqual([
               {
                  type: 'link',
                  href: 'www.yandex.ru',
                  scheme: 'www.'
               },
               {
                  type: 'plain',
                  value: ' text after'
               }
            ]);
         });
         it('Space after protocol before www', function () {
            expect(
               ctrl.parseText('https:// www.youtube.com/watch?v=_avffmEHKf8')
            ).toEqual([
               {
                  type: 'plain',
                  value: 'https:// '
               },
               {
                  type: 'link',
                  href: 'www.youtube.com/watch?v=_avffmEHKf8',
                  scheme: 'www.'
               }
            ]);
         });
         it('www without dot', function () {
            expect(ctrl.parseText('wwwanytext')).toEqual([
               {
                  type: 'plain',
                  value: 'wwwanytext'
               }
            ]);
         });
         it('Star url', function () {
            expect(
               ctrl.parseText(
                  'http://www.123assess.com/te/tbm/servlet?aid=gTXJuESfVsj7qTRkHepNsA**&mid=Olnl6KgvpofmSElvN69BeA**'
               )
            ).toEqual([
               {
                  type: 'link',
                  href: 'http://www.123assess.com/te/tbm/servlet?aid=gTXJuESfVsj7qTRkHepNsA**&mid=Olnl6KgvpofmSElvN69BeA**',
                  scheme: 'http://'
               }
            ]);
         });
         it('Url in double delimiters', function () {
            expect(
               ctrl.parseText('(https://pre-test-online.sbis.ru/auth/?ret=%2F)')
            ).toEqual([
               {
                  type: 'plain',
                  value: '('
               },
               {
                  type: 'link',
                  href: 'https://pre-test-online.sbis.ru/auth/?ret=%2F',
                  scheme: 'https://'
               },
               {
                  type: 'plain',
                  value: ')'
               }
            ]);
         });
         it('Url in double delimiters in the middle of the text', function () {
            expect(
               ctrl.parseText(
                  'test test (https://pre-test-online.sbis.ru/auth/?ret=%2F) test test'
               )
            ).toEqual([
               {
                  type: 'plain',
                  value: 'test test ('
               },
               {
                  type: 'link',
                  href: 'https://pre-test-online.sbis.ru/auth/?ret=%2F',
                  scheme: 'https://'
               },
               {
                  type: 'plain',
                  value: ') test test'
               }
            ]);
         });
      });
   });
});
