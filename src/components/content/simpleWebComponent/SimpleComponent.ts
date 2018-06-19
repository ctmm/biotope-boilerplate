import {hyper} from 'hyperhtml/esm';
import {BiotopeReduxStoreConnector} from "../../core/BiotopeReduxStoreConnector";
import {SimpleComponentState, createInitialSimpleComponentState} from './SimpleComponentState';
import SimpleComponentReducerCreator from './SimpleComponent.reducer';
import {countUp} from './SimpleComponent.actions';

export class SimpleComponent extends HTMLElement {
	static componentName: string = 'simple-component';
	private html: any;
	private componentId: string;
	private storeConnector: BiotopeReduxStoreConnector<SimpleComponentState>;

	constructor() {
		super();
		this.html = hyper.bind(this);
		console.log('test');
	}

	connectedCallback() {
		// TODO use decorators
		// this.storeConnector = new BiotopeReduxStoreConnector({
		// 	store: biotopeInjectorStore || window['biotope'].store,
		// 	injectorConfig: biotopeInjectorConfig,
		// 	componentId: biotopeComponentId || this.componentId,
		// 	reducerCreator: SimpleComponentReducerCreator,
		// 	triggerOnStateChange: (state: SimpleComponentState, lastState: SimpleComponentState) => this.onStateChange(state, lastState)
		// });

		this.storeConnector = new BiotopeReduxStoreConnector({
			store: window['biotope'].store,
			componentId: this.componentId,
			reducerCreator: SimpleComponentReducerCreator,
			triggerOnStateChange: (state: SimpleComponentState, lastState: SimpleComponentState) => this.onStateChange(state, lastState)
		});
		this.componentId = this.storeConnector.getComponentId();

		// TODO add helpers for initial state injection to BiotopeReduxStoreConnector
		// JSON-LD
		// Attributes
		// Rehydrate

		this.render(createInitialSimpleComponentState());
	}

	countUp() {
		console.log('dispatching COUNT_UP reducer');
		this.storeConnector.dispatch(countUp(this.componentId));
	}

	onStateChange(state: SimpleComponentState = {counter: 0}, lastState: SimpleComponentState) {
		console.log('onStateChange', state, lastState);
		this.render(state);
	}

	render(state: SimpleComponentState) {
		return this.html`
			<button onclick=${this.countUp.bind(this)}>Count Up</button>
			<span class="simpleComponent__counter">${state.counter}</span>
		`;
	}
}

if (!customElements.get(SimpleComponent.componentName)) {
	customElements.define(SimpleComponent.componentName, SimpleComponent);
}
