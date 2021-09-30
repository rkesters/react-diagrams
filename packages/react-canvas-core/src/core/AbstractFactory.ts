import { CanvasEngine } from '../CanvasEngine';
import { FactoryBank } from './FactoryBank';

/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
export abstract class AbstractFactory<E extends CanvasEngine = CanvasEngine> {

	protected bank: FactoryBank | undefined | null;

	constructor(protected type: string, protected engine: E) {
		this.type = type;
	}

	setDiagramEngine(engine: E): void {
		this.engine = engine;
	}

	setFactoryBank(bank: FactoryBank<any> | null): void {
		this.bank = bank;
	}

	getType(): string {
		return this.type;
	}
}
