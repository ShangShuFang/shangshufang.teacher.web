const marked = require('marked');

exports.convertToHtml = function (content) {
	let html = marked(content);
	return html;
};