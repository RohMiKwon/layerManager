/**
 * samsung.com layer manager
 * src : common/js/src/smg/global/smg.global.layermanager.js
 * @version 1.1.1
 * @requires
 *  namespace.js
 *  smg.util.js
 *  smg.static.js
 *  smg.event.js
 * @since 2016.09.13
 */
'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

;
(function(win, $) {
    'use strict';

    if (typeof win.smg === 'undefined') {
        win.smg = {};
    }

    if (typeof win.smg.global === 'undefined') {
        win.smg.global = {};
    }

    if (typeof win.smg.util === 'undefined') {
        win.smg.util = {};
    }

    var STATIC = win.smg.static,
        UTIL = win.smg.util,
        EVENT = win.smg.event;

    var LAYEREVENTS = EVENT.LAYER;
    /**
     * 레이어 관리 모듈
     * @class
     * @example new win.smg.global.LayerManager({ layer: $('#layer'), linked: $('#button'), onShow: function(e){ ... }, options: { keepDimmed: true }  });
     */
    win.smg.global.LayerManager = function() {
        LayerManager.prototype.defaults = function defaults() {
            this.dimmedClass = 'dimmed';
            this.keepdimmedClass = 'keep-dimmed';
            this.dimmedElement = '<div class="' + this.dimmedClass + '"></div>';

            return {
                enforceInitFocus: true,
                bActivated: true,
                keepDimmed: false,
                closeButton: '.close-button'
            };
        };

        /**
         * LayerManager 생성자
         * @param {object} layer - 레이어 요소
         * @param {object} linked - 레이어와 연결되는 요소
         * @param {object} onBeforeShow - 레이어 열리기전 callback 지정
         * @param {object} onShow - 레이어 열린 후 callback 지정
         * @param {object} onBeforeHide - 레이어 닫히기 전 callback 지정
         * @param {object} onHide - 레이어 닫힌 후 callback 지정
         * @param {object} options - 레이어 관련 옵션
         * @description 옵션설명 - bActivated(boolean) : 모듈 활성화 여부 / keepDimmed(boolean) : dimmed 유지 여부 / closeButton(selector) : 레이어 내 닫기버튼 셀렉터 / enforceInitFocus(boolean) :  초기화시 포커스 여부
         */


        function LayerManager(settings) {
            _classCallCheck(this, LayerManager);

            this.$layer = settings.layer;
            this.$linked = settings.linked;
            this.options = $.extend({}, this.defaults(), settings.options);

            this.onBeforeShowCallback = settings.onBeforeShow;
            this.onShowCallback = settings.onShow;
            this.onBeforeHideCallback = settings.onBeforeHide;
            this.onHideCallback = settings.onHide;

            this.init();
        }

        /**
         * 활성화
         */


        LayerManager.prototype.activate = function activate() {
            this.show();
        };

        /**
         * 비활성화
         */


        LayerManager.prototype.deactivate = function deactivate() {
            this.hide();
            this.reset();
        };

        LayerManager.prototype.init = function init() {
            this.assignedElements();
            this.appendDimmed();
            this.appendModuleClass();
            this.bindEvents();

            if (this.options.bActivated) {
                this.activate();
            }
        };

        LayerManager.prototype.assignedElements = function assignedElements() {
            this.$wrap = this.$layer.children();
            this.$closeButton = this.$layer.find(this.options.closeButton);
        };

        LayerManager.prototype.appendModuleClass = function appendModuleClass() {
            var layerIntClass = STATIC.CSS.LAYER_MODULE;

            if (this.$layer.hasClass(layerIntClass)) {
                return;
            }

            this.$layer.addClass(layerIntClass);
        };

        LayerManager.prototype.appendDimmed = function appendDimmed() {
            this.$layer.prepend(this.dimmedElement);
            this.$dimmed = this.$layer.find('.' + this.dimmedClass);
        };

        LayerManager.prototype.unbindAllEvents = function unbindAllEvents() {
            $(win).off('resize', $.proxy(this.onResize, this));
            this.$closeButton.off('click', $.proxy(this.onClickCloseButton, this));
            this.$dimmed.off('click touchstart', $.proxy(this.onClickDimmed, this));
        };

        LayerManager.prototype.bindEvents = function bindEvents() {
            $(win).off('resize', $.proxy(this.onResize, this));
            $(win).on('resize', $.proxy(this.onResize, this));

            this.$closeButton.off('click', $.proxy(this.onClickCloseButton, this));
            this.$closeButton.on('click', $.proxy(this.onClickCloseButton, this));

            if (!this.options.keepDimmed) {
                this.$dimmed.off('click touchstart', $.proxy(this.onClickCloseButton, this));
                this.$dimmed.on('click touchstart', $.proxy(this.onClickCloseButton, this));
            } else {
                this.$dimmed.addClass(this.keepdimmedClass);
            }
        };

        LayerManager.prototype.onResize = function onResize() {
            this.reposition();
        };

        LayerManager.prototype.onClickCloseButton = function onClickCloseButton(e) {
            e.preventDefault();

            this.hide();
            this.reset();
        };

        /**
         * 초기화 (스타일 & 이벤트)
         */


        LayerManager.prototype.reset = function reset() {
            this.unbindAllEvents();
            this.$wrap.removeAttr('style');
            this.$layer.removeClass(STATIC.CSS.LAYER_MODULE);
            $('html').removeClass(STATIC.CSS.LAYER_OPEN);
            this.$dimmed.removeClass(this.keepdimmedClass);
        };

        /**
         * 레이어 객체 가져옴
         * @return {element}  
         */


        LayerManager.prototype.getLayer = function getLayer() {
            return this.$layer;
        };

        /**
         * 레이어와 연결된 요소를 가져움
         * @return {element} 
         */


        LayerManager.prototype.getLinked = function getLinked() {
            return this.$linked ? this.$linked : null;
        };

        /**
         * 레이어 열기/닫기 여부
         * @return {boolean} 
         */


        LayerManager.prototype.isVisible = function isVisible() {
            return this.$layer.css('display') === 'block';
        };

        /**
         * 레이어 열기
         */


        LayerManager.prototype.show = function show() {

            if (typeof this.onBeforeShowCallback === 'function') {
                this.onBeforeShowCallback.apply(this, [this.getData(LAYEREVENTS.BEFORESHOW)]);
            }

            this.$layer.trigger(this.getData(LAYEREVENTS.BEFORESHOW));

            this.$layer.show();
            this.showDimmed();
            this.reposition();

            if (this.options.enforceInitFocus) {
                this.enforceFocusLayer();
            }

            if (typeof this.onShowCallback === 'function') {
                this.onShowCallback.apply(this, [this.getData(LAYEREVENTS.SHOW)]);
            }

            this.$layer.trigger(this.getData(LAYEREVENTS.SHOW));
        };

        /**
         * 레이어 닫기
         */


        LayerManager.prototype.hide = function hide() {
            if (typeof this.onBeforeHideCallback === 'function') {
                this.onBeforeHideCallback.apply(this, [this.getData(LAYEREVENTS.BEFOREHIDE)]);
            }

            this.$layer.trigger(this.getData(LAYEREVENTS.BEFOREHIDE));

            this.$layer.hide();
            this.hideDimmed();
            this.enforceFocusLinked();

            if (typeof this.onHideCallback === 'function') {
                this.onHideCallback.apply(this, [this.getData(LAYEREVENTS.HIDE)]);
            }

            this.$layer.trigger(this.getData(LAYEREVENTS.HIDE));
        };

        /**
         * 레이어 위치 조정
         */


        LayerManager.prototype.reposition = function reposition() {
            var $wrap = this.$wrap,
                $win = $(win),
                left = parseInt(($win.width() - $wrap.outerWidth()) * 0.5),
                top = parseInt(($win.height() - $wrap.outerHeight()) * 0.5);

            top = top <= 0 ? 0 : top;

            $wrap.css({
                top: top,
                left: left
            });

            this.setHeightDimmed($win.height(), $wrap.outerHeight());
        };

        LayerManager.prototype.setHeightDimmed = function setHeightDimmed(screenHeight, wrapHeight) {
            var dimHeight = screenHeight <= wrapHeight ? wrapHeight : screenHeight;

            this.$dimmed.css('height', dimHeight);
        };

        /**
         * dimmed 요소 보이기
         */


        LayerManager.prototype.showDimmed = function showDimmed() {
            this.$dimmed.show();
            $('html').addClass(STATIC.CSS.LAYER_OPEN);
        };

        /**
         * dimmed 요소 숨기기
         */


        LayerManager.prototype.hideDimmed = function hideDimmed() {
            this.$dimmed.remove();
            $('html').removeClass(STATIC.CSS.LAYER_OPEN);
        };

        LayerManager.prototype.enforceFocusLayer = function enforceFocusLayer() {
            var $wrap = this.$wrap;

            var timer = setTimeout(function() {
                $wrap.attr('tabindex', -1).focus();
                clearTimeout(timer);
            }, 50);
        };

        /**
         * 레이어와 연결된 요소로 포커스 이동
         */


        LayerManager.prototype.enforceFocusLinked = function enforceFocusLinked() {
            var _this = this;

            if (!this.$linked) return;

            var timer = setTimeout(function() {
                _this.$linked.focus();
                clearTimeout(timer);
            }, 50);
        };

        LayerManager.prototype.getData = function getData(customEventName) {
            return {
                type: customEventName,
                manager: this,
                layer: this.$layer,
                linked: this.getLinked()
            };
        };

        return LayerManager;
    }();

    $(document).on('click', '[data-module-id="layer"]', function(e) {
        var $linked = $(this);
        var $layer = $($linked.data('layer-target'));

        if ($linked.is('a')) e.preventDefault();

        new win.smg.global.LayerManager({
            layer: $layer,
            linked: $linked
        });
    });
})(window, jQuery);
//# sourceMappingURL=smg.global.layermanager.js.map