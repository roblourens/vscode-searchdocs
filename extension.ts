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
		getQuery(searchUrl, providerName).then(searchText => {
			if (searchText) {
				open(searchUrl.replace('%s', encodeURIComponent(searchText)));
			}
		});
	}
	
	function getQuery(searchUrl: string, providerName: string): Thenable<string> {
		const editor = vscode.window.getActiveTextEditor();
		if (!editor) return Promise.resolve(null);
		
		return vscode.extensions.getConfigurationMemento('searchdocs').getValue('searchWordUnderCursor', false).then(searchWordUnderCursor => {
			const selection = editor.getSelection();
			if (searchWordUnderCursor || !selection.isEmpty()) {
				let searchText = getSelectedTextOrCursorWord(editor).trim();
				if (searchText) return searchText;
			}
			
			return vscode.window.showInputBox({ prompt: `${providerName}: Enter your query` });
		}).then(searchText => searchText && searchText.trim());	
	}
	
	function getSelectedTextOrCursorWord(editor: vscode.TextEditor): string {
		const selection = editor.getSelection();
		const doc = editor.getTextDocument();
		if (selection.isEmpty()) {
			const cursorWordRange = doc.getWordRangeAtPosition(selection.active);
			return cursorWordRange ?
				doc.getTextInRange(cursorWordRange) :
				'';
		} else {
			return doc.getTextInRange(selection);
		}
	}
}
