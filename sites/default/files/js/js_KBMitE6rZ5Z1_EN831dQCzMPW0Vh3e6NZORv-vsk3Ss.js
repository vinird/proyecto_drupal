/**
 * @file
 * JavaScript API for the History module, with client-side caching.
 *
 * May only be loaded for authenticated users, with the History module enabled.
 */

(function ($, Drupal, drupalSettings, storage) {

  'use strict';

  var currentUserID = parseInt(drupalSettings.user.uid, 10);

  // Any comment that is older than 30 days is automatically considered read,
  // so for these we don't need to perform a request at all!
  var thirtyDaysAgo = Math.round(new Date().getTime() / 1000) - 30 * 24 * 60 * 60;

  // Use the data embedded in the page, if available.
  var embeddedLastReadTimestamps = false;
  if (drupalSettings.history && drupalSettings.history.lastReadTimestamps) {
    embeddedLastReadTimestamps = drupalSettings.history.lastReadTimestamps;
  }

  /**
   * @namespace
   */
  Drupal.history = {

    /**
     * Fetch "last read" timestamps for the given nodes.
     *
     * @param {Array} nodeIDs
     *   An array of node IDs.
     * @param {function} callback
     *   A callback that is called after the requested timestamps were fetched.
     */
    fetchTimestamps: function (nodeIDs, callback) {
      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps) {
        callback();
        return;
      }

      $.ajax({
        url: Drupal.url('history/get_node_read_timestamps'),
        type: 'POST',
        data: {'node_ids[]': nodeIDs},
        dataType: 'json',
        success: function (results) {
          for (var nodeID in results) {
            if (results.hasOwnProperty(nodeID)) {
              storage.setItem('Drupal.history.' + currentUserID + '.' + nodeID, results[nodeID]);
            }
          }
          callback();
        }
      });
    },

    /**
     * Get the last read timestamp for the given node.
     *
     * @param {number|string} nodeID
     *   A node ID.
     *
     * @return {number}
     *   A UNIX timestamp.
     */
    getLastRead: function (nodeID) {
      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
        return parseInt(embeddedLastReadTimestamps[nodeID], 10);
      }
      return parseInt(storage.getItem('Drupal.history.' + currentUserID + '.' + nodeID) || 0, 10);
    },

    /**
     * Marks a node as read, store the last read timestamp client-side.
     *
     * @param {number|string} nodeID
     *   A node ID.
     */
    markAsRead: function (nodeID) {
      $.ajax({
        url: Drupal.url('history/' + nodeID + '/read'),
        type: 'POST',
        dataType: 'json',
        success: function (timestamp) {
          // If the data is embedded in the page, don't store on the client
          // side.
          if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
            return;
          }

          storage.setItem('Drupal.history.' + currentUserID + '.' + nodeID, timestamp);
        }
      });
    },

    /**
     * Determines whether a server check is necessary.
     *
     * Any content that is >30 days old never gets a "new" or "updated"
     * indicator. Any content that was published before the oldest known reading
     * also never gets a "new" or "updated" indicator, because it must've been
     * read already.
     *
     * @param {number|string} nodeID
     *   A node ID.
     * @param {number} contentTimestamp
     *   The time at which some content (e.g. a comment) was published.
     *
     * @return {bool}
     *   Whether a server check is necessary for the given node and its
     *   timestamp.
     */
    needsServerCheck: function (nodeID, contentTimestamp) {
      // First check if the content is older than 30 days, then we can bail
      // early.
      if (contentTimestamp < thirtyDaysAgo) {
        return false;
      }

      // Use the data embedded in the page, if available.
      if (embeddedLastReadTimestamps && embeddedLastReadTimestamps[nodeID]) {
        return contentTimestamp > parseInt(embeddedLastReadTimestamps[nodeID], 10);
      }

      var minLastReadTimestamp = parseInt(storage.getItem('Drupal.history.' + currentUserID + '.' + nodeID) || 0, 10);
      return contentTimestamp > minLastReadTimestamp;
    }
  };

})(jQuery, Drupal, drupalSettings, window.localStorage);
;
/**
 * @file
 * Marks the nodes listed in drupalSettings.history.nodesToMarkAsRead as read.
 *
 * Uses the History module JavaScript API.
 *
 * @see Drupal.history
 */

(function (window, Drupal, drupalSettings) {

  'use strict';

  // When the window's "load" event is triggered, mark all enumerated nodes as
  // read. This still allows for Drupal behaviors (which are triggered on the
  // "DOMContentReady" event) to add "new" and "updated" indicators.
  window.addEventListener('load', function () {
    if (drupalSettings.history && drupalSettings.history.nodesToMarkAsRead) {
      Object.keys(drupalSettings.history.nodesToMarkAsRead).forEach(Drupal.history.markAsRead);
    }
  });

})(window, Drupal, drupalSettings);
;
/*!
 * jQuery UI Droppable 1.11.4
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 */(function(e){typeof define=="function"&&define.amd?define(["jquery","./core","./widget","./mouse","./draggable"],e):e(jQuery)})(function(e){return e.widget("ui.droppable",{version:"1.11.4",widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect",activate:null,deactivate:null,drop:null,out:null,over:null},_create:function(){var t,n=this.options,r=n.accept;this.isover=!1,this.isout=!0,this.accept=e.isFunction(r)?r:function(e){return e.is(r)},this.proportions=function(){if(!arguments.length)return t?t:t={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight};t=arguments[0]},this._addToManager(n.scope),n.addClasses&&this.element.addClass("ui-droppable")},_addToManager:function(t){e.ui.ddmanager.droppables[t]=e.ui.ddmanager.droppables[t]||[],e.ui.ddmanager.droppables[t].push(this)},_splice:function(e){var t=0;for(;t<e.length;t++)e[t]===this&&e.splice(t,1)},_destroy:function(){var t=e.ui.ddmanager.droppables[this.options.scope];this._splice(t),this.element.removeClass("ui-droppable ui-droppable-disabled")},_setOption:function(t,n){if(t==="accept")this.accept=e.isFunction(n)?n:function(e){return e.is(n)};else if(t==="scope"){var r=e.ui.ddmanager.droppables[this.options.scope];this._splice(r),this._addToManager(n)}this._super(t,n)},_activate:function(t){var n=e.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),n&&this._trigger("activate",t,this.ui(n))},_deactivate:function(t){var n=e.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),n&&this._trigger("deactivate",t,this.ui(n))},_over:function(t){var n=e.ui.ddmanager.current;if(!n||(n.currentItem||n.element)[0]===this.element[0])return;this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",t,this.ui(n)))},_out:function(t){var n=e.ui.ddmanager.current;if(!n||(n.currentItem||n.element)[0]===this.element[0])return;this.accept.call(this.element[0],n.currentItem||n.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",t,this.ui(n)))},_drop:function(t,n){var r=n||e.ui.ddmanager.current,i=!1;return!r||(r.currentItem||r.element)[0]===this.element[0]?!1:(this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function(){var n=e(this).droppable("instance");if(n.options.greedy&&!n.options.disabled&&n.options.scope===r.options.scope&&n.accept.call(n.element[0],r.currentItem||r.element)&&e.ui.intersect(r,e.extend(n,{offset:n.element.offset()}),n.options.tolerance,t))return i=!0,!1}),i?!1:this.accept.call(this.element[0],r.currentItem||r.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",t,this.ui(r)),this.element):!1)},ui:function(e){return{draggable:e.currentItem||e.element,helper:e.helper,position:e.position,offset:e.positionAbs}}}),e.ui.intersect=function(){function e(e,t,n){return e>=t&&e<t+n}return function(t,n,r,i){if(!n.offset)return!1;var s=(t.positionAbs||t.position.absolute).left+t.margins.left,o=(t.positionAbs||t.position.absolute).top+t.margins.top,u=s+t.helperProportions.width,a=o+t.helperProportions.height,f=n.offset.left,l=n.offset.top,c=f+n.proportions().width,h=l+n.proportions().height;switch(r){case"fit":return f<=s&&u<=c&&l<=o&&a<=h;case"intersect":return f<s+t.helperProportions.width/2&&u-t.helperProportions.width/2<c&&l<o+t.helperProportions.height/2&&a-t.helperProportions.height/2<h;case"pointer":return e(i.pageY,l,n.proportions().height)&&e(i.pageX,f,n.proportions().width);case"touch":return(o>=l&&o<=h||a>=l&&a<=h||o<l&&a>h)&&(s>=f&&s<=c||u>=f&&u<=c||s<f&&u>c);default:return!1}}}(),e.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(t,n){var r,i,s=e.ui.ddmanager.droppables[t.options.scope]||[],o=n?n.type:null,u=(t.currentItem||t.element).find(":data(ui-droppable)").addBack();e:for(r=0;r<s.length;r++){if(s[r].options.disabled||t&&!s[r].accept.call(s[r].element[0],t.currentItem||t.element))continue;for(i=0;i<u.length;i++)if(u[i]===s[r].element[0]){s[r].proportions().height=0;continue e}s[r].visible=s[r].element.css("display")!=="none";if(!s[r].visible)continue;o==="mousedown"&&s[r]._activate.call(s[r],n),s[r].offset=s[r].element.offset(),s[r].proportions({width:s[r].element[0].offsetWidth,height:s[r].element[0].offsetHeight})}},drop:function(t,n){var r=!1;return e.each((e.ui.ddmanager.droppables[t.options.scope]||[]).slice(),function(){if(!this.options)return;!this.options.disabled&&this.visible&&e.ui.intersect(t,this,this.options.tolerance,n)&&(r=this._drop.call(this,n)||r),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],t.currentItem||t.element)&&(this.isout=!0,this.isover=!1,this._deactivate.call(this,n))}),r},dragStart:function(t,n){t.element.parentsUntil("body").bind("scroll.droppable",function(){t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n)})},drag:function(t,n){t.options.refreshPositions&&e.ui.ddmanager.prepareOffsets(t,n),e.each(e.ui.ddmanager.droppables[t.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible)return;var r,i,s,o=e.ui.intersect(t,this,this.options.tolerance,n),u=!o&&this.isover?"isout":o&&!this.isover?"isover":null;if(!u)return;this.options.greedy&&(i=this.options.scope,s=this.element.parents(":data(ui-droppable)").filter(function(){return e(this).droppable("instance").options.scope===i}),s.length&&(r=e(s[0]).droppable("instance"),r.greedyChild=u==="isover")),r&&u==="isover"&&(r.isover=!1,r.isout=!0,r._out.call(r,n)),this[u]=!0,this[u==="isout"?"isover":"isout"]=!1,this[u==="isover"?"_over":"_out"].call(this,n),r&&u==="isout"&&(r.isout=!1,r.isover=!0,r._over.call(r,n))})},dragStop:function(t,n){t.element.parentsUntil("body").unbind("scroll.droppable"),t.options.refreshPositions||e.ui.ddmanager.prepareOffsets(t,n)}},e.ui.droppable});;
/**
 * @file
 * Attaches behavior for the Panels IPE module.
 *
 */

(function ($, _, Backbone, Drupal, drupalSettings) {

  'use strict';

  /**
   * Contains initial Backbone initialization for the IPE.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.panels_ipe = {
    attach: function (context, settings) {
      // Perform initial setup of our app.
      $('body').once('panels-ipe-init').each(Drupal.panels_ipe.init, [settings]);

      // @todo Make every settings-related thing a generic event, or add a
      // panels_ipe event command to Drupal.ajax.

      // We need to add/update a new BlockModel somewhere. Inform the App that
      // this has occurred.
      if (settings['panels_ipe']['updated_block']) {
        var blockData = settings['panels_ipe']['updated_block'];
        // Remove the setting.
        delete settings['panels_ipe']['updated_block'];
        // Create a BlockModel.
        var block = new Drupal.panels_ipe.BlockModel(blockData);
        // Trigger the event.
        Drupal.panels_ipe.app.trigger('addBlockPlugin', block, blockData.region);
      }

      // We need to add/update our Layout Inform the App that this has occurred.
      if (settings['panels_ipe']['updated_layout']) {
        var layoutData = settings['panels_ipe']['updated_layout'];
        // Remove the setting.
        delete settings['panels_ipe']['updated_layout'];
        // Create a LayoutModel.
        layoutData = Drupal.panels_ipe.LayoutModel.prototype.parse(layoutData);
        var layout = new Drupal.panels_ipe.LayoutModel(layoutData);
        // Trigger the event.
        Drupal.panels_ipe.app.trigger('changeLayout', layout);
      }

      // Toggle the preview - We need to do this with drupalSettings as the
      // animation won't work if triggered by a form submit. It must occur after
      // the form is rendered.
      if (context.className === 'panels-ipe-block-plugin-form flip-container'
        && settings['panels_ipe']['toggle_preview']) {
        var $form = $('.ipe-block-form');

        // Flip the form.
        $form.toggleClass('flipped');

        // Calculate and set new heights, if appropriate.
        Drupal.panels_ipe.setFlipperHeight($form);

        // As images can load late on new content, recalculate the flipper
        // height on image load.
        $form.find('img').each(function () {
          $(this).load(function () {
            Drupal.panels_ipe.setFlipperHeight($form);
          });
        });

        delete settings['panels_ipe']['toggle_preview'];
      }

      // A new Block Content entity has been created. Trigger an app-level event
      // to switch tabs and open the placement form.
      if (settings['panels_ipe']['new_block_content']) {
        var newBlockData = settings['panels_ipe']['new_block_content'];
        delete settings['panels_ipe']['new_block_content'];
        Drupal.panels_ipe.app.trigger('addContentBlock', newBlockData);
      }

      // A Block Content entity has been edited.
      if (settings['panels_ipe']['edit_block_content']) {
        var editBlockData = settings['panels_ipe']['edit_block_content'];
        delete settings['panels_ipe']['edit_block_content'];
        Drupal.panels_ipe.app.trigger('editContentBlockDone', editBlockData);
      }
    }
  };

  /**
   * @namespace
   */
  Drupal.panels_ipe = {};

  /**
   * Setups up our initial Collection and Views based on the current settings.
   *
   * @param {Object} settings
   *   The contextual drupalSettings.
   */
  Drupal.panels_ipe.init = function (settings) {
    settings = settings || drupalSettings;
    // Set up our initial tabs.
    var tab_collection = new Drupal.panels_ipe.TabCollection();

    if (!settings.panels_ipe.locked) {
      if (settings.panels_ipe.user_permission.change_layout) {
        tab_collection.add(createTabModel(Drupal.t('Change Layout'), 'change_layout'));
      }
      tab_collection.add(createTabModel(Drupal.t('Manage Content'), 'manage_content'));
    }

    // The edit/save/cancel tabs are special, and are tracked by our app.
    var edit_tab = createTabModel(Drupal.t('Edit'), 'edit');
    var save_tab = createTabModel(Drupal.t('Save'), 'save');
    var cancel_tab = createTabModel(Drupal.t('Cancel'), 'cancel');
    var locked_tab = createTabModel(Drupal.t('Locked'), 'locked');
    tab_collection.add(edit_tab);
    tab_collection.add(save_tab);
    tab_collection.add(cancel_tab);
    tab_collection.add(locked_tab);

    // Create a global(ish) AppModel.
    Drupal.panels_ipe.app = new Drupal.panels_ipe.AppModel({
      tabCollection: tab_collection,
      editTab: edit_tab,
      saveTab: save_tab,
      cancelTab: cancel_tab,
      lockedTab: locked_tab,
      locked: settings.panels_ipe.locked,
      unsaved: settings.panels_ipe.unsaved
    });

    // Set up our initial tab views.
    var tab_views = {};
    if (settings.panels_ipe.user_permission.change_layout) {
      tab_views.change_layout = new Drupal.panels_ipe.LayoutPicker();
    }
    tab_views.manage_content = new Drupal.panels_ipe.BlockPicker();

    // Create an AppView instance.
    Drupal.panels_ipe.app_view = new Drupal.panels_ipe.AppView({
      model: Drupal.panels_ipe.app,
      el: '#panels-ipe-tray',
      tabContentViews: tab_views
    });

    // Assemble the initial region and block collections.
    // This logic is a little messy, as traditionally we would never initialize
    // Backbone with existing HTML content.
    var region_collection = new Drupal.panels_ipe.RegionCollection();
    for (var i in settings.panels_ipe.regions) {
      if (settings.panels_ipe.regions.hasOwnProperty(i)) {
        var region = new Drupal.panels_ipe.RegionModel();
        region.set(settings.panels_ipe.regions[i]);

        var block_collection = new Drupal.panels_ipe.BlockCollection();
        for (var j in settings.panels_ipe.regions[i].blocks) {
          if (settings.panels_ipe.regions[i].blocks.hasOwnProperty(j)) {
            // Add a new block model.
            var block = new Drupal.panels_ipe.BlockModel();
            block.set(settings.panels_ipe.regions[i].blocks[j]);
            block_collection.add(block);
          }
        }

        region.set({blockCollection: block_collection});

        region_collection.add(region);
      }
    }

    // Create the Layout model/view.
    var layout = new Drupal.panels_ipe.LayoutModel(settings.panels_ipe.layout);
    layout.set({regionCollection: region_collection});
    var layout_view = new Drupal.panels_ipe.LayoutView({
      model: layout,
      el: '#panels-ipe-content'
    });

    Drupal.panels_ipe.app.set({layout: layout});
    Drupal.panels_ipe.app_view.layoutView = layout_view;

    // Trigger a global Backbone event informing other Views that we're done
    // initializing and ready to render.
    Backbone.trigger('PanelsIPEInitialized');

    // Render our AppView, without rendering the layout.
    $('body').append(Drupal.panels_ipe.app_view.render(false).$el);

    // Set our initial URL root.
    Drupal.panels_ipe.setUrlRoot(settings);

    function createTabModel(title, id) {
      return new Drupal.panels_ipe.TabModel({title: title, id: id});
    }
  };

  Drupal.panels_ipe.setFlipperHeight = function ($form) {
    // The preview could be larger than the form.
    // Manually set the height to be sure that things fit.
    var $new_side;
    var $current_side;
    if ($form.hasClass('flipped')) {
      $new_side = $form.find('.flipper > .back');
      $current_side = $form.find('.flipper > .front');
    }
    else {
      $new_side = $form.find('.flipper > .front');
      $current_side = $form.find('.flipper > .back');
    }

    $current_side.animate({height: $new_side.outerHeight() + 10}, 600);
  };

  /**
   * Returns the urlRoot for all callbacks.
   *
   * @param {Object} settings
   *   The contextual drupalSettings.
   *
   * @return {string}
   *   A base path for most other URL callbacks in this App.
   */
  Drupal.panels_ipe.urlRoot = function (settings) {
    return settings.panels_ipe.url_root;
  };

  /**
   * Sets the urlRoot for all callbacks.
   *
   * @param {Object} settings
   *   The contextual drupalSettings.
   */
  Drupal.panels_ipe.setUrlRoot = function (settings) {
    var panels_display = settings.panels_ipe.panels_display;
    settings.panels_ipe.url_root = settings.path.baseUrl + settings.path.pathPrefix + 'admin/panels_ipe/variant/' + panels_display.storage_type + '/' + panels_display.storage_id;
  };

}(jQuery, _, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * The primary Backbone model for Panels IPE.
 *
 * @see Drupal.panels_ipe.AppView
 */

(function (Backbone, Drupal) {

  'use strict';

  /**
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.panels_ipe.AppModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.AppModel# */{

    /**
     * @type {object}
     *
     * @prop {bool} active
     * @prop {Drupal.panels_ipe.TabModel} activeTab
     * @prop {Drupal.panels_ipe.BlockModel} activeBlock
     * @prop {Drupal.panels_ipe.RegionModel} activeRegion
     */
    defaults: /** @lends Drupal.panels_ipe.AppModel# */{

      /**
       * Whether or not the editing part of the application is active.
       *
       * @type {bool}
       */
      active: false,

      /**
       * The current Layout.
       *
       * @type {Drupal.panels_ipe.LayoutModel}
       */
      layout: null,

      /**
       * A collection of all tabs on screen.
       *
       * @type {Drupal.panels_ipe.TabCollection}
       */
      tabCollection: null,

      /**
       * The "Locked" tab.
       *
       * @type {Drupal.panels_ipe.TabModel}
       */
      lockedTab: null,

      /**
       * The "Edit" tab.
       *
       * @type {Drupal.panels_ipe.TabModel}
       */
      editTab: null,

      /**
       * The "Save" tab.
       *
       * @type {Drupal.panels_ipe.TabModel}
       */
      saveTab: null,

      /**
       * The "Cancel" tab.
       *
       * @type {Drupal.panels_ipe.TabModel}
       */
      cancelTab: null,

      /**
       * Whether or not there are unsaved changes.
       *
       * @type {bool}
       */
      unsaved: false
    }

  });

}(Backbone, Drupal));
;
/**
 * @file
 * Base Backbone model for a Block Content Type.
 */

(function (_, $, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.BlockContentTypeModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.BlockContentTypeModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.panels_ipe.BlockContentTypeModel# */{

      /**
       * The content type ID.
       *
       * @type {string}
       */
      id: null,

      /**
       * Whether or not entities of this type are revisionable by default.
       *
       * @type {bool}
       */
      revision: null,

      /**
       * The content type label.
       *
       * @type {string}
       */
      label: null,

      /**
       * The content type description.
       *
       * @type {string}
       */
      description: null
    }

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.BlockContentTypeCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.BlockContentTypeCollection# */{

    /**
     * @type {Drupal.panels_ipe.BlockContentTypeModel}
     */
    model: Drupal.panels_ipe.BlockContentTypeModel,

    /**
     * @type {function}
     *
     * @return {string}
     *   The URL required to sync this collection with the server.
     */
    url: function () {
      return Drupal.panels_ipe.urlRoot(drupalSettings) + '/block_content/types';
    }

  });

}(_, jQuery, Backbone, Drupal));
;
/**
 * @file
 * Base Backbone model for a Block.
 */

(function (_, $, Backbone, Drupal, drupalSettings) {

  'use strict';

  Drupal.panels_ipe.BlockModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.BlockModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.panels_ipe.BlockModel# */{

      /**
       * The block state.
       *
       * @type {bool}
       */
      active: false,

      /**
       * The ID of the block.
       *
       * @type {string}
       */
      id: null,

      /**
       * The unique ID of the block.
       *
       * @type {string}
       */
      uuid: null,

      /**
       * The label of the block.
       *
       * @type {string}
       */
      label: null,

      /**
       * The provider for the block (usually the module name).
       *
       * @type {string}
       */
      provider: null,

      /**
       * The ID of the plugin for this block.
       *
       * @type {string}
       */
      plugin_id: null,

      /**
       * The HTML content of the block. This is stored in the model as the
       * IPE doesn't actually care what the block's content is, the functional
       * elements of the model are the metadata. The BlockView renders this
       * wrapped inside IPE elements.
       *
       * @type {string}
       */
      html: null,

      /**
       * Whether or not this block is currently in a syncing state.
       *
       * @type {bool}
       */
      syncing: false

    },

    /**
     * @type {function}
     *
     * @return {string}
     *   A URL that can be used to refresh this Block model. Only fetch methods
     *   are supported currently.
     */
    url: function () {
      return Drupal.panels_ipe.urlRoot(drupalSettings) + '/block/' + this.get('uuid');
    }

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.BlockCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.BlockCollection# */{

    /**
     * @type {Drupal.panels_ipe.BlockModel}
     */
    model: Drupal.panels_ipe.BlockModel,

    /**
     * For Blocks, our identifier is the UUID, not the ID.
     *
     * @type {function}
     *
     * @param {Object} attrs
     *   The attributes of the current model in the collection.
     *
     * @return {string}
     *   The value of a BlockModel's UUID.
     */
    modelId: function (attrs) {
      return attrs.uuid;
    },

    /**
     * Moves a Block up or down in this collection.
     *
     * @type {function}
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *  The BlockModel you want to move.
     * @param {string} direction
     *  The string name of the direction (either "up" or "down").
     */
    shift: function (block, direction) {
      var index = this.indexOf(block);
      if ((direction === 'up' && index > 0) || (direction === 'down' && index < this.models.length)) {
        this.remove(block, {silent: true});
        var new_index = direction === 'up' ? index - 1 : index + 1;
        this.add(block, {at: new_index, silent: true});
      }
    }

  });

}(_, jQuery, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * Base Backbone model for a Block Plugin.
 */

(function (_, $, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.BlockPluginModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.BlockPluginModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.panels_ipe.BlockPluginModel# */{

      /**
       * The plugin ID.
       *
       * @type {string}
       */
      plugin_id: null,

      /**
       * The block's id (machine name).
       *
       * @type {string}
       */
      id: null,

      /**
       * The plugin label.
       *
       * @type {string}
       */
      label: null,

      /**
       * The category of the plugin.
       *
       * @type {string}
       */
      category: null,

      /**
       * The provider for the block (usually the module name).
       *
       * @type {string}
       */
      provider: null

    },

    idAttribute: 'plugin_id'

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.BlockPluginCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.BlockPluginCollection# */{

    /**
     * @type {Drupal.panels_ipe.BlockPluginModel}
     */
    model: Drupal.panels_ipe.BlockPluginModel,

    /**
     * Defines a sort parameter for the collection.
     *
     * @type {string}
     */
    comparator: 'category',

    /**
     * For Block Plugins, our identifier is the plugin id.
     *
     * @type {function}
     *
     * @param {Object} attrs
     *   The attributes of the current model in the collection.
     *
     * @return {string}
     *   A string representing a BlockPlugin's id.
     */
    modelId: function (attrs) {
      return attrs.plugin_id;
    },

    /**
     * @type {function}
     *
     * @return {string}
     *   The URL required to sync this collection with the server.
     */
    url: function () {
      return Drupal.panels_ipe.urlRoot(drupalSettings) + '/block_plugins';
    }

  });

}(_, jQuery, Backbone, Drupal));
;
/**
 * @file
 * Base Backbone model for a Region.
 *
 * @todo Support sync operations to refresh a region, even if we don't have
 * a use case for that yet.
 */

(function (_, $, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.RegionModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.RegionModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.panels_ipe.RegionModel# */{

      /**
       * The machine name of the region.
       *
       * @type {string}
       */
      name: null,

      /**
       * The label of the region.
       *
       * @type {string}
       */
      label: null,

      /**
       * A BlockCollection for all blocks in this region.
       *
       * @type {Drupal.panels_ipe.BlockCollection}
       *
       * @see Drupal.panels_ipe.BlockCollection
       */
      blockCollection: null
    },

    /**
     * Checks if our BlockCollection contains a given Block UUID.
     *
     * @param {string} block_uuid
     *   The universally unique identifier of the block.
     *
     * @return {boolean}
     *   Whether the BlockCollection contains the block.
     */
    hasBlock: function (block_uuid) {
      return this.get('blockCollection').get(block_uuid) ? true : false;
    },

    /**
     * Gets a Block from our BlockCollection based on its UUID.
     *
     * @param {string} block_uuid
     *   The universally unique identifier of the block.
     *
     * @return {Drupal.panels_ipe.BlockModel|undefined}
     *   The block if it is inside this region.
     */
    getBlock: function (block_uuid) {
      return this.get('blockCollection').get(block_uuid);
    },

    /**
     * Removes a Block from our BlockCollection based on its UUID.
     *
     * @param {Drupal.panels_ipe.BlockModel|string} block
     *   The block or it's universally unique identifier.
     * @param {object} options
     *   Block related configuration.
     */
    removeBlock: function (block, options) {
      this.get('blockCollection').remove(block, options);
    },

    /**
     * Adds a new BlockModel to our BlockCollection.
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *   The block that needs to be added.
     * @param {object} options
     *   Block related configuration.
     */
    addBlock: function (block, options) {
      this.get('blockCollection').add(block, options);
    }

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.RegionCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.RegionCollection# */{

    /**
     * @type {Drupal.panels_ipe.RegionModel}
     */
    model: Drupal.panels_ipe.RegionModel,

    /**
     * For Regions, our identifier is the region name.
     *
     * @type {function}
     *
     * @param {Object} attrs
     *   The current RegionModel's attributes.
     *
     * @return {string}
     *   The current RegionModel's name attribute.
     */
    modelId: function (attrs) {
      return attrs.name;
    }

  });

}(_, jQuery, Backbone, Drupal));
;
/**
 * @file
 * A .
 *
 * @see Drupal.panels_ipe.TabView
 */

(function (Backbone, Drupal) {

  'use strict';

  /**
   * @constructor
   *
   * @augments Backbone.Model
   */
  Drupal.panels_ipe.TabModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.TabModel# */{

    /**
     * @type {object}
     *
     * @prop {bool} active
     * @prop {string} title
     */
    defaults: /** @lends Drupal.panels_ipe.TabModel# */{

      /**
       * The ID of the tab.
       *
       * @type {int}
       */
      id: null,

      /**
       * Whether or not the tab is active.
       *
       * @type {bool}
       */
      active: false,

      /**
       * Whether or not the tab is hidden.
       *
       * @type {bool}
       */
      hidden: false,

      /**
       * Whether or not the tab is loading.
       *
       * @type {bool}
       */
      loading: false,

      /**
       * The title of the tab.
       *
       * @type {string}
       */
      title: null
    }

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.TabCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.TabCollection# */{

    /**
     * @type {Drupal.panels_ipe.TabModel}
     */
    model: Drupal.panels_ipe.TabModel
  });

}(Backbone, Drupal));
;
/**
 * @file
 * Base Backbone model for a Layout.
 */

(function (_, $, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.LayoutModel = Backbone.Model.extend(/** @lends Drupal.panels_ipe.LayoutModel# */{

    /**
     * @type {object}
     */
    defaults: /** @lends Drupal.panels_ipe.LayoutModel# */{

      /**
       * The layout machine name.
       *
       * @type {string}
       */
      id: null,

      /**
       * Whether or not this was the original layout for the variant.
       *
       * @type {bool}
       */
      original: false,

      /**
       * The layout label.
       *
       * @type {string}
       */
      label: null,

      /**
       * The layout icon.
       *
       * @type {string}
       */
      icon: null,

      /**
       * Whether or not this is the current layout.
       *
       * @type {bool}
       */
      current: false,

      /**
       * The wrapping HTML for this layout. Only used for initial rendering.
       *
       * @type {string}
       */
      html: null,

      /**
       * A collection of regions contained in this Layout.
       *
       * @type {Drupal.panels_ipe.RegionCollection}
       */
      regionCollection: null,

      /**
       * An array of Block UUIDs that we need to delete.
       *
       * @type {Array}
       */
      deletedBlocks: []


    },

    /**
     * Overrides the isNew method to mark if this is the initial layout or not.
     *
     * @return {bool}
     *   A boolean which determines if this Block was on the page on load.
     */
    isNew: function () {
      return !this.get('original');
    },

    /**
     * Overrides the parse method to set our regionCollection dynamically.
     *
     * @param {Object} resp
     *   The decoded JSON response from the backend server.
     * @param {Object} options
     *   Additional options passed to parse.
     *
     * @return {Object}
     *   An object representing a LayoutModel's attributes.
     */
    parse: function (resp, options) {
      // If possible, initialize our region collection.
      if (typeof resp.regions != 'undefined') {
        resp.regionCollection = new Drupal.panels_ipe.RegionCollection();
        for (var i in resp.regions) {
          if (resp.regions.hasOwnProperty(i)) {
            var region = new Drupal.panels_ipe.RegionModel(resp.regions[i]);
            region.set({blockCollection: new Drupal.panels_ipe.BlockCollection()});
            resp.regionCollection.add(region);
          }
        }
      }
      return resp;
    },

    /**
     * @type {function}
     *
     * @return {string}
     *   A URL that can be used to refresh this Layout's attributes.
     */
    url: function () {
      return Drupal.panels_ipe.urlRoot(drupalSettings) + '/layouts/' + this.get('id');
    }

  });

  /**
   * @constructor
   *
   * @augments Backbone.Collection
   */
  Drupal.panels_ipe.LayoutCollection = Backbone.Collection.extend(/** @lends Drupal.panels_ipe.LayoutCollection# */{

    /**
     * @type {Drupal.panels_ipe.LayoutModel}
     */
    model: Drupal.panels_ipe.LayoutModel,

    /**
     * @type {function}
     *
     * @return {string}
     *   A URL that can be used to refresh this collection's child models.
     */
    url: function () {
      return Drupal.panels_ipe.urlRoot(drupalSettings) + '/layouts';
    }

  });

}(_, jQuery, Backbone, Drupal));
;
/**
 * @file
 * The primary Backbone view for Panels IPE. For now this only controls the
 * bottom tray, but in the future could have a larger scope.
 *
 * see Drupal.panels_ipe.AppModel
 */

(function ($, _, Backbone, Drupal, drupalSettings) {

  'use strict';

  Drupal.panels_ipe.AppView = Backbone.View.extend(/** @lends Drupal.panels_ipe.AppView# */{

    /**
     * @type {function}
     */
    template: _.template('<div class="ipe-tab-wrapper"></div>'),

    /**
     * @type {function}
     */
    template_content_block_edit: _.template(
      '<h4>' + Drupal.t('Edit existing "<strong><%- label %></strong>" content') + '</h4>' +
      '<div class="ipe-block-form ipe-form"><div class="ipe-icon ipe-icon-loading"></div></div>'
    ),

    /**
     * @type {Drupal.panels_ipe.TabsView}
     */
    tabsView: null,

    /**
     * @type {Drupal.panels_ipe.LayoutView}
     */
    layoutView: null,

    /**
     * @type {Drupal.panels_ipe.AppModel}
     */
    model: null,

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   An object with the following keys:
     * @param {Drupal.panels_ipe.AppModel} options.model
     *   The application state model.
     * @param {Object} options.tabContentViews
     *   An object mapping TabModel ids to arbitrary Backbone views.
     */
    initialize: function (options) {
      this.model = options.model;

      // Create a TabsView instance.
      this.tabsView = new Drupal.panels_ipe.TabsView({
        collection: this.model.get('tabCollection'),
        tabViews: options.tabContentViews
      });

      // Display the cancel and save tab based on whether or not we have unsaved changes.
      this.model.get('cancelTab').set('hidden', !this.model.get('unsaved'));
      this.model.get('saveTab').set('hidden', !this.model.get('unsaved'));
      // Do not show the edit tab if the IPE is locked.
      this.model.get('editTab').set('hidden', this.model.get('locked'));
      this.model.get('lockedTab').set('hidden', !this.model.get('locked'));

      // Listen to important global events throughout the app.
      this.listenTo(this.model, 'changeLayout', this.changeLayout);
      this.listenTo(this.model, 'addBlockPlugin', this.addBlockPlugin);
      this.listenTo(this.model, 'configureBlock', this.configureBlock);
      this.listenTo(this.model, 'addContentBlock', this.addContentBlock);
      this.listenTo(this.model, 'editContentBlock', this.editContentBlock);
      this.listenTo(this.model, 'editContentBlockDone', this.editContentBlockDone);

      // Listen to tabs that don't have associated BackboneViews.
      this.listenTo(this.model.get('editTab'), 'change:active', this.clickEditTab);
      this.listenTo(this.model.get('saveTab'), 'change:active', this.clickSaveTab);
      this.listenTo(this.model.get('cancelTab'), 'change:active', this.clickCancelTab);
      this.listenTo(this.model.get('lockedTab'), 'change:active', this.clickLockedTab);

      // Change the look/feel of the App if we have unsaved changes.
      this.listenTo(this.model, 'change:unsaved', this.unsavedChange);
    },

    /**
     * Appends the IPE tray to the bottom of the screen.
     *
     * @param {bool} render_layout
     *   Whether or not the layout should be rendered. Useful for just calling
     *   render on UI elements and not content.
     *
     * @return {Drupal.panels_ipe.AppView}
     *   Returns this, for chaining.
     */
    render: function (render_layout) {
      render_layout = typeof render_layout !== 'undefined' ? render_layout : true;

      // Empty our list.
      this.$el.html(this.template(this.model.toJSON()));
      // Add our tab collection to the App.
      this.tabsView.setElement(this.$('.ipe-tab-wrapper')).render();

      // If we have unsaved changes, add a special class.
      this.$el.toggleClass('unsaved', this.model.get('unsaved'));

      // Re-render our layout.
      if (this.layoutView && render_layout) {
        this.layoutView.render();
      }
      return this;
    },

    /**
     * Actives all regions and blocks for editing.
     */
    openIPE: function () {
      var active = this.model.get('active');
      if (active) {
        return;
      }

      // Set our active state correctly.
      this.model.set({active: true});

      // Set the layout's active state correctly.
      this.model.get('layout').set({active: true});

      this.$el.addClass('active');

      // Add a top-level body class.
      $('body').addClass('panels-ipe-active');
    },

    /**
     * Deactivate all regions and blocks for editing.
     */
    closeIPE: function () {
      var active = this.model.get('active');
      if (!active) {
        return;
      }

      // Set our active state correctly.
      this.model.set({active: false});

      // Set the layout's active state correctly.
      this.model.get('layout').set({active: false});

      this.$el.removeClass('active');

      // Remove our top-level body class.
      $('body').removeClass('panels-ipe-active');
    },

    /**
     * Event callback for when a new layout has been selected.
     *
     * @param {Drupal.panels_ipe.LayoutModel} layout
     *   The new layout model.
     */
    changeLayout: function (layout) {
      // Early render the tabs and layout - if changing the Layout was the first
      // action on the page the Layout would have never been rendered.
      this.render();

      // Grab all the blocks from the current layout.
      var regions = this.model.get('layout').get('regionCollection');
      var block_collection = new Drupal.panels_ipe.BlockCollection();

      // @todo Our backend should inform us of region suggestions.
      regions.each(function (region) {
        // If a layout with the same name exists, copy our block collection.
        var new_region = layout.get('regionCollection').get(region.get('name'));
        if (new_region) {
          new_region.set('blockCollection', region.get('blockCollection'));
        }
        // Otherwise add these blocks to our generic pool.
        else {
          block_collection.add(region.get('blockCollection').toJSON());
        }
      });

      // Get the first region in the layout.
      var first_region = layout.get('regionCollection').at(0);

      // Merge our block collection with the existing block collection.
      block_collection.each(function (block) {
        first_region.get('blockCollection').add(block);
      });

      // Change the default layout in our AppModel.
      this.model.set({layout: layout});

      // Change the LayoutView's layout.
      this.layoutView.changeLayout(layout);

      // Re-render the app.
      this.render();

      // Indicate that there are unsaved changes in the app.
      this.model.set('unsaved', true);

      // Switch back to the edit tab.
      this.tabsView.switchTab('edit');
    },

    /**
     * Sets the IPE active state based on the "Edit" TabModel.
     */
    clickEditTab: function () {
      var active = this.model.get('editTab').get('active');
      if (active) {
        this.openIPE();
      }
      else {
        this.closeIPE();
      }
    },

    /**
     * Cancels another user's temporary changes and refreshes the page.
     */
    clickLockedTab: function () {
      var locked_tab = this.model.get('lockedTab');

      if (confirm(Drupal.t('This page is being edited by another user, and is locked from editing by others. Would you like to break this lock?'))) {
        if (locked_tab.get('active') && !locked_tab.get('loading')) {
          // Remove our changes and refresh the page.
          locked_tab.set({loading: true});
          $.ajax(Drupal.panels_ipe.urlRoot(drupalSettings) + '/cancel')
            .done(function () {
              location.reload();
            });
        }
      }
      else {
        locked_tab.set('active', false, {silent: true});
      }
    },

    /**
     * Saves our layout to the server.
     */
    clickSaveTab: function () {
      if (this.model.get('saveTab').get('active')) {
        // Save the Layout and disable the tab.
        var self = this;
        self.model.get('saveTab').set({loading: true});
        this.model.get('layout').save().done(function () {
          self.model.get('saveTab').set({loading: false, active: false});
          self.model.set('unsaved', false);
          self.tabsView.render();
        });
      }
    },

    /**
     * Cancels our temporary changes and refreshes the page.
     */
    clickCancelTab: function () {
      var cancel_tab = this.model.get('cancelTab');

      if (confirm(Drupal.t('Are you sure you want to cancel your changes?'))) {
        if (cancel_tab.get('active') && !cancel_tab.get('loading')) {
          // Remove our changes and refresh the page.
          cancel_tab.set({loading: true});
          $.ajax(Drupal.panels_ipe.urlRoot(drupalSettings) + '/cancel')
            .done(function (data) {
              location.reload();
            });
        }
      }
      else {
        cancel_tab.set('active', false, {silent: true});
      }
    },

    /**
     * Adds a new BlockPlugin to the screen.
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *   The new BlockModel
     * @param {string} region
     *   The region the block should be placed in.
     */
    addBlockPlugin: function (block, region) {
      this.layoutView.addBlock(block, region);

      // Indicate that there are unsaved changes in the app.
      this.model.set('unsaved', true);

      // Switch back to the edit tab.
      this.tabsView.switchTab('edit');
    },

    /**
     * Opens the Manage Content tray when configuring an existing Block.
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *   The Block that needs to have its form opened.
     */
    configureBlock: function (block) {
      var info = {
        url: Drupal.panels_ipe.urlRoot(drupalSettings) + '/block_plugins/' + block.get('id') + '/block/' + block.get('uuid') + '/form',
        model: block
      };

      this.loadBlockForm(info);
    },

    /**
     * Opens the Manage Content tray after adding a new Block Content entity.
     *
     * @param {string} uuid
     *   The UUID of the newly added Content Block.
     */
    addContentBlock: function (uuid) {
      // Delete the current block plugin collection so that a new one is pulled in.
      delete this.tabsView.tabViews['manage_content'].collection;

      // Auto-click the new block, which we know is in the "Custom" category.
      // @todo When configurable categories are in, determine this from the
      // passed-in settings.
      this.tabsView.tabViews['manage_content'].autoClick = '[data-plugin-id="block_content:' + uuid + '"]';
      this.tabsView.tabViews['manage_content'].activeCategory = 'Custom';

      this.tabsView.tabViews['manage_content'].render();
    },

    /**
     * Opens the Manage Content tray when editing an existing Content Block.
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *   The Block that needs to have its form opened.
     */
    editContentBlock: function (block) {
      var plugin_split = block.get('id').split(':');

      var info = {
        url: Drupal.panels_ipe.urlRoot(drupalSettings) + '/block_content/edit/block/' + plugin_split[1] + '/form',
        model: block
      };

      this.loadBlockForm(info, this.template_content_block_edit);
    },

    /**
     * React after a content block has been edited.
     *
     * @param {string} block_content_uuid
     *   The UUID of the Block Content entity that was edited.
     */
    editContentBlockDone: function (block_content_uuid) {
      // Find all on-screen Blocks that render this Content Block and refresh
      // them from the server.
      this.layoutView.model.get('regionCollection').each(function (region) {
        var id = 'block_content:' + block_content_uuid;
        var blocks = region.get('blockCollection').where({id: id});

        for (var i in blocks) {
          if (blocks.hasOwnProperty(i)) {
            blocks[i].set('syncing', true);
            blocks[i].fetch();
          }
        }

      });

      this.tabsView.switchTab('edit');
    },

    /**
     * Hides/shows certain elements if our unsaved state changes.
     */
    unsavedChange: function () {
      // Show/hide the cancel tab based on our saved status.
      this.model.get('cancelTab').set('hidden', !this.model.get('unsaved'));
      this.model.get('saveTab').set('hidden', !this.model.get('unsaved'));

      // Re-render ourselves, pass "false" as we don't need to re-render the
      // layout, just the tabs.
      this.render(false);
    },

    /**
     * Helper function to switch tabs to Manage Content and load an arbitrary
     * form.
     *
     * @param {object} info
     *   An object compatible with Drupal.panels_ipe.CategoryView.loadForm()
     * @param {function} template
     *   An optional callback function for the form template.
     */
    loadBlockForm: function (info, template) {
      // We're going to open the manage content tab, which may take time to
      // render. Load the Block edit form on render.
      var manage_content = this.tabsView.tabViews['manage_content'];
      manage_content.on('render', function () {

        if (template) {
          manage_content.loadForm(info, template);
        }
        else {
          manage_content.loadForm(info);
        }

        // We only need this event to trigger once.
        manage_content.off('render', null, this);
      }, this);

      // Disable the active category to avoid confusion.
      manage_content.activeCategory = null;

      this.tabsView.switchTab('manage_content');
    }

  });

}(jQuery, _, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * The primary Backbone view for a Block.
 *
 * see Drupal.panels_ipe.BlockModel
 */

(function ($, _, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.BlockView = Backbone.View.extend(/** @lends Drupal.panels_ipe.BlockView# */{

    /**
     * @type {function}
     */
    template_actions: _.template(
      '<div class="ipe-actions-block ipe-actions" data-block-action-id="<%- uuid %>" data-block-edit-id="<%- id %>">' +
      '  <h5>' + Drupal.t('Block: <%- label %>') + '</h5>' +
      '  <ul class="ipe-action-list">' +
      '    <li data-action-id="remove">' +
      '      <a><span class="ipe-icon ipe-icon-remove"></span></a>' +
      '    </li>' +
      '    <li data-action-id="up">' +
      '      <a><span class="ipe-icon ipe-icon-up"></span></a>' +
      '    </li>' +
      '    <li data-action-id="down">' +
      '      <a><span class="ipe-icon ipe-icon-down"></span></a>' +
      '    </li>' +
      '    <li data-action-id="move">' +
      '      <select><option>' + Drupal.t('Move') + '</option></select>' +
      '    </li>' +
      '    <li data-action-id="configure">' +
      '      <a><span class="ipe-icon ipe-icon-configure"></span></a>' +
      '    </li>' +
      '<% if (plugin_id === "block_content" && edit_access) { %>' +
      '    <li data-action-id="edit-content-block">' +
      '      <a><span class="ipe-icon ipe-icon-edit"></span></a>' +
      '    </li>' +
      '<% } %>' +
      '  </ul>' +
      '</div>'
    ),

    /**
     * @type {Drupal.panels_ipe.BlockModel}
     */
    model: null,

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   An object with the following keys:
     * @param {Drupal.panels_ipe.BlockModel} options.model
     *   The block state model.
     * @param {string} options.el
     *   An optional selector if an existing element is already on screen.
     */
    initialize: function (options) {
      this.model = options.model;
      // An element already exists and our HTML properly isn't set.
      // This only occurs on initial page load for performance reasons.
      if (options.el && !this.model.get('html')) {
        this.model.set({html: this.$el.prop('outerHTML')});
      }
      this.listenTo(this.model, 'sync', this.finishedSync);
      this.listenTo(this.model, 'change:syncing', this.render);
    },

    /**
     * Renders the wrapping elements and refreshes a block model.
     *
     * @return {Drupal.panels_ipe.BlockView}
     *   Return this, for chaining.
     */
    render: function () {
      // Replace our current HTML.
      this.$el.replaceWith(this.model.get('html'));
      this.setElement("[data-block-id='" + this.model.get('uuid') + "']");

      // We modify our content if the IPE is active.
      if (this.model.get('active')) {
        // Prepend the ipe-actions header.
        var template_vars = this.model.toJSON();
        template_vars['edit_access'] = drupalSettings.panels_ipe.user_permission.create_content;
        this.$el.prepend(this.template_actions(template_vars));

        // Add an active class.
        this.$el.addClass('active');

        // Make ourselves draggable.
        this.$el.draggable({
          scroll: true,
          scrollSpeed: 20,
          // Maintain our original width when dragging.
          helper: function (e) {
            var original = $(e.target).hasClass('ui-draggable') ? $(e.target) : $(e.target).closest('.ui-draggable');
            return original.clone().css({
              width: original.width()
            });
          },
          start: function (e, ui) {
            $('.ipe-droppable').addClass('active');
            // Remove the droppable regions closest to this block.
            $(e.target).next('.ipe-droppable').removeClass('active');
            $(e.target).prev('.ipe-droppable').removeClass('active');
          },
          stop: function (e, ui) {
            $('.ipe-droppable').removeClass('active');
          },
          opacity: .5
        });
      }

      // Add a special class if we're currently syncing HTML from the server.
      if (this.model.get('syncing')) {
        this.$el.addClass('syncing');
      }

      return this;
    },

    /**
     * Overrides the default remove function to make a copy of our current HTML
     * into the Model for future rendering. This is required as modules like
     * Quickedit modify Block HTML without our knowledge.
     *
     * @return {Drupal.panels_ipe.BlockView}
     *   Return this, for chaining.
     */
    remove: function () {
      // Remove known augmentations to HTML so that they do not persist.
      this.$('.ipe-actions-block').remove();
      this.$el.removeClass('ipe-highlight active');

      // Update our Block model HTML based on our current visual state.
      this.model.set({html: this.$el.prop('outerHTML')});

      // Call the normal Backbow.view.remove() routines.
      this._removeElement();
      this.stopListening();
      return this;
    },

    /**
     * Reacts to our model being synced from the server.
     */
    finishedSync: function () {
      this.model.set('syncing', false);
    }

  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * Sorts a collection into categories and renders them as tabs with content.
 *
 * see Drupal.panels_ipe.CategoryView
 *
 */

(function ($, _, Backbone, Drupal, drupalSettings) {

  'use strict';

  Drupal.panels_ipe.CategoryView = Backbone.View.extend(/** @lends Drupal.panels_ipe.CategoryView# */{

    /**
     * The name of the currently selected category.
     *
     * @type {string}
     */
    activeCategory: null,

    /**
     * @type {Backbone.Collection}
     */
    collection: null,

    /**
     * The attribute that we should search for. Defaults to "label".
     *
     * @type {string}
     */
    searchAttribute: 'label',

    /**
     * @type {function}
     */
    template: _.template(
      '<div class="ipe-category-picker-search">' +
      '  <span class="ipe-icon ipe-icon-search"></span>' +
      '  <input type="text" placeholder="<%= search_prompt %>" />' +
      '  <input type="submit" value="' + Drupal.t('Search') + '" />' +
      '</div>' +
      '<div class="ipe-category-picker-top"></div>' +
      '<div class="ipe-category-picker-bottom" tabindex="-1">' +
      '  <div class="ipe-categories"></div>' +
      '</div>'
    ),

    /**
     * @type {function}
     */
    template_category: _.template(
      '<a href="javascript:;" class="ipe-category<% if (active) { %> active<% } %>" data-category="<%- name %>">' +
      '  <%- name %>' +
      '  <% if (count) { %><div class="ipe-category-count"><%- count %></div><% } %>' +
      '</a>'
    ),

    /**
     * @type {function}
     *
     * A function to render an item, provided by whoever uses this View.
     */
    template_item: null,

    /**
     * @type {function}
     *
     * A function to display the form wrapper.
     */
    template_form: null,

    /**
     * @type {object}
     */
    events: {
      'click [data-category]': 'toggleCategory',
      'keyup .ipe-category-picker-search input[type="text"]': 'searchCategories'
    },

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {Object} options
     *   An object containing the following keys:
     * @param {Backbone.Collection} options.collection
     *   An optional initial collection.
     */
    initialize: function (options) {
      if (options && options.collection) {
        this.collection = options.collection;
      }

      this.on('tabActiveChange', this.tabActiveChange, this);
    },

    /**
     * Renders the selection menu for picking categories.
     *
     * @return {Drupal.panels_ipe.CategoryView}
     *   Return this, for chaining.
     */
    renderCategories: function () {
      // Empty ourselves.
      var search_prompt;
      if (this.activeCategory) {
        search_prompt = Drupal.t('Search current category');
      }
      else {
        search_prompt = Drupal.t('Search all categories');
      }
      this.$el.html(this.template({search_prompt: search_prompt}));

      // Get a list of categories from the collection.
      var categories_count = {};
      this.collection.each(function (model) {
        var category = model.get('category');
        if (!categories_count[category]) {
          categories_count[category] = 0;
        }
        ++categories_count[category];
      });

      // Render each category.
      for (var i in categories_count) {
        if (categories_count.hasOwnProperty(i)) {
          this.$('.ipe-categories').append(this.template_category({
            name: i,
            count: categories_count[i],
            active: this.activeCategory === i
          }));
        }
      }

      // Check if a category is selected. If so, render the top-tray.
      if (this.activeCategory) {
        var $top = this.$('.ipe-category-picker-top');
        $top.addClass('active');
        this.$('.ipe-category-picker-bottom').addClass('top-open');
        this.collection.each(function (model) {
          if (model.get('category') === this.activeCategory) {
            $top.append(this.template_item(model));
          }
        }, this);

        // Add a top-level body class.
        $('body').addClass('panels-ipe-category-picker-top-open');

        // Focus on the active category.
        this.$('.ipe-category.active').focus();
      }
      else {
        // Remove our top-level body class.
        $('body').removeClass('panels-ipe-category-picker-top-open');

        // Focus on the bottom region.
        this.$('.ipe-category-picker-bottom').focus();
      }

      this.setTopMaxHeight();

      return this;
    },

    /**
     * Reacts to a category being clicked.
     *
     * @param {Object} e
     *   The event object.
     */
    toggleCategory: function (e) {
      var category = $(e.currentTarget).data('category');

      var animation = false;

      // No category is open.
      if (!this.activeCategory) {
        this.activeCategory = category;
        animation = 'slideDown';
      }
      // The same category is clicked twice.
      else if (this.activeCategory === category) {
        this.activeCategory = null;
        animation = 'slideUp';
      }
      // Another category is already open.
      else if (this.activeCategory) {
        this.activeCategory = category;
      }

      // Trigger a re-render, with animation if needed.
      if (animation === 'slideUp') {
        // Close the tab, then re-render.
        var self = this;
        this.$('.ipe-category-picker-top')[animation]('fast', function () {
          self.render();
        });
      }
      else if (animation === 'slideDown') {
        // We need to render first as hypothetically nothing is open.
        this.render();
        this.$('.ipe-category-picker-top').hide();
        this.$('.ipe-category-picker-top')[animation]('fast');
      }
      else {
        this.render();
      }

      // Focus on the first focusable element.
      this.$('.ipe-category-picker-top :focusable:first').focus();
    },

    /**
     * Informs us of our form's callback URL.
     *
     * @param {Object} e
     *   The event object.
     */
    getFormInfo: function (e) {},

    /**
     * Determines form info from the current click event and displays a form.
     *
     * @param {Object} e
     *   The event object.
     */
    displayForm: function (e) {
      var info = this.getFormInfo(e);

      // Indicate an AJAX request.
      this.loadForm(info);
    },

    /**
     * Reacts to the search field changing and displays category items based on
     * our search.
     *
     * @param {Object} e
     *   The event object.
     */
    searchCategories: function (e) {
      // Grab the formatted search from out input field.
      var search = $(e.currentTarget).val().trim().toLowerCase();

      // If the search is empty, re-render the view.
      if (search.length === 0) {
        this.render();
        this.$('.ipe-category-picker-search input').focus();
        return;
      }

      // Filter our collection based on the input.
      var results = this.collection.filter(function (model) {
        var attribute = model.get(this.searchAttribute);
        return attribute.toLowerCase().indexOf(search) !== -1;
      }, this);

      // Empty ourselves.
      var $top = this.$('.ipe-category-picker-top');
      $top.empty();

      // Render categories that matched the search.
      if (results.length > 0) {
        $top.addClass('active');
        this.$('.ipe-category-picker-bottom').addClass('top-open');

        for (var i in results) {
          // If a category is empty, search within that category.
          if (this.activeCategory) {
            if (results[i].get('category') === this.activeCategory) {
              $top.append(this.template_item(results[i]));
            }
          }
          else {
            $top.append(this.template_item(results[i]));
          }
        }

        $('body').addClass('panels-ipe-category-picker-top-open');
      }
      else {
        $top.removeClass('active');
        $('body').removeClass('panels-ipe-category-picker-top-open');
      }

      this.setTopMaxHeight();
    },

    /**
     * Displays a configuration form in our top region.
     *
     * @param {Object} info
     *   An object containing the form URL the model for our form template.
     * @param {function} template
     *   An optional callback function for the form template.
     */
    loadForm: function (info, template) {
      template = template || this.template_form;
      var self = this;

      // Hide the search box.
      this.$('.ipe-category-picker-search').fadeOut('fast');

      this.$('.ipe-category-picker-top').fadeOut('fast', function () {
        self.$('.ipe-category-picker-top').html(template(info.model.toJSON()));
        self.$('.ipe-category-picker-top').fadeIn('fast');

        // Setup the Drupal.Ajax instance.
        var ajax = Drupal.ajax({
          url: info.url,
          submit: {js: true}
        });

        // Remove our throbber on load.
        ajax.options.complete = function () {
          self.$('.ipe-category-picker-top .ipe-icon-loading').remove();

          self.setTopMaxHeight();

          // Remove the inline display style and add a unique class.
          self.$('.ipe-category-picker-top').css('display', '').addClass('form-displayed');

          self.$('.ipe-category-picker-top').hide().fadeIn();
          self.$('.ipe-category-picker-bottom').addClass('top-open');

          // Focus on the first focusable element.
          self.$('.ipe-category-picker-top :focusable:first').focus();
        };

        // Make the Drupal AJAX request.
        ajax.execute();
      });
    },

    /**
     * Responds to our associated tab being opened/closed.
     *
     * @param {bool} state
     *   Whether or not our associated tab is open.
     */
    tabActiveChange: function (state) {
      $('body').toggleClass('panels-ipe-category-picker-top-open', state);
    },

    /**
     * Calculates and sets maximum height of our top area based on known
     * floating and fixed elements.
     */
    setTopMaxHeight: function () {
      // Calculate the combined height of (known) floating elements.
      var used_height = this.$('.ipe-category-picker-bottom').outerHeight() +
        this.$('.ipe-category-picker-search').outerHeight() +
        $('.ipe-tabs').outerHeight();

      // Add optional toolbar support.
      var toolbar = $('#toolbar-bar');
      if (toolbar.length > 0) {
        used_height += $('#toolbar-item-administration-tray:visible').outerHeight() +
        toolbar.outerHeight();
      }

      // The .ipe-category-picker-top padding is 30 pixels, plus five for margin.
      var max_height = $(window).height() - used_height - 35;

      // Set the form's max height.
      this.$('.ipe-category-picker-top').css('max-height', max_height);
    }

  });

}(jQuery, _, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * Renders a list of existing Blocks for selection.
 *
 * see Drupal.panels_ipe.BlockPluginCollection
 *
 */

(function ($, _, Backbone, Drupal, drupalSettings) {

  'use strict';

  Drupal.panels_ipe.BlockPicker = Drupal.panels_ipe.CategoryView.extend(/** @lends Drupal.panels_ipe.BlockPicker# */{

    /**
     * A selector to automatically click on render.
     *
     * @type {string}
     */
    autoClick: null,

    /**
     * @type {Drupal.panels_ipe.BlockPluginCollection}
     */
    collection: null,

    /**
     * @type {Drupal.panels_ipe.BlockContentTypeCollection}
     */
    contentCollection: null,

    /**
     * @type {function}
     */
    template_plugin: _.template(
      '<div class="ipe-block-plugin ipe-blockpicker-item">' +
      '  <a href="javascript:;" data-plugin-id="<%- plugin_id %>">' +
      '    <div class="ipe-block-plugin-info">' +
      '      <h5 title="<%- label %>"><%- trimmed_label %></h5>' +
      '    </div>' +
      '  </a>' +
      '</div>'
    ),

    /**
     * @type {function}
     */
    template_content_type: _.template(
      '<div class="ipe-block-type ipe-blockpicker-item">' +
      '  <a href="javascript:;" data-block-type="<%- id %>">' +
      '    <div class="ipe-block-content-type-info">' +
      '      <h5 title="<%- label %>"><%- label %></h5>' +
      '      <p title="<%- description %>"><%- trimmed_description %></p>' +
      '    </div>' +
      '  </a>' +
      '</div>'
    ),

    /**
     * @type {function}
     */
    template_create_button: _.template(
      '<a href="javascript:;" class="ipe-create-category ipe-category<% if (active) { %> active<% } %>" data-category="<%- name %>">' +
      '  <span class="ipe-icon ipe-icon-create_content"></span>' +
      '  <%- name %>' +
      '</a>'
    ),

    /**
     * @type {function}
     */
    template_form: _.template(
      '<% if (typeof(plugin_id) !== "undefined") { %>' +
      '<h4>' + Drupal.t('Configure <strong><%- label %></strong> block') + '</h4>' +
      '<% } else { %>' +
      '<h4>' + Drupal.t('Create new <strong><%- label %></strong> content') + '</h4>' +
      '<% } %>' +
      '<div class="ipe-block-form ipe-form"><div class="ipe-icon ipe-icon-loading"></div></div>'
    ),

    /**
     * @type {function}
     */
    template_loading: _.template(
      '<span class="ipe-icon ipe-icon-loading"></span>'
    ),

    /**
     * @type {object}
     */
    events: {
      'click .ipe-block-plugin [data-plugin-id]': 'displayForm',
      'click .ipe-block-type [data-block-type]': 'displayForm'
    },

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {Object} options
     *   An object containing the following keys:
     * @param {Drupal.panels_ipe.BlockPluginCollection} options.collection
     *   An optional initial collection.
     */
    initialize: function (options) {
      if (options && options.collection) {
        this.collection = options.collection;
      }

      this.on('tabActiveChange', this.tabActiveChange, this);

      // Extend our parent's events.
      _.extend(this.events, Drupal.panels_ipe.CategoryView.prototype.events);
    },

    /**
     * Renders the selection menu for picking Blocks.
     *
     * @return {Drupal.panels_ipe.BlockPicker}
     *   Return this, for chaining.
     */
    render: function () {
      var create_active = this.activeCategory === 'Create Content';

      // Initialize our collections if they don't already exist.
      if (!this.collection) {
        this.fetchCollection('default');
        return this;
      }
      else if (create_active && !this.contentCollection) {
        this.fetchCollection('content');
        return this;
      }

      // Render our categories.
      this.renderCategories();

      // Add a unique class to our top region to scope CSS.
      this.$el.addClass('ipe-block-picker-list');

      // Prepend a custom button for creating content, if the user has access.
      if (drupalSettings.panels_ipe.user_permission.create_content) {
        this.$('.ipe-categories').prepend(this.template_create_button({
          name: 'Create Content',
          active: create_active
        }));
      }

      // If the create content category is active, render items in our top
      // region.
      if (create_active) {
        // Hide the search box.
        this.$('.ipe-category-picker-search').hide();

        this.contentCollection.each(function (block_content_type) {
          var template_vars = block_content_type.toJSON();

          // Reduce the length of the description if needed.
          template_vars.trimmed_description = template_vars.description;
          if (template_vars.trimmed_description.length > 30) {
            template_vars.trimmed_description = template_vars.description.substring(0, 30) + '...';
          }

          this.$('.ipe-category-picker-top').append(this.template_content_type(template_vars));
        }, this);
      }

      // Check if we need to automatically select one item.
      if (this.autoClick) {
        this.$(this.autoClick).click();
        this.autoClick = null;
      }

      this.trigger('render');

      // Focus on the current category.
      this.$('.ipe-category.active').focus();

      return this;
    },

    /**
     * Callback for our CategoryView, which renders an individual item.
     *
     * @param {Drupal.panels_ipe.BlockPluginModel} block_plugin
     *   The Block plugin that needs rendering.
     *
     * @return {string}
     *   The rendered block plugin.
     */
    template_item: function (block_plugin) {
      var template_vars = block_plugin.toJSON();

      // Not all blocks have labels, add a default if necessary.
      if (!template_vars.label) {
        template_vars.label = Drupal.t('No label');
      }

      // Reduce the length of the Block label if needed.
      template_vars.trimmed_label = template_vars.label;
      if (template_vars.trimmed_label.length > 30) {
        template_vars.trimmed_label = template_vars.label.substring(0, 30) + '...';
      }

      return this.template_plugin(template_vars);
    },

    /**
     * Informs the CategoryView of our form's callback URL.
     *
     * @param {Object} e
     *   The event object.
     *
     * @return {Object}
     *   An object containing the properties "url" and "model".
     */
    getFormInfo: function (e) {
      // Get the current plugin_id or type.
      var plugin_id = $(e.currentTarget).data('plugin-id');
      var url = Drupal.panels_ipe.urlRoot(drupalSettings);
      var model;

      // Generate a base URL for the form.
      if (plugin_id) {
        model = this.collection.get(plugin_id);
        url += '/block_plugins/' + plugin_id + '/form';
      }
      else {
        var block_type = $(e.currentTarget).data('block-type');

        model = this.contentCollection.get(block_type);
        url += '/block_content/' + block_type + '/form';
      }

      return {url: url, model: model};
    },

    /**
     * Fetches a collection from the server and re-renders the View.
     *
     * @param {string} type
     *   The type of collection to fetch.
     */
    fetchCollection: function (type) {
      var collection;
      var self = this;

      if (type === 'default') {
        // Indicate an AJAX request.
        this.$el.html(this.template_loading());

        // Fetch a collection of block plugins from the server.
        this.collection = new Drupal.panels_ipe.BlockPluginCollection();
        collection = this.collection;
      }
      else {
        // Indicate an AJAX request.
        this.$('.ipe-category-picker-top').html(this.template_loading());

        // Fetch a collection of block content types from the server.
        this.contentCollection = new Drupal.panels_ipe.BlockContentTypeCollection();
        collection = this.contentCollection;
      }

      collection.fetch().done(function () {
        // We have a collection now, re-render ourselves.
        self.render();
      });
    }

  });

}(jQuery, _, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * Renders a collection of Layouts for selection.
 *
 * see Drupal.panels_ipe.LayoutCollection
 */

(function ($, _, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.LayoutPicker = Drupal.panels_ipe.CategoryView.extend(/** @lends Drupal.panels_ipe.LayoutPicker# */{

    /**
     * @type {function}
     */
    template_form: _.template(
      '<h4>' + Drupal.t('Configure <strong><%- label %></strong> layout') + '</h4>' +
      '<div class="ipe-layout-form ipe-form"><div class="ipe-icon ipe-icon-loading"></div></div>'
    ),

    /**
     * @type {function}
     */
    template_layout: _.template(
    '<a href="javascript:;" class="ipe-layout" data-layout-id="<%- id %>">' +
    '  <img class="ipe-layout-image" src="<%- icon %>" title="<%- label %>" alt="<%- label %>" />' +
    '  <span class="ipe-layout-label"><%- label %></span>' +
    '</a>'
    ),

    /**
     * @type {function}
     */
    template_loading: _.template(
      '<span class="ipe-icon ipe-icon-loading"></span>'
    ),

    /**
     * @type {Drupal.panels_ipe.LayoutCollection}
     */
    collection: null,

    /**
     * @type {object}
     */
    events: {
      'click [data-layout-id]': 'displayForm'
    },

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {Object} options
     *   An object containing the following keys:
     * @param {Drupal.panels_ipe.LayoutCollection} options.collection
     *   An optional initial collection.
     */
    initialize: function (options) {
      if (options && options.collection) {
        this.collection = options.collection;
      }
      // Extend our parent's events.
      _.extend(this.events, Drupal.panels_ipe.CategoryView.prototype.events);
    },

    /**
     * Renders the selection menu for picking Layouts.
     *
     * @return {Drupal.panels_ipe.LayoutPicker}
     *   Return this, for chaining.
     */
    render: function () {
      var current_layout = Drupal.panels_ipe.app.get('layout').get('id');
      // If we don't have layouts yet, pull some from the server.
      if (!this.collection) {
        // Indicate an AJAX request.
        this.$el.html(this.template_loading());

        // Fetch a list of layouts from the server.
        this.collection = new Drupal.panels_ipe.LayoutCollection();
        var self = this;
        this.collection.fetch().done(function () {
          // We have a collection now, re-render ourselves.
          self.render();
        });

        return this;
      }

      // Render our categories.
      this.renderCategories();

      // Flag the current layout.
      var current_layout_text = '<p>' + Drupal.t('Current Layout') + '</p>';
      this.$('[data-layout-id="' + current_layout + '"]').append(current_layout_text);

      // Prepend the current layout as its own category.
      this.$('.ipe-categories').prepend(this.template_category({
        name: Drupal.t('Current Layout'),
        count: null,
        active: this.activeCategory === 'Current Layout'
      }));

      // If we're viewing the current layout tab, show a custom item.
      if (this.activeCategory && this.activeCategory === 'Current Layout') {
        // Hide the search box.
        this.$('.ipe-category-picker-search').hide();

        this.collection.each(function (layout) {
          if (Drupal.panels_ipe.app.get('layout').get('id') === layout.get('id')) {
            this.$('.ipe-category-picker-top').append(this.template_item(layout));
          }
        }, this);
      }

      return this;
    },

    /**
     * Callback for our CategoryView, which renders an individual item.
     *
     * @param {Drupal.panels_ipe.LayoutModel} layout
     *   The Layout that needs rendering.
     *
     * @return {string}
     *   The rendered block plugin.
     */
    template_item: function (layout) {
      return this.template_layout(layout.toJSON());
    },

    /**
     * Informs the CategoryView of our form's callback URL.
     *
     * @param {Object} e
     *   The event object.
     *
     * @return {Object}
     *   An object containing the properties "url" and "model".
     */
    getFormInfo: function (e) {
      // Get the current layout_id.
      var layout_id = $(e.currentTarget).data('layout-id');

      var layout = this.collection.get(layout_id);
      var url = Drupal.panels_ipe.urlRoot(drupalSettings) + '/layouts/' + layout_id + '/form';

      return {url: url, model: layout};
    }

  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * The primary Backbone view for a Layout.
 *
 * see Drupal.panels_ipe.LayoutModel
 */

(function ($, _, Backbone, Drupal) {

  'use strict';

  Drupal.panels_ipe.LayoutView = Backbone.View.extend(/** @lends Drupal.panels_ipe.LayoutView# */{

    /**
     * @type {function}
     */
    template_region_actions: _.template(
      '<div class="ipe-actions" data-region-action-id="<%- name %>">' +
      '  <h5>' + Drupal.t('Region: <%- name %>') + '</h5>' +
      '  <ul class="ipe-action-list"></ul>' +
      '</div>'
    ),

    /**
     * @type {function}
     */
    template_region_option: _.template(
      '<option data-region-option-name="<%- name %>"><%- name %></option>'
    ),

    /**
     * @type {function}
     */
    template_region_droppable: _.template(
      '<div class="ipe-droppable" data-droppable-region-name="<%- region %>" data-droppable-index="<%- index %>"></div>'
    ),

    /**
     * @type {Drupal.panels_ipe.LayoutModel}
     */
    model: null,

    /**
     * @type {Array}
     *   An array of child Drupal.panels_ipe.BlockView objects.
     */
    blockViews: [],

    /**
     * @type {object}
     */
    events: {
      'mousedown [data-action-id="move"] > select': 'showBlockRegionList',
      'blur [data-action-id="move"] > select': 'hideBlockRegionList',
      'change [data-action-id="move"] > select': 'newRegionSelected',
      'click [data-action-id="up"]': 'moveBlock',
      'click [data-action-id="down"]': 'moveBlock',
      'click [data-action-id="remove"]': 'removeBlock',
      'click [data-action-id="configure"]': 'configureBlock',
      'click [data-action-id="edit-content-block"]': 'editContentBlock',
      'drop .ipe-droppable': 'dropBlock'
    },

    /**
     * @type {object}
     */
    droppable_settings: {
      tolerance: 'pointer',
      hoverClass: 'hover',
      accept: '[data-block-id]'
    },

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {object} options
     *   An object with the following keys:
     * @param {Drupal.panels_ipe.LayoutModel} options.model
     *   The layout state model.
     */
    initialize: function (options) {
      this.model = options.model;
      // Initialize our html, this never changes.
      if (this.model.get('html')) {
        this.$el.html(this.model.get('html'));
      }

      this.on('tabActiveChange', this.tabActiveChange, this);
      this.listenTo(this.model, 'change:active', this.changeState);
    },

    /**
     * Re-renders our blocks, we have no HTML to be re-rendered.
     *
     * @return {Drupal.panels_ipe.LayoutView}
     *   Returns this, for chaining.
     */
    render: function () {
      // Remove all existing BlockViews.
      for (var i in this.blockViews) {
        if (this.blockViews.hasOwnProperty(i)) {
          this.blockViews[i].remove();
        }
      }
      this.blockViews = [];

      // Remove any active-state items that may remain rendered.
      this.$('.ipe-actions').remove();
      this.$('.ipe-droppable').remove();

      // Re-attach all BlockViews to appropriate regions.
      this.model.get('regionCollection').each(function (region) {
        var region_selector = '[data-region-name="' + region.get('name') + '"]';

        // Add an initial droppable area to our region if this is the first render.
        if (this.model.get('active')) {
          this.$(region_selector).prepend($(this.template_region_droppable({
            region: region.get('name'),
            index: 0
          })).droppable(this.droppable_settings));

          // Prepend the action header for this region.
          this.$(region_selector).prepend(this.template_region_actions(region.toJSON()));
        }

        var i = 1;
        region.get('blockCollection').each(function (block) {
          var block_selector = '[data-block-id="' + block.get('uuid') + '"]';

          // Attach an empty element for our View to attach itself to.
          if (this.$(block_selector).length === 0) {
            var empty_elem = $('<div data-block-id="' + block.get('uuid') + '">');
            this.$(region_selector).append(empty_elem);
          }

          // Attach a View to this empty element.
          var block_view = new Drupal.panels_ipe.BlockView({
            model: block,
            el: block_selector
          });
          this.blockViews.push(block_view);

          // Render the new BlockView.
          block_view.render();

          // Prepend/append droppable regions if the Block is active.
          if (this.model.get('active')) {
            block_view.$el.after($(this.template_region_droppable({
              region: region.get('name'),
              index: i
            })).droppable(this.droppable_settings));
          }

          ++i;
        }, this);
      }, this);

      // Attach any Drupal behaviors.
      Drupal.attachBehaviors(this.el);

      return this;
    },

    /**
     * Prepends Regions and Blocks with action items.
     *
     * @param {Drupal.panels_ipe.LayoutModel} model
     *   The target LayoutModel.
     * @param {bool} value
     *   The desired active state.
     * @param {Object} options
     *   Unused options.
     */
    changeState: function (model, value, options) {
      // Sets the active state of child blocks when our state changes.
      this.model.get('regionCollection').each(function (region) {
        // BlockViews handle their own rendering, so just set the active value here.
        region.get('blockCollection').each(function (block) {
          block.set({active: value});
        }, this);
      }, this);

      // Re-render ourselves.
      this.render();
    },

    /**
     * Replaces the "Move" button with a select list of regions.
     *
     * @param {Object} e
     *   The event object.
     */
    showBlockRegionList: function (e) {
      // Get the BlockModel id (uuid).
      var id = this.getEventBlockUuid(e);

      $(e.currentTarget).empty();

      // Add other regions to select list.
      this.model.get('regionCollection').each(function (region) {
        var option = $(this.template_region_option(region.toJSON()));
        // If this is the current region, place it first in the list.
        if (region.getBlock(id)) {
          option.attr('selected', 'selected');
          $(e.currentTarget).prepend(option);
        }
        else {
          $(e.currentTarget).append(option);
        }
      }, this);
    },

    /**
     * Hides the region selector.
     *
     * @param {Object} e
     *   The event object.
     */
    hideBlockRegionList: function (e) {
      $(e.currentTarget).html('<option>' + Drupal.t('Move') + '</option>');
    },

    /**
     * React to a new region being selected.
     *
     * @param {Object} e
     *   The event object.
     */
    newRegionSelected: function (e) {
      var block_uuid = this.getEventBlockUuid(e);
      var new_region_name = $(e.currentTarget).children(':selected').data('region-option-name');

      if (new_region_name) {
        this.moveBlockToRegion(block_uuid, new_region_name);
        this.hideBlockRegionList(e);
        this.render();
        this.highlightBlock(block_uuid, true);
        this.saveToTempStore();
      }
    },

    /**
     * Get the block Uuid related to an event.
     *
     * @param {Object} e
     *   The event object.
     *
     * @return {String}
     *   The block Uuid
     */
    getEventBlockUuid: function (e) {
      return $(e.currentTarget).closest('[data-block-action-id]').data('block-action-id');
    },

    /**
     * Get the block Uuid related to an event.
     *
     * @param {Object} e
     *   The event object.
     *
     * @return {String}
     *   The block Uuid
     */
    getEventBlockId: function (e) {
      return $(e.currentTarget).closest('[data-block-edit-id]').data('block-edit-id');
    },

    /**
     * Moves an existing Block to a new region.
     *
     * @param {string} block_uuid
     *   The universally unique identifier of the block.
     * @param {string} target_region_id
     *   The id of the target region.
     */
    moveBlockToRegion: function (block_uuid, target_region_id) {
      var target_region = this.model.get('regionCollection').get(target_region_id);
      var original_region = this.getRegionContainingBlock(block_uuid);
      target_region.addBlock(original_region.getBlock(block_uuid));
      original_region.removeBlock(block_uuid);
    },

    /**
     * Determines what region a Block resides in.
     *
     * @param {string} block_uuid
     *   The universally unique identifier of the block.
     *
     * @return {Drupal.panels_ipe.RegionModel|undefined}
     *   The region containing the block if it was found.
     */
    getRegionContainingBlock: function (block_uuid) {
      var region_collection = this.model.get('regionCollection');
      for (var i = 0, l = region_collection.length; i < l; i++) {
        var region = region_collection.at(i);
        if (region.hasBlock(block_uuid)) {
          return region;
        }
      }
    },

    /**
     * Highlights a block by adding a css class and optionally scrolls to the
     * block's location.
     *
     * @param {string} block_uuid
     *   The universally unique identifier of the block.
     * @param {bool} scroll
     *   Whether or not the page should scroll to the block. Defaults to false.
     */
    highlightBlock: function (block_uuid, scroll) {
      scroll = scroll || false;

      var $block = this.$('[data-block-id="' + block_uuid + '"]');
      $block.addClass('ipe-highlight');

      if (scroll) {
        $('body').animate({scrollTop: $block.offset().top}, 600);
      }
    },

    /**
     * Marks the global AppModel as unsaved.
     */
    markUnsaved: function () {
      Drupal.panels_ipe.app.set('unsaved', true);
    },

    /**
     * Changes the LayoutModel for this view.
     *
     * @param {Drupal.panels_ipe.LayoutModel} layout
     *   The new LayoutModel.
     */
    changeLayout: function (layout) {
      // Stop listening to the current model.
      this.stopListening(this.model);
      // Initialize with the new model.
      this.initialize({model: layout});
    },

    /**
     * Saves the current state of the layout to the tempstore.
     */
    saveToTempStore: function () {
      var model = this.model;
      var urlRoot = Drupal.panels_ipe.urlRoot(drupalSettings);
      var options = {url: urlRoot + '/layouts/' + model.get('id') + '/tempstore'};

      Backbone.sync('update', model, options);

      this.markUnsaved();
    },

    /**
     * Removes the block on the server via an AJAX call.
     *
     * @param {string} block_uuid
     *   The UUID/ID of a BlockModel.
     */
    removeServerSideBlock: function (block_uuid) {
      $.ajax({
        url: Drupal.panels_ipe.urlRoot(drupalSettings) + '/remove_block',
        method: 'DELETE',
        data: JSON.stringify(block_uuid),
        contentType: 'application/json; charset=UTF-8'
      });

      this.markUnsaved();
    },

    /**
     * Moves a block up or down in its RegionModel's BlockCollection.
     *
     * @param {Object} e
     *   The event object.
     */
    moveBlock: function (e) {
      // Get the BlockModel id (uuid).
      var id = this.getEventBlockUuid(e);

      // Get the direction the block is moving.
      var dir = $(e.currentTarget).data('action-id');

      // Grab the model for this region.
      var region_name = $(e.currentTarget).closest('[data-region-name]').data('region-name');
      var region = this.model.get('regionCollection').get(region_name);
      var block = region.getBlock(id);

      // Shift the Block.
      region.get('blockCollection').shift(block, dir);

      this.render();
      this.highlightBlock(id);

      this.saveToTempStore();
    },

    /**
     * Removes a Block from its region.
     *
     * @param {Object} e
     *   The event object.
     */
    removeBlock: function (e) {
      // Get the BlockModel id (uuid).
      var id = this.getEventBlockUuid(e);

      // Grab the model for this region.
      var region_name = $(e.currentTarget).closest('[data-region-name]').data('region-name');
      var region = this.model.get('regionCollection').get(region_name);

      // Remove the block.
      region.removeBlock(id);

      // Re-render ourselves.
      this.render();

      this.removeServerSideBlock(id);
    },

    /**
     * Configures an existing (on screen) Block.
     *
     * @param {Object} e
     *   The event object.
     */
    configureBlock: function (e) {
      // Get the BlockModel id (uuid).
      var id = this.getEventBlockUuid(e);

      // Grab the model for this region.
      var region_name = $(e.currentTarget).closest('[data-region-name]').data('region-name');
      var region = this.model.get('regionCollection').get(region_name);

      // Send an App-level event so our BlockPicker View can display a Form.
      Drupal.panels_ipe.app.trigger('configureBlock', region.getBlock(id));
    },

    /**
     * Edits an existing Content Block.
     *
     * @param {Object} e
     *   The event object.
     */
    editContentBlock: function (e) {
      // Get the BlockModel id (uuid).
      var id = this.getEventBlockUuid(e);

      // Get the blockModel content id.
      var plugin_id = this.getEventBlockId(e);

      // Split plugin id.
      var plugin_split = plugin_id.split(':');

      if (plugin_split[0] === 'block_content') {
        // Grab the model for this region.
        var region_name = $(e.currentTarget).closest('[data-region-name]').data('region-name');
        var region = this.model.get('regionCollection').get(region_name);

        // Send a App-level event so our BlockPicker View can respond and display a Form.
        Drupal.panels_ipe.app.trigger('editContentBlock', region.getBlock(id));
      }
    },

    /**
     * Reacts to a block being dropped on a droppable region.
     *
     * @param {Object} e
     *   The event object.
     * @param {Object} ui
     *   The jQuery UI object.
     */
    dropBlock: function (e, ui) {
      // Get the BlockModel id (uuid) and old region name.
      var id = ui.draggable.data('block-id');
      var old_region_name = ui.draggable.closest('[data-region-name]').data('region-name');

      // Get the BlockModel and remove it from its last position.
      var old_region = this.model.get('regionCollection').get(old_region_name);
      var block = old_region.getBlock(id);
      old_region.removeBlock(block, {silent: true});

      // Get the new region name and index from the droppable.
      var new_region_name = $(e.currentTarget).data('droppable-region-name');
      var index = $(e.currentTarget).data('droppable-index');

      // Add the BlockModel to its new region/index.
      var new_region = this.model.get('regionCollection').get(new_region_name);
      new_region.addBlock(block, {at: index, silent: true});

      // Re-render after the current execution cycle, to account for DOM editing
      // that jQuery.ui is going to do on this run. Modules like Contextual do
      // something similar to ensure rendering order is preserved.
      var self = this;
      window.setTimeout(function () {
        self.render();
        self.highlightBlock(id);
      });

      this.saveToTempStore();
    },

    /**
     * Adds a new BlockModel to the layout, or updates an existing Block model.
     *
     * @param {Drupal.panels_ipe.BlockModel} block
     *   The new BlockModel
     * @param {string} region_name
     *   The region name that the block should be placed in.
     */
    addBlock: function (block, region_name) {
      // First, check if the Block already exists and remove it if so.
      var index = null;
      this.model.get('regionCollection').each(function (region) {
        var old_block = region.getBlock(block.get('uuid'));
        if (old_block) {
          index = region.get('blockCollection').indexOf(old_block);
          region.removeBlock(old_block);
        }
      });

      // Get the target region.
      var region = this.model.get('regionCollection').get(region_name);
      if (region) {
        // Add the block, at its previous index if necessary.
        var options = {};
        if (index !== null && index !== -1) {
          options.at = index;
        }
        region.addBlock(block, options);

        this.render();
        this.highlightBlock(block.get('uuid'), true);
      }
    }

  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * The primary Backbone view for a tab collection.
 *
 * see Drupal.panels_ipe.TabCollection
 */

(function ($, _, Backbone, Drupal, drupalSettings) {

  'use strict';

  Drupal.panels_ipe.TabsView = Backbone.View.extend(/** @lends Drupal.panels_ipe.TabsView# */{

    /**
     * @type {function}
     */
    template_tab: _.template(
      '<li class="ipe-tab<% if (active) { %> active<% } %>" data-tab-id="<%- id %>">' +
      '  <a href="javascript:;" title="<%- title %>">' +
      '    <span class="ipe-icon ipe-icon-<% if (loading) { %>loading<% } else { print(id) } %>"></span>' +
      '    <span class="ipe-tab-title"><%- title %></span>' +
      '  </a>' +
      '</li>'
    ),

    /**
     * @type {function}
     */
    template_content: _.template('<div class="ipe-tab-content<% if (active) { %> active<% } %>" data-tab-content-id="<%- id %>"></div>'),

    /**
     * @type {object}
     */
    events: {
      'click .ipe-tab > a': 'switchTab'
    },

    /**
     * @type {Drupal.panels_ipe.TabCollection}
     */
    collection: null,

    /**
     * @type {Object}
     *
     * An object mapping tab IDs to Backbone views.
     */
    tabViews: {},

    /**
     * @constructs
     *
     * @augments Backbone.TabsView
     *
     * @param {object} options
     *   An object with the following keys:
     * @param {object} options.tabViews
     *   An object mapping tab IDs to Backbone views.
     */
    initialize: function (options) {
      this.tabViews = options.tabViews;

      // Bind our global key down handler to the document.
      $(document).bind('keydown', $.proxy(this.keydownHandler, this));
    },

    /**
     * Renders our tab collection.
     *
     * @return {Drupal.panels_ipe.TabsView}
     *   Return this, for chaining.
     */
    render: function () {
      // Empty our list.
      this.$el.empty();

      // Setup the initial wrapping elements.
      this.$el.append('<ul class="ipe-tabs"></ul>');
      this.$el.append('<div class="ipe-tabs-content" tabindex="-1"></div>');

      // Remove any previously added body classes.
      $('body').removeClass('panels-ipe-tabs-open');

      // Append each of our tabs and their tab content view.
      this.collection.each(function (tab) {
        // Return early if this tab is hidden.
        if (tab.get('hidden')) {
          return;
        }

        // Append the tab.
        var id = tab.get('id');

        this.$('.ipe-tabs').append(this.template_tab(tab.toJSON()));

        // Check to see if this tab has content.
        if (tab.get('active') && this.tabViews[id]) {
          // Add a top-level body class.
          $('body').addClass('panels-ipe-tabs-open');

          // Render the tab content.
          this.$('.ipe-tabs-content').append(this.template_content(tab.toJSON()));
          this.tabViews[id].setElement('[data-tab-content-id="' + id + '"]').render();
        }
      }, this);

      // Focus on the current tab.
      this.$('.ipe-tab.active a').focus();

      return this;
    },

    /**
     * Switches the current tab.
     *
     * @param {Object} e
     *   The event object.
     */
    switchTab: function (e) {
      var id;
      if (typeof e === 'string') {
        id = e;
      }
      else {
        e.preventDefault();
        id = $(e.currentTarget).parent().data('tab-id');
      }

      // Disable all existing tabs.
      var animation = null;
      var already_open = false;
      this.collection.each(function (tab) {
        // If the tab is loading, do nothing.
        if (tab.get('loading')) {
          return;
        }

        // Don't repeat comparisons, if possible.
        var clicked = tab.get('id') === id;
        var active = tab.get('active');

        // If the user is clicking the same tab twice, close it.
        if (clicked && active) {
          tab.set('active', false);
          animation = 'close';
        }
        // If this is the first click, open the tab.
        else if (clicked) {
          tab.set('active', true);
          // Only animate the tab if there is an associate Backbone View.
          if (this.tabViews[id]) {
            animation = 'open';
          }
        }
        // The tab wasn't clicked, make sure it's closed.
        else {
          // Mark that the View was already open.
          if (active) {
            already_open = true;
          }
          tab.set('active', false);
        }

        // Inform the tab's view of the change.
        if (this.tabViews[tab.get('id')]) {
          this.tabViews[tab.get('id')].trigger('tabActiveChange', tab.get('active'));
        }
      }, this);

      // Trigger a re-render, with animation if needed.
      if (animation === 'close') {
        this.closeTabContent();
      }
      else if (animation === 'open' && !already_open) {
        this.openTabContent();
      }
      else {
        this.render();
      }
    },

    /**
     * Handles keypress events, checking for contextual commands in IPE.
     *
     * @param {Object} e
     *   The event object.
     */
    keydownHandler: function (e) {
      if (e.keyCode === 27) {
        // Get the currently focused element.
        var $focused = $(':focus');

        // If a tab is currently open and we are in focus, close the tab.
        if (this.$el.has($focused).length) {
          var active_tab = false;
          this.collection.each(function (tab) {
            if (tab.get('active')) {
              active_tab = tab.get('id');
            }
          });
          if (active_tab) {
            this.switchTab(active_tab);
          }
        }
      }
    },

    /**
     * Closes any currently open tab.
     */
    closeTabContent: function () {
      // Close the tab, then re-render.
      var self = this;
      this.$('.ipe-tabs-content')['slideUp']('fast', function () {
        self.render();
      });

      // Remove our top-level body class.
      $('body').removeClass('panels-ipe-tabs-open');
    },

    /**
     * Opens any currently closed tab.
     */
    openTabContent: function () {
      // We need to render first as hypothetically nothing is open.
      this.render();
      this.$('.ipe-tabs-content').hide();
      this.$('.ipe-tabs-content')['slideDown']('fast');
    }

  });

}(jQuery, _, Backbone, Drupal, drupalSettings));
;
/**
 * @file
 * Entry point for the Panelizer IPE customizations.
 */

(function ($, _, Backbone, Drupal) {

  'use strict';

  Drupal.panelizer = Drupal.panelizer || {};

  /**
   * @namespace
   */
  Drupal.panelizer.panels_ipe = {};

  /**
   * Make customizations to the Panels IPE for Panelizer.
   */
  Backbone.on('PanelsIPEInitialized', function() {
    // Disable the normal save event.
    Drupal.panels_ipe.app_view.stopListening(Drupal.panels_ipe.app.get('saveTab'), 'change:active');

    // Add a new revert tab model.
    if (drupalSettings.panelizer.user_permission.revert) {
      var revert_tab = new Drupal.panels_ipe.TabModel({title: 'Revert to default', id: 'revert'});
      Drupal.panels_ipe.app_view.tabsView.collection.add(revert_tab);

      // @todo: Put this into a proper view?
      Drupal.panels_ipe.app_view.listenTo(revert_tab, 'change:active', function () {
        var entity = drupalSettings.panelizer.entity;
        if (revert_tab.get('active') && !revert_tab.get('loading')) {
          if (confirm(Drupal.t('Are you sure you want to revert to default layout? All your layout changes will be lost for this node.'))) {
            // Remove our changes and refresh the page.
            revert_tab.set({loading: true});
            $.ajax({
              url: drupalSettings.path.baseUrl + 'admin/panelizer/panels_ipe/' + entity.entity_type_id + '/' + entity.entity_id + '/' + entity.view_mode + '/revert_to_default',
              data: {},
              type: 'POST'
            }).done(function (data) {
              location.reload();
            });
          }
          else {
            revert_tab.set('active', false, {silent: true});
          }
        }
      });

      // Hide the 'Revert to default' button if we're already on a default.
      if (drupalSettings.panels_ipe.panels_display.storage_type == 'panelizer_default') {
        revert_tab.set({hidden: true});
      }
    }

    // Hide the 'Revert to default' button if the user does not have permission.
    // if (!drupalSettings.panelizer.user_permission.revert) {
    //   revert_tab.set({hidden: true});
    // }

    // Add a new view for the save button to the TabsView.
    var tabs = {
      model: Drupal.panels_ipe.app_view.model,
      tabsView: Drupal.panels_ipe.app_view.tabsView,
    };
    if (typeof revert_tab !== 'undefined') {
      tabs.revertTab = revert_tab;
    }
    Drupal.panels_ipe.app_view.tabsView.tabViews['save'] = new Drupal.panelizer.panels_ipe.SaveTabView(tabs);
  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * Contains Drupal.panelizer.panels_ipe.SaveTabView.
 */

(function ($, _, Backbone, Drupal) {
  'use strict';

  Drupal.panelizer.panels_ipe.SaveTabView = Backbone.View.extend(/** @lends Drupal.panelizer.panels_ipe.SaveTabView# */{

    /**
     * @type {function}
     */
    template: function() {
      return '';
    },

    /**
     * @type {Drupal.panels_ipe.AppModel}
     */
    model: null,

    /**
     * @type {Drupal.panels_ipe.TabsView}
     */
    tabsView: null,

    /**
     * @type {Drupal.panels_ipe.TabModel}
     */
    revertTab: null,

    /**
     * @type {object}
     */
    events: {
    },

    /**
     * @type {function}
     */
    onClick: function () {
      if (this.model.get('saveTab').get('active')) {
        // Always save as a custom override.
        this.saveCustom();
      }
    },

    /**
     * @type {function}
     */
    saveCustom: function () {
      this._save('panelizer_field');
    },

    /**
     * @type {function}
     */
    _save: function (storage_type) {
      var self = this,
          layout = this.model.get('layout');

      // Give the backend enough information to save in the correct way.
      layout.set('panelizer_save_as', storage_type);
      layout.set('panelizer_entity', drupalSettings.panelizer.entity);

      if (this.model.get('saveTab').get('active')) {
        // Save the Layout and disable the tab.
        this.model.get('saveTab').set({loading: true, active: false});
        this.tabsView.render();
        layout.save().done(function () {
          self.model.get('saveTab').set({loading: false});
          self.model.set('unsaved', false);

          // Change the storage type and id for the next save.
          drupalSettings.panels_ipe.panels_display.storage_type = storage_type;
          drupalSettings.panels_ipe.panels_display.storage_id = drupalSettings.panelizer.entity[storage_type + '_storage_id'];
          Drupal.panels_ipe.setUrlRoot(drupalSettings);

          // Show/hide the revert to default tab.
          self.revertTab.set({hidden: storage_type === 'panelizer_default'});
          self.tabsView.render();
        });
      }
    },

    /**
     * @constructs
     *
     * @augments Backbone.View
     *
     * @param {Object} options
     *   An object containing the following keys:
     * @param {Drupal.panels_ipe.AppModel} options.model
     *   The app state model.
     * @param {Drupal.panels_ipe.TabsView} options.tabsView
     *   The app view.
     * @param {Drupal.panels_ipe.TabModel} options.revertTab
     *   The revert tab.
     */
    initialize: function (options) {
      this.model = options.model;
      this.tabsView = options.tabsView;
      this.revertTab = options.revertTab;

      this.listenTo(this.model.get('saveTab'), 'change:active', this.onClick);
    },

    /**
     * Renders the selection menu for picking Layouts.
     *
     * @return {Drupal.panelizer.panels_ipe.SaveTabView}
     *   Return this, for chaining.
     */
    render: function () {
      this.$el.html(this.template());
      return this;
    }

  });

}(jQuery, _, Backbone, Drupal));
;
/**
 * @file
 * Attaches behavior for the Filter module.
 */

(function ($, Drupal) {

  'use strict';

  /**
   * Displays the guidelines of the selected text format automatically.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches behavior for updating filter guidelines.
   */
  Drupal.behaviors.filterGuidelines = {
    attach: function (context) {

      function updateFilterGuidelines(event) {
        var $this = $(event.target);
        var value = $this.val();
        $this.closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .filter('.filter-guidelines-' + value).show();
      }

      $(context).find('.filter-guidelines').once('filter-guidelines')
        .find(':header').hide()
        .closest('.filter-wrapper').find('select.filter-list')
        .on('change.filterGuidelines', updateFilterGuidelines)
        // Need to trigger the namespaced event to avoid triggering formUpdated
        // when initializing the select.
        .trigger('change.filterGuidelines');
    }
  };

})(jQuery, Drupal);
;
/**
 * @file
 * Dialog API inspired by HTML5 dialog element.
 *
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#the-dialog-element
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Default dialog options.
   *
   * @type {object}
   *
   * @prop {bool} [autoOpen=true]
   * @prop {string} [dialogClass='']
   * @prop {string} [buttonClass='button']
   * @prop {string} [buttonPrimaryClass='button--primary']
   * @prop {function} close
   */
  drupalSettings.dialog = {
    autoOpen: true,
    dialogClass: '',
    // Drupal-specific extensions: see dialog.jquery-ui.js.
    buttonClass: 'button',
    buttonPrimaryClass: 'button--primary',
    // When using this API directly (when generating dialogs on the client
    // side), you may want to override this method and do
    // `jQuery(event.target).remove()` as well, to remove the dialog on
    // closing.
    close: function (event) {
      Drupal.dialog(event.target).close();
      Drupal.detachBehaviors(event.target, null, 'unload');
    }
  };

  /**
   * @typedef {object} Drupal.dialog~dialogDefinition
   *
   * @prop {boolean} open
   *   Is the dialog open or not.
   * @prop {*} returnValue
   *   Return value of the dialog.
   * @prop {function} show
   *   Method to display the dialog on the page.
   * @prop {function} showModal
   *   Method to display the dialog as a modal on the page.
   * @prop {function} close
   *   Method to hide the dialog from the page.
   */

  /**
   * Polyfill HTML5 dialog element with jQueryUI.
   *
   * @param {HTMLElement} element
   *   The element that holds the dialog.
   * @param {object} options
   *   jQuery UI options to be passed to the dialog.
   *
   * @return {Drupal.dialog~dialogDefinition}
   *   The dialog instance.
   */
  Drupal.dialog = function (element, options) {
    var undef;
    var $element = $(element);
    var dialog = {
      open: false,
      returnValue: undef,
      show: function () {
        openDialog({modal: false});
      },
      showModal: function () {
        openDialog({modal: true});
      },
      close: closeDialog
    };

    function openDialog(settings) {
      settings = $.extend({}, drupalSettings.dialog, options, settings);
      // Trigger a global event to allow scripts to bind events to the dialog.
      $(window).trigger('dialog:beforecreate', [dialog, $element, settings]);
      $element.dialog(settings);
      dialog.open = true;
      $(window).trigger('dialog:aftercreate', [dialog, $element, settings]);
    }

    function closeDialog(value) {
      $(window).trigger('dialog:beforeclose', [dialog, $element]);
      $element.dialog('close');
      dialog.returnValue = value;
      dialog.open = false;
      $(window).trigger('dialog:afterclose', [dialog, $element]);
    }

    return dialog;
  };

})(jQuery, Drupal, drupalSettings);
;
/**
 * @file
 * Positioning extensions for dialogs.
 */

/**
 * Triggers when content inside a dialog changes.
 *
 * @event dialogContentResize
 */

(function ($, Drupal, drupalSettings, debounce, displace) {

  'use strict';

  // autoResize option will turn off resizable and draggable.
  drupalSettings.dialog = $.extend({autoResize: true, maxHeight: '95%'}, drupalSettings.dialog);

  /**
   * Resets the current options for positioning.
   *
   * This is used as a window resize and scroll callback to reposition the
   * jQuery UI dialog. Although not a built-in jQuery UI option, this can
   * be disabled by setting autoResize: false in the options array when creating
   * a new {@link Drupal.dialog}.
   *
   * @function Drupal.dialog~resetSize
   *
   * @param {jQuery.Event} event
   *   The event triggered.
   *
   * @fires event:dialogContentResize
   */
  function resetSize(event) {
    var positionOptions = ['width', 'height', 'minWidth', 'minHeight', 'maxHeight', 'maxWidth', 'position'];
    var adjustedOptions = {};
    var windowHeight = $(window).height();
    var option;
    var optionValue;
    var adjustedValue;
    for (var n = 0; n < positionOptions.length; n++) {
      option = positionOptions[n];
      optionValue = event.data.settings[option];
      if (optionValue) {
        // jQuery UI does not support percentages on heights, convert to pixels.
        if (typeof optionValue === 'string' && /%$/.test(optionValue) && /height/i.test(option)) {
          // Take offsets in account.
          windowHeight -= displace.offsets.top + displace.offsets.bottom;
          adjustedValue = parseInt(0.01 * parseInt(optionValue, 10) * windowHeight, 10);
          // Don't force the dialog to be bigger vertically than needed.
          if (option === 'height' && event.data.$element.parent().outerHeight() < adjustedValue) {
            adjustedValue = 'auto';
          }
          adjustedOptions[option] = adjustedValue;
        }
      }
    }
    // Offset the dialog center to be at the center of Drupal.displace.offsets.
    if (!event.data.settings.modal) {
      adjustedOptions = resetPosition(adjustedOptions);
    }
    event.data.$element
      .dialog('option', adjustedOptions)
      .trigger('dialogContentResize');
  }

  /**
   * Position the dialog's center at the center of displace.offsets boundaries.
   *
   * @function Drupal.dialog~resetPosition
   *
   * @param {object} options
   *   Options object.
   *
   * @return {object}
   *   Altered options object.
   */
  function resetPosition(options) {
    var offsets = displace.offsets;
    var left = offsets.left - offsets.right;
    var top = offsets.top - offsets.bottom;

    var leftString = (left > 0 ? '+' : '-') + Math.abs(Math.round(left / 2)) + 'px';
    var topString = (top > 0 ? '+' : '-') + Math.abs(Math.round(top / 2)) + 'px';
    options.position = {
      my: 'center' + (left !== 0 ? leftString : '') + ' center' + (top !== 0 ? topString : ''),
      of: window
    };
    return options;
  }

  $(window).on({
    'dialog:aftercreate': function (event, dialog, $element, settings) {
      var autoResize = debounce(resetSize, 20);
      var eventData = {settings: settings, $element: $element};
      if (settings.autoResize === true || settings.autoResize === 'true') {
        $element
          .dialog('option', {resizable: false, draggable: false})
          .dialog('widget').css('position', 'fixed');
        $(window)
          .on('resize.dialogResize scroll.dialogResize', eventData, autoResize)
          .trigger('resize.dialogResize');
        $(document).on('drupalViewportOffsetChange.dialogResize', eventData, autoResize);
      }
    },
    'dialog:beforeclose': function (event, dialog, $element) {
      $(window).off('.dialogResize');
      $(document).off('.dialogResize');
    }
  });

})(jQuery, Drupal, drupalSettings, Drupal.debounce, Drupal.displace);
;
/**
 * @file
 * Adds default classes to buttons for styling purposes.
 */

(function ($) {

  'use strict';

  $.widget('ui.dialog', $.ui.dialog, {
    options: {
      buttonClass: 'button',
      buttonPrimaryClass: 'button--primary'
    },
    _createButtons: function () {
      var opts = this.options;
      var primaryIndex;
      var $buttons;
      var index;
      var il = opts.buttons.length;
      for (index = 0; index < il; index++) {
        if (opts.buttons[index].primary && opts.buttons[index].primary === true) {
          primaryIndex = index;
          delete opts.buttons[index].primary;
          break;
        }
      }
      this._super();
      $buttons = this.uiButtonSet.children().addClass(opts.buttonClass);
      if (typeof primaryIndex !== 'undefined') {
        $buttons.eq(index).addClass(opts.buttonPrimaryClass);
      }
    }
  });

})(jQuery);
;
/**
 * @file
 * Attaches behavior for the Editor module.
 */

(function ($, Drupal, drupalSettings) {

  'use strict';

  /**
   * Finds the text area field associated with the given text format selector.
   *
   * @param {jQuery} $formatSelector
   *   A text format selector DOM element.
   *
   * @return {HTMLElement}
   *   The text area DOM element, if it was found.
   */
  function findFieldForFormatSelector($formatSelector) {
    var field_id = $formatSelector.attr('data-editor-for');
    // This selector will only find text areas in the top-level document. We do
    // not support attaching editors on text areas within iframes.
    return $('#' + field_id).get(0);
  }

  /**
   * Changes the text editor on a text area.
   *
   * @param {HTMLElement} field
   *   The text area DOM element.
   * @param {string} newFormatID
   *   The text format we're changing to; the text editor for the currently
   *   active text format will be detached, and the text editor for the new text
   *   format will be attached.
   */
  function changeTextEditor(field, newFormatID) {
    var previousFormatID = field.getAttribute('data-editor-active-text-format');

    // Detach the current editor (if any) and attach a new editor.
    if (drupalSettings.editor.formats[previousFormatID]) {
      Drupal.editorDetach(field, drupalSettings.editor.formats[previousFormatID]);
    }
    // When no text editor is currently active, stop tracking changes.
    else {
      $(field).off('.editor');
    }

    // Attach the new text editor (if any).
    if (drupalSettings.editor.formats[newFormatID]) {
      var format = drupalSettings.editor.formats[newFormatID];
      filterXssWhenSwitching(field, format, previousFormatID, Drupal.editorAttach);
    }

    // Store the new active format.
    field.setAttribute('data-editor-active-text-format', newFormatID);
  }

  /**
   * Handles changes in text format.
   *
   * @param {jQuery.Event} event
   *   The text format change event.
   */
  function onTextFormatChange(event) {
    var $select = $(event.target);
    var field = event.data.field;
    var activeFormatID = field.getAttribute('data-editor-active-text-format');
    var newFormatID = $select.val();

    // Prevent double-attaching if the change event is triggered manually.
    if (newFormatID === activeFormatID) {
      return;
    }

    // When changing to a text format that has a text editor associated
    // with it that supports content filtering, then first ask for
    // confirmation, because switching text formats might cause certain
    // markup to be stripped away.
    var supportContentFiltering = drupalSettings.editor.formats[newFormatID] && drupalSettings.editor.formats[newFormatID].editorSupportsContentFiltering;
    // If there is no content yet, it's always safe to change the text format.
    var hasContent = field.value !== '';
    if (hasContent && supportContentFiltering) {
      var message = Drupal.t('Changing the text format to %text_format will permanently remove content that is not allowed in that text format.<br><br>Save your changes before switching the text format to avoid losing data.', {
        '%text_format': $select.find('option:selected').text()
      });
      var confirmationDialog = Drupal.dialog('<div>' + message + '</div>', {
        title: Drupal.t('Change text format?'),
        dialogClass: 'editor-change-text-format-modal',
        resizable: false,
        buttons: [
          {
            text: Drupal.t('Continue'),
            class: 'button button--primary',
            click: function () {
              changeTextEditor(field, newFormatID);
              confirmationDialog.close();
            }
          },
          {
            text: Drupal.t('Cancel'),
            class: 'button',
            click: function () {
              // Restore the active format ID: cancel changing text format. We
              // cannot simply call event.preventDefault() because jQuery's
              // change event is only triggered after the change has already
              // been accepted.
              $select.val(activeFormatID);
              confirmationDialog.close();
            }
          }
        ],
        // Prevent this modal from being closed without the user making a choice
        // as per http://stackoverflow.com/a/5438771.
        closeOnEscape: false,
        create: function () {
          $(this).parent().find('.ui-dialog-titlebar-close').remove();
        },
        beforeClose: false,
        close: function (event) {
          // Automatically destroy the DOM element that was used for the dialog.
          $(event.target).remove();
        }
      });

      confirmationDialog.showModal();
    }
    else {
      changeTextEditor(field, newFormatID);
    }
  }

  /**
   * Initialize an empty object for editors to place their attachment code.
   *
   * @namespace
   */
  Drupal.editors = {};

  /**
   * Enables editors on text_format elements.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches an editor to an input element.
   * @prop {Drupal~behaviorDetach} detach
   *   Detaches an editor from an input element.
   */
  Drupal.behaviors.editor = {
    attach: function (context, settings) {
      // If there are no editor settings, there are no editors to enable.
      if (!settings.editor) {
        return;
      }

      $(context).find('[data-editor-for]').once('editor').each(function () {
        var $this = $(this);
        var field = findFieldForFormatSelector($this);

        // Opt-out if no supported text area was found.
        if (!field) {
          return;
        }

        // Store the current active format.
        var activeFormatID = $this.val();
        field.setAttribute('data-editor-active-text-format', activeFormatID);

        // Directly attach this text editor, if the text format is enabled.
        if (settings.editor.formats[activeFormatID]) {
          // XSS protection for the current text format/editor is performed on
          // the server side, so we don't need to do anything special here.
          Drupal.editorAttach(field, settings.editor.formats[activeFormatID]);
        }
        // When there is no text editor for this text format, still track
        // changes, because the user has the ability to switch to some text
        // editor, otherwise this code would not be executed.
        $(field).on('change.editor keypress.editor', function () {
          field.setAttribute('data-editor-value-is-changed', 'true');
          // Just knowing that the value was changed is enough, stop tracking.
          $(field).off('.editor');
        });

        // Attach onChange handler to text format selector element.
        if ($this.is('select')) {
          $this.on('change.editorAttach', {field: field}, onTextFormatChange);
        }
        // Detach any editor when the containing form is submitted.
        $this.parents('form').on('submit', function (event) {
          // Do not detach if the event was canceled.
          if (event.isDefaultPrevented()) {
            return;
          }
          // Detach the current editor (if any).
          if (settings.editor.formats[activeFormatID]) {
            Drupal.editorDetach(field, settings.editor.formats[activeFormatID], 'serialize');
          }
        });
      });
    },

    detach: function (context, settings, trigger) {
      var editors;
      // The 'serialize' trigger indicates that we should simply update the
      // underlying element with the new text, without destroying the editor.
      if (trigger === 'serialize') {
        // Removing the editor-processed class guarantees that the editor will
        // be reattached. Only do this if we're planning to destroy the editor.
        editors = $(context).find('[data-editor-for]').findOnce('editor');
      }
      else {
        editors = $(context).find('[data-editor-for]').removeOnce('editor');
      }

      editors.each(function () {
        var $this = $(this);
        var activeFormatID = $this.val();
        var field = findFieldForFormatSelector($this);
        if (field && activeFormatID in settings.editor.formats) {
          Drupal.editorDetach(field, settings.editor.formats[activeFormatID], trigger);
        }
      });
    }
  };

  /**
   * Attaches editor behaviors to the field.
   *
   * @param {HTMLElement} field
   *   The textarea DOM element.
   * @param {object} format
   *   The text format that's being activated, from
   *   drupalSettings.editor.formats.
   *
   * @listens event:change
   *
   * @fires event:formUpdated
   */
  Drupal.editorAttach = function (field, format) {
    if (format.editor) {
      // Attach the text editor.
      Drupal.editors[format.editor].attach(field, format);

      // Ensures form.js' 'formUpdated' event is triggered even for changes that
      // happen within the text editor.
      Drupal.editors[format.editor].onChange(field, function () {
        $(field).trigger('formUpdated');

        // Keep track of changes, so we know what to do when switching text
        // formats and guaranteeing XSS protection.
        field.setAttribute('data-editor-value-is-changed', 'true');
      });
    }
  };

  /**
   * Detaches editor behaviors from the field.
   *
   * @param {HTMLElement} field
   *   The textarea DOM element.
   * @param {object} format
   *   The text format that's being activated, from
   *   drupalSettings.editor.formats.
   * @param {string} trigger
   *   Trigger value from the detach behavior.
   */
  Drupal.editorDetach = function (field, format, trigger) {
    if (format.editor) {
      Drupal.editors[format.editor].detach(field, format, trigger);

      // Restore the original value if the user didn't make any changes yet.
      if (field.getAttribute('data-editor-value-is-changed') === 'false') {
        field.value = field.getAttribute('data-editor-value-original');
      }
    }
  };

  /**
   * Filter away XSS attack vectors when switching text formats.
   *
   * @param {HTMLElement} field
   *   The textarea DOM element.
   * @param {object} format
   *   The text format that's being activated, from
   *   drupalSettings.editor.formats.
   * @param {string} originalFormatID
   *   The text format ID of the original text format.
   * @param {function} callback
   *   A callback to be called (with no parameters) after the field's value has
   *   been XSS filtered.
   */
  function filterXssWhenSwitching(field, format, originalFormatID, callback) {
    // A text editor that already is XSS-safe needs no additional measures.
    if (format.editor.isXssSafe) {
      callback(field, format);
    }
    // Otherwise, ensure XSS safety: let the server XSS filter this value.
    else {
      $.ajax({
        url: Drupal.url('editor/filter_xss/' + format.format),
        type: 'POST',
        data: {
          value: field.value,
          original_format_id: originalFormatID
        },
        dataType: 'json',
        success: function (xssFilteredValue) {
          // If the server returns false, then no XSS filtering is needed.
          if (xssFilteredValue !== false) {
            field.value = xssFilteredValue;
          }
          callback(field, format);
        }
      });
    }
  }

})(jQuery, Drupal, drupalSettings);
;
