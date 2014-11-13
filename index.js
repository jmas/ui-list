var Arr = require('jmas/arr');
var hogan = require('twitter/hogan.js');
var dom = require('jmas/dom');

var defaultItemTemplate = hogan.compile('<div class="ui-list-item">{{name}}</div>');

var UiList = function(options) {
  options = options || {};
  
  if (typeof options.items === 'undefined') {
    throw Error('Options property "items" is required.');
  }

  if (typeof options.itemTemplate !== 'undefined') {
    this.itemTemplate = hogan.compile(options.itemTemplate);
  } else {
    this.itemTemplate = defaultItemTemplate;
  }
  
  if (typeof options.el !== 'undefined') {
    this.el = options.el;
  } else {
    this.el = document.createElement('DIV');
  }
  
  this.el.classList.add('ui-list');
  
  this.setItems(options.items);
};

UiList.prototype.el = null;
UiList.prototype.items = null;
UiList.prototype.itemTemplate = null;

UiList.prototype.render = function() {
  var result = [];
  var items = this.items.slice(0);
  for (var i=0,len=items.length; i<len; i++) {
    result.push(this.itemTemplate.render(items[i]));
  }
  dom.replaceHtml(this.el, result.join(''));
};

UiList.prototype.setItems = function(items) {
  if (items instanceof Arr === false) {
    throw Error('items should be an instance of Arr.');
  }
  
  this.items = items;
  this.items.on('change', this.render);
  this.render();
};

module.exports = UiList;
