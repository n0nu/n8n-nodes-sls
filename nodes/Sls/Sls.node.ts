import Sls20201230, * as $Sls20201230 from '@alicloud/sls20201230';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import Credential from '@alicloud/credentials';
import * as $tea from '@alicloud/tea-typescript';

import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';


export class Sls implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sls',
		name: 'sls',
		icon: 'file:sls.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["logstore"]}}',
		description: 'Interact with SLS API',
		defaults: {
			name: 'Sls',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'slsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Search',
						action: 'Search logs',
						value: 'search',
						description: 'Search logs',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Project Name',
				name: 'project',
				type:'string',
				default: '',
				required: true,
				description: 'SLS\'s project name',
			},
			{
				displayName: 'Logstore Name',
				name: 'logstore',
				type:'string',
				default: '',
				required: true,
				description: 'SLS\'s logstore name',
			},
			{
				displayName: 'Topic Name',
				name: 'topic',
				type:'string',
				default: '',
				description: 'Logstore\'s topic name',
			},
			{
				displayName: 'From Data',
				name: 'from',
				type: 'number',
				default: 0,
				required: true,
				description: 'Began of the time range of this query',
			},
			{
				displayName: 'To Data',
				name: 'to',
				type: 'number',
				default: 0,
				required: true,
				description: 'End of the time range of this query',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '*',
				description: 'Query statement',
			},
			{
				displayName: 'Line',
				name: 'line',
				type:'number',
				default: 100000,
				description: 'Number of lines to return, max 100000',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type:'number',
				default: 0,
				description: 'Offset of the first line to return',
			},
			{
				displayName: 'Reverse',
				name: 'reverse',
				type:'boolean',
				default: false,
				description: 'Whether to sort by timestamp in descending order (true) or ascending order (false)',
			},
			{
				displayName: 'PowerSql',
				name:'powerSql',
				type:'boolean',
				default: false,
				description: 'Whether to enable PowerSql mode',
			}
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('slsApi');
		const project = this.getNodeParameter('project',0) as string;
		const logstore = this.getNodeParameter('logstore',0) as string;
		const topic = this.getNodeParameter('topic',0) as string;
		const from = this.getNodeParameter('from',0) as number;
		const to = this.getNodeParameter('to',0) as number;
		const query = this.getNodeParameter('query',0) as string;
		const line = this.getNodeParameter('line',0) as number;
		const offset = this.getNodeParameter('offset',0) as number;
		const reverse = this.getNodeParameter('reverse',0) as boolean;
		const powerSql = this.getNodeParameter('powerSql',0) as boolean;
		let config = new $OpenApi.Config({});
		config.endpoint = credentials.endpoint as string;
		config.accessKeyId = credentials.accessKeyId as string;
		config.accessKeySecret = credentials.accessKeySecret as string;
		const client = new Sls20201230(config);
		let getLogsRequest;
		let getLogsResponse;
		let begin=offset;
		let iline=line;
		const allResponses: any[] = [];
		do {
			try {
				getLogsRequest = new $Sls20201230.GetLogsRequest({
					from: from,
					to: to,
					query: query,
					topic: topic,
					reverse: reverse,
					powerSql: powerSql,
					line: iline < 100 ? iline : 100,
					offset: begin,
				});
				getLogsResponse = await client.getLogs(project, logstore, getLogsRequest);
			}
			catch (error) {
				throw new NodeOperationError(this.getNode(), error);
			}

			if (Array.isArray(getLogsResponse.body)) {
				if (getLogsResponse.body.length === 0) {
					break;
				} else {
					allResponses.push(...getLogsResponse.body);
				}
			} else {
				if (getLogsResponse.body === undefined) {
					throw new NodeOperationError(this.getNode(), 'getLogsResponse.body is undefined');
				} else {
					throw new NodeOperationError(this.getNode(), getLogsResponse.body);
				}
			}
			begin += 100;
			iline -= 100;
		} while (iline > 0 && begin-offset < 100000);

		return [
			this.helpers.returnJsonArray(allResponses),
		];
	}
}
