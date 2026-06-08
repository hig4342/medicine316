import type { Component } from 'svelte';
import type { Editor } from '@tiptap/core';

export interface ToolBarCommand {
	id: string;
	icon: Component;
	label: string;
	shortCut?: string;
	onClick?: (editor: Editor) => void;
	turnInto?: (editor: Editor, node: Node, pos: number) => void;
	isActive?: (editor: Editor) => boolean;
	clickable?: (editor: Editor) => boolean;
}

export interface CommandsGroup {
	id: string;
	label: string;
	commands: ToolBarCommand[];
}
