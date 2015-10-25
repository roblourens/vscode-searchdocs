import * as vscode from 'vscode';
var open = require('open');

export function activate() { 
	vscode.commands.registerCommand('extension.searchSO', () => {
		getQueryAndSearch('http://stackoverflow.com/search?q=%s', 'StackOverflow');
	});
	
	vscode.commands.registerCommand('extension.searchMDN', () => {
		getQueryAndSearch('https://developer.mozilla.org/en-US/search?q=%s', 'MDN');
	});
	
	function getQueryAndSearch(searchUrl: string, providerName: string): void {
		const editor = vscode.window.getActiveTextEditor();
		if (!editor) return;
		
		const selection = editor.getSelection();
		let searchTextP: Thenable<string>;
		if (selection.isEmpty()) {
			searchTextP = vscode.window.showInputBox({ prompt: `${providerName}: Enter your query` });
		} else {
			searchTextP = Promise.resolve(editor.getTextDocument().getTextInRange(new vscode.Range(selection.anchor, selection.active)));
		}
		
		searchTextP.then(searchText => {
			if (searchText) {
				open(searchUrl.replace('%s', encodeURIComponent(searchText)));
			}
		});
	}
}
