import { LayerModel } from '../layer/LayerModel';
import { FactoryBank } from '../../core/FactoryBank';
import { AbstractModelFactory } from '../../core/AbstractModelFactory';
import { BaseModel } from '../../core-models/BaseModel';
import { IClientRect } from '../../states/SelectionBoxState';

export class SelectionLayerModel extends LayerModel {
	public box: IClientRect | undefined;

	constructor() {
		super({
			transformed: false,
			isSvg: false,
			type: 'selection'
		});
	}

	setBox(rect: IClientRect) {
		this.box = rect;
	}

	getChildModelFactoryBank(): FactoryBank<AbstractModelFactory<BaseModel>> | null {
		// is not used as it doesnt serialize
		return null;
	}
}
