
import AbstractRestClient from 'ima-plugin-rest-client/src/AbstractRestClient';
import Response from 'ima-plugin-rest-client/src/Response';
import HalsonConfigurator from './HalsonConfigurator';
import HalsonLinkGenerator from './HalsonLinkGenerator';
import HalsonResponsePostProcessor from './HalsonResponsePostProcessor';

export default class HalsonRestClient extends AbstractRestClient {
	constructor(httpAgent, apiRoot, linkMapResolver = body => body._links,
			preProcessors = [], postProcessors = []) {
		super(
			httpAgent,
			new HalsonConfigurator(httpAgent, apiRoot, linkMapResolver),
			new HalsonLinkGenerator(),
			preProcessors,
			[new HalsonResponsePostProcessor()].concat(postProcessors)
		);
	}

	list(resource, parameters = {}, options = {}, parentEntity = null) {
		return super.list(
			resource,
			parameters,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		})
	}

	get(resource, id, parameters = {}, options = {}, parentEntity = null) {
		return super.get(
			resource,
			id,
			parameters,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		});
	}

	patch(resource, id, data, options = {}, parentEntity = null) {
		return super.patch(
			resource,
			id,
			data,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		});
	}

	replace(resource, id, data, options = {}, parentEntity = null) {
		return super.replace(
			resource,
			id,
			data,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		});
	}

	create(resource, data, options = {}, parentEntity = null) {
		return super.create(
			resource,
			data,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		});
	}

	delete(resource, id, options = {}, parentEntity = null) {
		return super.delete(
			resource,
			id,
			options,
			parentEntity
		).then((response) => {
			return this._finalizeRequestResult(response);
		});
	}
	
	_finalizeRequestResult(response) {
		let resource = response.request.resource;

		let processedBody;
		if (response.body instanceof Array) {
			processedBody = response.body.map(
				entityData => new resource(this, entityData)
			);
		} else if (response.body) {
			processedBody = new resource(this, response.body);
		} else {
			processedBody = null;
		}

		if (resource.inlineResponseBody) {
			return processedBody;
		}
		return new Response(Object.assign({}, response, {
			body: processedBody
		}));
	}
}
