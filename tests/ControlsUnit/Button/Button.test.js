define(['Controls/buttons', 'UI/Utils'], function (buttons, { Logger }) {
   var actualAPI = buttons.ActualApi;

   describe('Controls.Button', function () {
      beforeEach(() => {
         jest.spyOn(Logger, 'warn').mockClear().mockImplementation();
      });

      describe('styleToViewMode', function () {
         it('style linkMain', function () {
            let cfg = actualAPI.styleToViewMode('linkMain');
            expect('link').toEqual(cfg.viewMode);
            expect('secondary').toEqual(cfg.style);
         });
         it('style linkMain2', function () {
            let cfg = actualAPI.styleToViewMode('linkMain2');
            expect('link').toEqual(cfg.viewMode);
            expect('info').toEqual(cfg.style);
         });
         it('style linkMain3', function () {
            let cfg = actualAPI.styleToViewMode('linkMain3');
            expect('link').toEqual(cfg.viewMode);
            expect('info').toEqual(cfg.style);
         });
         it('style linkAdditional', function () {
            let cfg = actualAPI.styleToViewMode('linkAdditional');
            expect('link').toEqual(cfg.viewMode);
            expect('info').toEqual(cfg.style);
         });
         it('style linkAdditional2', function () {
            let cfg = actualAPI.styleToViewMode('linkAdditional2');
            expect('link').toEqual(cfg.viewMode);
            expect('default').toEqual(cfg.style);
         });
         it('style linkAdditional3', function () {
            let cfg = actualAPI.styleToViewMode('linkAdditional3');
            expect('link').toEqual(cfg.viewMode);
            expect('danger').toEqual(cfg.style);
         });
         it('style linkAdditional4', function () {
            let cfg = actualAPI.styleToViewMode('linkAdditional4');
            expect('link').toEqual(cfg.viewMode);
            expect('success').toEqual(cfg.style);
         });
         it('style linkAdditional5', function () {
            let cfg = actualAPI.styleToViewMode('linkAdditional5');
            expect('link').toEqual(cfg.viewMode);
            expect('magic').toEqual(cfg.style);
         });
         it('style buttonPrimary', function () {
            let cfg = actualAPI.styleToViewMode('buttonPrimary');
            expect('button').toEqual(cfg.viewMode);
            expect('primary').toEqual(cfg.style);
         });
         it('style buttonDefault', function () {
            let cfg = actualAPI.styleToViewMode('buttonDefault');
            expect('button').toEqual(cfg.viewMode);
            expect('secondary').toEqual(cfg.style);
         });
         it('style toolButton', function () {
            let cfg = actualAPI.styleToViewMode('ghost');
            expect('').toEqual(cfg.viewMode);
            expect('').toEqual(cfg.style);
         });
      });
      describe('iconStyleTransformation', function () {
         it('attention', function () {
            let cfg = actualAPI.iconStyleTransformation('attention');
            expect('warning').toEqual(cfg);
         });
         it('done', function () {
            let cfg = actualAPI.iconStyleTransformation('done');
            expect('success').toEqual(cfg);
         });
         it('error', function () {
            let cfg = actualAPI.iconStyleTransformation('error');
            expect('danger').toEqual(cfg);
         });
         it('success', function () {
            let cfg = actualAPI.iconStyleTransformation('success');
            expect('success').toEqual(cfg);
         });
      });
      describe('contrastBackground', function () {
         it('contrastBackground', function () {
            let cfg = actualAPI.contrastBackground({
               contrastBackground: true,
               transparent: true
            });
            expect(cfg).toBe(true);
         });
         it('transparent true', function () {
            let cfg = actualAPI.contrastBackground({ transparent: true });
            expect(cfg).toBe(false);
         });
         it('transparent false', function () {
            let cfg = actualAPI.contrastBackground({ transparent: false });
            expect(cfg).toBe(true);
         });
         it('all undefined', function () {
            let cfg = actualAPI.contrastBackground({});
            expect(cfg).toBe(false);
         });
      });
      describe('buttonStyle', function () {
         it('readonly', function () {
            let cfg = actualAPI.buttonStyle(
               'warning',
               'danger',
               'secondary',
               true
            );
            expect('readonly').toEqual(cfg);
         });
         it('buttonStyle', function () {
            let cfg = actualAPI.buttonStyle('warning', 'danger', 'secondary');
            expect('secondary').toEqual(cfg);
         });
         it('style', function () {
            let cfg = actualAPI.buttonStyle('warning', 'danger');
            expect('warning').toEqual(cfg);
         });
         it('oldStyle', function () {
            let cfg = actualAPI.buttonStyle(undefined, 'danger');
            expect('danger').toEqual(cfg);
         });
      });
      describe('fontColorStyle', function () {
         it('all undefined', function () {
            let cfg = actualAPI.fontColorStyle();
            expect(undefined).toEqual(cfg);
         });
         it('fontColorStyle', function () {
            let cfg = actualAPI.fontColorStyle(undefined, undefined, 'primary');
            expect('primary').toEqual(cfg);
         });
         it('button', function () {
            let cfg = actualAPI.fontColorStyle('warning', 'button');
            expect(undefined).toEqual(cfg);
         });
         it('link primary', function () {
            let cfg = actualAPI.fontColorStyle('primary', 'link');
            expect('link').toEqual(cfg);
         });
         it('link success', function () {
            let cfg = actualAPI.fontColorStyle('success', 'link');
            expect('success').toEqual(cfg);
         });
         it('link danger', function () {
            let cfg = actualAPI.fontColorStyle('danger', 'link');
            expect('danger').toEqual(cfg);
         });
         it('link warning', function () {
            let cfg = actualAPI.fontColorStyle('warning', 'link');
            expect('warning').toEqual(cfg);
         });
         it('link info', function () {
            let cfg = actualAPI.fontColorStyle('info', 'link');
            expect('unaccented').toEqual(cfg);
         });
         it('link secondary', function () {
            let cfg = actualAPI.fontColorStyle('secondary', 'link');
            expect('link').toEqual(cfg);
         });
         it('link default', function () {
            let cfg = actualAPI.fontColorStyle('default', 'link');
            expect('default').toEqual(cfg);
         });
         it('link without style', function () {
            let cfg = actualAPI.fontColorStyle(undefined, 'link');
            expect('link').toEqual(cfg);
         });
      });

      describe('iconStyle', function () {
         it('readonly', function () {
            const cfg = actualAPI.iconStyle(
               'success',
               'icon-done icon-Author',
               true,
               false
            );
            expect('readonly').toEqual(cfg);
         });
         it('translucent', function () {
            const cfg = actualAPI.iconStyle(
               'success',
               'icon-done icon-Author',
               false,
               true
            );
            expect('forTranslucent').toEqual(cfg);
         });
         it('iconStyle success', function () {
            const cfg = actualAPI.iconStyle(
               'success',
               'icon-done icon-Author',
               false,
               false
            );
            expect('success').toEqual(cfg);
         });
         it('iconStyle done', function () {
            const cfg = actualAPI.iconStyle(
               'done',
               'icon-done icon-Author',
               false,
               false
            );
            expect('success').toEqual(cfg);
         });
         it('icon-done', function () {
            const cfg = actualAPI.iconStyle(
               undefined,
               'icon-done icon-Author',
               false,
               false
            );
            expect('success').toEqual(cfg);
         });
      });

      describe('fontSize', function () {
         it('fontSize', function () {
            let cfg = actualAPI.fontSize({
               fontSize: 'm',
               size: 'l',
               viewMode: 'outlined'
            });
            expect('m').toEqual(cfg);
         });
         it('button l', function () {
            let cfg = actualAPI.fontSize({ size: 'l', viewMode: 'outlined' });
            expect('xl').toEqual(cfg);
         });
         it('button not l', function () {
            let cfg = actualAPI.fontSize({ size: 's', viewMode: 'outlined' });
            expect('m').toEqual(cfg);
         });
         it('link s', function () {
            let cfg = actualAPI.fontSize({ size: 's', viewMode: 'link' });
            expect('xs').toEqual(cfg);
         });
         it('link l', function () {
            let cfg = actualAPI.fontSize({ size: 'l', viewMode: 'link' });
            expect('l').toEqual(cfg);
         });
         it('link xl', function () {
            let cfg = actualAPI.fontSize({ size: 'xl', viewMode: 'link' });
            expect('3xl').toEqual(cfg);
         });
         it('link other', function () {
            let cfg = actualAPI.fontSize({ size: '4xl', viewMode: 'link' });
            expect('m').toEqual(cfg);
         });
         it('toolbutton l', function () {
            let cfg = actualAPI.fontSize({ size: 'l', viewMode: 'ghost' });
            expect('m').toEqual(cfg);
         });
         it('size undefined', function () {
            let cfg = actualAPI.fontSize({ viewMode: 'ghost' });
            expect('m').toEqual(cfg);
         });
      });

      describe('viewMode', function () {
         it('button', function () {
            let cfg = actualAPI.viewMode('button', 'link');
            expect('button').toEqual(cfg.viewMode);
         });
         it('transparentQuickButton', function () {
            let cfg = actualAPI.viewMode('transparentQuickButton');
            expect('ghost').toEqual(cfg.viewMode);
            expect(false).toEqual(cfg.contrast);
         });
         it('QuickButton', function () {
            let cfg = actualAPI.viewMode('quickButton');
            expect('ghost').toEqual(cfg.viewMode);
            expect(true).toEqual(cfg.contrast);
         });
      });

      describe('height', function () {
         it('height option', function () {
            let cfg = actualAPI.actualHeight('l', 'xl');
            expect('xl').toEqual(cfg);
         });
         it('link', function () {
            let cfg = actualAPI.actualHeight('l', undefined, 'link');
            expect(undefined).toEqual(cfg);
         });
         it('button s', function () {
            let cfg = actualAPI.actualHeight('s', undefined, 'button');
            expect('default').toEqual(cfg);
         });
         it('button m', function () {
            let cfg = actualAPI.actualHeight('m', undefined, 'button');
            expect('m').toEqual(cfg);
         });
         it('button l', function () {
            let cfg = actualAPI.actualHeight('l', undefined, 'button');
            expect('2xl').toEqual(cfg);
         });
         it('button default', function () {
            let cfg = actualAPI.actualHeight('default', undefined, 'button');
            expect('default').toEqual(cfg);
         });
         it('toolButton s', function () {
            let cfg = actualAPI.actualHeight('s', undefined, 'ghost');
            expect('default').toEqual(cfg);
         });
         it('toolButton m', function () {
            let cfg = actualAPI.actualHeight('m', undefined, 'ghost');
            expect('l').toEqual(cfg);
         });
         it('toolButton l', function () {
            let cfg = actualAPI.actualHeight('l', undefined, 'ghost');
            expect('xl').toEqual(cfg);
         });
         it('toolButton default', function () {
            let cfg = actualAPI.actualHeight('default', undefined, 'ghost');
            expect('l').toEqual(cfg);
         });
      });
   });
});
