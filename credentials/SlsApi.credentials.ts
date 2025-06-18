import {
	ICredentialType,
	INodeProperties
} from 'n8n-workflow';

export class SlsApi implements ICredentialType {
	name = 'slsApi';
	displayName = 'SLS API';
	documentationUrl = 'https://api.aliyun.com/document/Sls/2020-12-30/overview';
	properties: INodeProperties[] = [
		{
			displayName: 'Endpoint',
			name: 'endpoint',
			type: 'string',
			default: 'cn-beijing.log.aliyuncs.com',
		},
		{
			displayName: 'AccessKey ID',
			name: 'accessKeyId',
			type: 'string',
			default: '',
			required: true
		},
		{
			displayName: 'AccessKey Secret',
			name: 'accessKeySecret',
			type:'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true
		}
	];
}
