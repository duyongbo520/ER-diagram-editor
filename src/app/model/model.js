(function (angular) {
	'use strict';
	angular.module('myApp.model', []);

	angular.module('myApp.model')
		.constant('DataType', [
			new DataType('INTEGER'),
			new DataType('NUMERIC'),
			new DataType('VARCHAR', 128),
			new DataType('TEXT'),
			new DataType('DATE'),
			new DataType('TIMESTAMP')
		]);
})(window.angular);

/**
 * Models shared globally
 */

/**
 * Entity model
 * @param name
 * @constructor
 */
function Entity(name) {
	this.name = name;
	this.attributes = [];
	this.dom = null;
	this.connectors = [];
}

Entity.prototype.addAttribute = function (attributeData) {
	var newAttr = new Attribute(attributeData);
	this.attributes.push(newAttr);
	return newAttr;
};

Entity.prototype.getAttribute = function (index) {
	return this.attributes[index];
};

Entity.prototype.editAttribute = function (index, attributeData) {
	this.attributes[index].updateData(attributeData);
};

Entity.prototype.removeAttribute = function (index) {
	// also delete connectors if needed
	this.attributes.splice(index, 1);
};

Entity.prototype.addConnectors = function (connectors) {
	this.connectors.push(connectors);
};

Entity.prototype.removeConnectors = function (connectors) {
	var idx = this.connectors.indexOf(connectors);
	if (idx === -1) {
		return;
	}
	this.connectors.splice(idx, 1);
};

Entity.prototype.summarize = function () {
	var attributes = [];
	var primaryKeys = [];
	this.attributes.forEach(function (attribute) {
		var meta = {
			name: attribute.name,
			type: attribute.type.name
		};
		if (attribute.type.hasLength) {
			meta.length = attribute.type.length;
		}
		if (attribute.notNull) {
			meta.notNull = true;
		}
		if (attribute.isPrimaryKey) {
			primaryKeys.push(attribute.name);
		}
		attributes.push(meta);
	});

	return {
		name: this.name,
		attributes: attributes,
		primaryKey: primaryKeys
	}
};

/**
 * Relationship model
 * @param name
 * @constructor
 */
function Relationship(name) {
	this.name = name;
	this.attributes = []
	this.dom = null;
}

/**
 * Attribute model
 * @param attributeData
 * @constructor
 */
function Attribute(attributeData) {
	this.name = attributeData.name;
	this.type = attributeData.type;
	this.notNull = attributeData.notNull;
	this.isPrimaryKey = attributeData.isPrimaryKey || false;
	this.isForeignKey = attributeData.isForeignKey || false;
	this.isKey = this.isPrimaryKey || this.isForeignKey;

	this.dom = null;
	this.connectors = [];
}

Attribute.prototype.updateData = function (attributeData) {
	this.name = attributeData.name;
	this.type = attributeData.type;
	this.notNull = attributeData.notNull;
	this.isPrimaryKey = attributeData.isPrimaryKey || false;
	this.isForeignKey = attributeData.isForeignKey || false;
};

Attribute.prototype.addConnectors = function (connectors) {
	this.connectors.push(connectors);
};

Attribute.prototype.removeConnectors = function (connectors) {
	var idx = this.connectors.indexOf(connectors);
	if (idx === -1) {
		return;
	}
	this.connectors.splice(idx, 1);
};

/**
 * DataType model
 * @param name
 * @param length
 * @constructor
 */
function DataType(name, length) {
	this.name = name;
	this.length = length || 0;
	this.hasLength = this.length !== 0 || false;
}