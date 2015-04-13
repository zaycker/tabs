define([
    'backbone',
    'Backbone.View.Elements',
    'underscore',
    'backbone.anchor/lib/anchor'
], function (Backbone, ElementsView, _, anchor) {
    'use strict';

    /**
     * @class Tabs
     * @extends ElementsView
     */
    var Tabs = ElementsView.extend(/** @lends Tabs# */{
        /**
         * @see {@link ElementsView._classes}
         * @protected
         * @returns {Object}
         */
        _classes: function () {
            return _.defaults({
                activeTitle: 'tabs__title_active_yes',
                activeBody: 'tabs__body_active_yes'
            }, this._super());
        },

        /**
         * @see {@link ElementsView._selectors}
         * @protected
         * @returns {Object}
         */
        _selectors: function () {
            var selectors = {
                body: '.tabs__body',
                bodies: '> .tabs__body',
                control: '.tabs__control',
                controls: '.tabs__titles:first .tabs__control',
                title: '.tabs__title',
                titles: '.tabs__titles:first .tabs__title'
            };
            selectors.link = selectors.controls + '[href$="%s"], ' + selectors.controls + '[href="#%s"]';
            return _.defaults(selectors, this._super());
        },

        /**
         * @see {@link Backbone.View.events}
         * @protected
         * @returns {Object}
         */
        events: function () {
            var events = this._super();
            events['click ' + this._selector('controls')] = this._onTabClick;
            return events;
        },

        /**
         * @protected
         */
        _initProperties: function () {
            this._super();

            /**
             * @type {?string}
             * @protected
             */
            this._activeTab = null;
        },

        /**
         * @constructs
         */
        initialize: function () {
            this._super();

            this._initActiveTab();
            this._linkWithAnchor();
        },

        /**
         * @private
         */
        _linkWithAnchor: function () {
            var name = this.getName();
            anchor.on('change:' + name, this._onHashChange, this);
            if (anchor.has(name)) {
                this.show(anchor.get(name));
            }
        },

        /**
         * @param {Backbone.Model} model
         * @param {string} tabName
         * @private
         */
        _onHashChange: function (model, tabName) {
            this.show(tabName);
        },

        /**
         * @protected
         */
        _initActiveTab: function () {
            this._activeTab = this._getTabNameFromEl(this._elem('controls')[0]);
        },

        /**
         * @param {jQuery.Event} e
         * @private
         */
        _onTabClick: function (e) {
            e.preventDefault();
            var el = e.currentTarget,
                tabName = this._getTabNameFromEl(el);
            this.show(tabName);
        },

        /**
         * @public
         * @param {string} name
         * @returns {Tabs} this
         */
        show: function (name) {
            if (this._activeTab === name) {
                return this;
            }
            this._setActiveTab(name);
            anchor.set(this.getName(), name);
            return this;
        },

        /**
         * @param {string} name
         * @private
         */
        _setActiveTab: function (name) {
            var $title = this._getTabTitleByName(name),
                tabIndex = this._elem('titles').index($title),
                $body = this._elem('bodies').eq(tabIndex);

            this._removeClass('activeTitle', 'titles');
            this._addClass('activeTitle', $title);
            this._removeClass('activeBody', 'bodies');
            this._addClass('activeBody', $body);

            this._activeTab = name;

            this.trigger('change', name, this);
            Backbone.trigger('change:visibility');
        },

        /**
         * @param {HTMLAnchorElement} el
         * @protected
         * @returns {string}
         */
        _getTabNameFromEl: function (el) {
            return this._getNamesPairFromEl(el)[1];
        },

        /**
         * @param {HTMLAnchorElement} el
         * @private
         * @returns {Array.<string>}
         */
        _getNamesPairFromEl: function (el) {
            return el.href.split('#')[1].split('=');
        },

        /**
         * @param {string} tabName
         * @method
         * @protected
         */
        _getTabTitleByName: function (tabName) {
            // todo: fix ElementsView "use selector with object"
            return this._elem('link', tabName, tabName).closest(this._selector('title'));
        },

        /**
         * @public
         * @method
         * @returns {string}
         */
        getName: _.method.once(function () {
            return this._getNamesPairFromEl(this._elem('controls')[0])[0];
        }),

        /**
         * @returns {?string}
         */
        getActiveTabName: function () {
            return this._activeTab;
        }
    });
    return Tabs;
});