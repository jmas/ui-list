var Arr = require('jmas/arr');
var hogan = require('twitter/hogan.js');
var dom = require('jmas/dom');

var defaultItemTemplate = hogan.compile('<div>{{name}}</div>');

function itemClickHandler(event) {
  var target = dom.findParentNode(event.target, 'data-item');
  
  if (target) {
    event.preventDefault();
    
    var index = target.getAttribute('data-item');
    
    if (! index) {
      return;
    }
    
    var item = this.items.get(index);
    
    if (! item) {
      return;
    }
    
    item._selected = typeof item._selected === 'undefined' ? true: ! item._selected;
    
    this.items.set(index, item);
    
    if (! this.onSelect) {
      return;
    }
    
    if (typeof this.onSelect !== 'function') {
      throw Error('onSelect should be an function.');
    }
    
    this.onSelect();
  }
};

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
  
  if (typeof options.onSelect !== 'undefined') {
    this.onSelect = options.onSelect;
  }
  
  this.el.classList.add('ui-list');
  
  dom.addListener(this.el, 'click', itemClickHandler.bind(this));
  
  this.setItems(options.items);
};

UiList.prototype.el = null;
UiList.prototype.items = null;
UiList.prototype.itemTemplate = null;
UiList.prototype.onSelect = null;

UiList.prototype.render = function() {
  var result = [];
  var items = this.items.slice(0);
  for (var i=0,len=items.length; i<len; i++) {
    result.push('<div data-item="'+i+'" class="ui-list-item '+(typeof items[i]._selected !== 'undefined' && items[i]._selected === true ? 'active': '')+'">' + this.itemTemplate.render(items[i]) + '</div>');
  }
  dom.replaceHtml(this.el, result.join(''));
};

UiList.prototype.setItems = function(items) {
  if (items instanceof Arr === false) {
    throw Error('items should be an instance of Arr.');
  }
  
  this.items = items;
  this.items.on('change', this.render.bind(this));
  this.render();
};

UiList.prototype.getSelected = function() {
  return this.items.filter(function(item) {
    return typeof item._selected !== 'undefined' && item._selected === true;
  });
};

module.exports = UiList;
