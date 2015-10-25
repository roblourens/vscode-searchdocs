import * as vscode from 'vscode';
var open = require('open');

export function activate() { 
	vscode.commands.registerCommand('extension.searchSO', () => {
		showSearchDialogForSelectedText('http://stackoverflow.com/search?q=%s');
	});
	
	vscode.commands.registerCommand('extension.searchMDN', () => {
		showSearchDialogForSelectedText('https://developer.mozilla.org/en-US/search?q=%s');
	});
	
	function showSearchDialogForSelectedText(searchUrl: string): void {
		const editor = vscode.window.getActiveTextEditor();
		if (!editor) return;
		
		const selection = editor.getSelection();
		let suggestedSearchText: string;
		if (selection.isEmpty()) {
			const cursorWordRange = editor.getTextDocument().getWordRangeAtPosition(selection.start);
			suggestedSearchText = cursorWordRange ?
				editor.getTextDocument().getTextInRange(cursorWordRange) :
				'';
		} else {
			suggestedSearchText = editor.getTextDocument().getTextInRange(new vscode.Range(selection.anchor, selection.active));
		}
		
		showSearchDialog(searchUrl, suggestedSearchText);
	}
	
	function showSearchDialog(searchUrl: string, suggestedText?: string): void {
		const prompt = suggestedText ?
			`Press enter to search for ${suggestedText}, or enter your query`:
			'Enter your query';
		vscode.window.showInputBox({ placeHolder: suggestedText, prompt }).then(result => {
			const searchText = result || suggestedText;
			if (searchText) {
				searchUrl = searchUrl.replace('%s', encodeURIComponent(searchText));
				open(searchUrl);
				//vscode.window.showInformationMessage(`open(${searchUrl})`);
			}
		});
	}
}
