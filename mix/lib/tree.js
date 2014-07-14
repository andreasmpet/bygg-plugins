'use strict';

var mixIn = require('mout/object/mixIn');
var path = require('path');

module.exports = Tree;

function Tree(nodes) {
    this.nodes = nodes;
}

Tree.prototype.cloneNode = function (node) {
    var clone = mixIn({}, node);
    clone.metadata = mixIn({}, node.metadata);
    clone.sibling = node.siblings.slice();
    return clone;
};

Tree.prototype.cloneSibling = function (sibling, node) {
    return mixIn({}, sibling);
};

Tree.prototype.findNodeByName = function (name) {
    return this.findNode(function (n) {
        return n === name;
    });
};

Tree.prototype.findNodeByPath = function (absPath) {
    return this.findNode(function (name, base) {
        return path.join(base, name) === absPath;
    });
};

Tree.prototype.findNode = function (predicate) {
    for (var nodeIndex = 0; nodeIndex !== this.nodes.length; nodeIndex++) {
        var node = this.nodes[nodeIndex];
        if (predicate(node.name, node.base)) {
            return node;
        }
        for (var siblingIndex = 0; siblingIndex !== node.siblings.length; siblingIndex++) {
            var sibling = node.siblings[siblingIndex];
            if (predicate(sibling.name, node.base)) {
                return {
                    name: sibling.name,
                    base: node.base,
                    data: sibling.data,
                    stat: sibling.stat,
                    metadata: {},
                    siblings: []
                };
            }
        }
    }
    return null;
};

Tree.merge = function () {
    var result = new Tree([]);
    for (var i = 0; i !== arguments.length; i++) {
        var tree = arguments[i];
        result.nodes.push.apply(result.nodes, tree.nodes);
    }
    return result;
};
