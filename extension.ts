import * as vscode from 'vscode';
var open = require('open');

export function activate() { 
	vscode.commands.registerCommand('searchdocs.searchSO', () => {
		getQueryAndSearch('http://stackoverflow.com/search?q=%s', 'Stack Overflow');
	});
	
	vscode.commands.registerCommand('searchdocs.searchMDN', () => {
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
		const editor = vscode.window.activeTextEditor;
		if (!editor) return Promise.resolve(null);
		
		const searchWordUnderCursor = vscode.workspace.getConfiguration('searchdocs')['searchWordUnderCursor'];
		const selection = editor.selection;
		if (searchWordUnderCursor || !selection.isEmpty) {
			let searchText = getSelectedTextOrCursorWord(editor).trim();
			if (searchText) return Promise.resolve(searchText.trim());
		}
			
		return vscode.window.showInputBox({ prompt: `${providerName}: Enter your query` })
			.then(searchText => searchText && searchText.trim());	
	}
	
	function getSelectedTextOrCursorWord(editor: vscode.TextEditor): string {
		const selection = editor.selection;
		const doc = editor.document;
		if (selection.isEmpty) {
			const cursorWordRange = doc.getWordRangeAtPosition(selection.active);
			return cursorWordRange ?
				doc.getText(cursorWordRange) :
				'';
		} else {
			return doc.getText(selection);
		}
	}
}
