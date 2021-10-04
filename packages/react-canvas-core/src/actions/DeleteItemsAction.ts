import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { KeyboardEvent } from 'react';
import * as _ from 'lodash';
import { isEmpty } from 'lodash';

export interface KeyModifiers {
		ctrlKey?: boolean;
		shiftKey?: boolean;
		altKey?: boolean;
		metaKey?: boolean;
}
export interface DeleteItemsActionOptions {
	keyCodes?: number[];
	keys?: string[]
	modifiers?: KeyModifiers
}

function keyTest  (keys: string[] , keyCodes:number[], modifiers: KeyModifiers, key: string, keyCode: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean) {
	return (keys.includes(key) && _.isEqual({ ctrlKey, shiftKey, altKey, metaKey }, modifiers))
}

function keyCodeTest  (keys: string[] , keyCodes:number[], modifiers: KeyModifiers,key: string, keyCode: number,  ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean)  {
return (keyCodes.includes(keyCode) && _.isEqual({ ctrlKey, shiftKey, altKey, metaKey }, modifiers));
}
/**
 * Deletes all selected items
 */
export class DeleteItemsAction extends Action {


	constructor(options: DeleteItemsActionOptions = {}) {
		const keyCodes = options.keyCodes || [46, 8];
		const keys = options.keys ?? ['Backspace', 'Delete'];
		const test = _.isEmpty(options.keyCodes) ? keyTest : keyCodeTest;
		const modifiers = {
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
			...options.modifiers
		};
		super({
			type: InputType.KEY_DOWN,
			fire: (event: ActionEvent<KeyboardEvent>) => {
				const { key, keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;
				if (test(keys,keyCodes, modifiers, key, keyCode, ctrlKey, shiftKey, altKey, metaKey)) {
					_.forEach(this.engine.getModel().getSelectedEntities(), (model) => {
						// only delete items which are not locked
						if (!model.isLocked()) {
							model.remove();
						}
					});
					this.engine.repaintCanvas();
				}
			}
		});
	}
}
