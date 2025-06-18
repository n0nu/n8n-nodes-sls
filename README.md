# n8n-nodes-sls

## 项目概述
`n8n-nodes-sls` 是一个为 n8n 工作流自动化平台定制的扩展项目，提供阿里云日志服务（SLS）的对接调用功能。该项目提供了自定义节点，让用户能够在 n8n 工作流中轻松与阿里云 SLS 进行交互，实现日志查询功能。

## 项目结构
```
├── .editorconfig
├── .eslintrc.js
├── .eslintrc.prepublish.js
├── .gitignore
├── .npmignore
├── .prettierrc.js
├── .vscode/
│   └── extensions.json
├── CODE_OF_CONDUCT.md
├── LICENSE.md
├── README.md
├── README_TEMPLATE.md
├── credentials/
│   └── SlsApi.credentials.ts
├── gulpfile.js
├── index.js
├── nodes/
│   └── Sls/
│       ├── Sls.node.json
│       ├── Sls.node.ts
│       ├── sls.svg
│       └── sls.svg:Zone.Identifier
├── package-lock.json
├── package.json
└── tsconfig.json
```

## 安装与配置
### 安装依赖
```bash
pnpm install
```

### 构建项目
```bash
pnpm run build
```

## 使用方法
1. 在 n8n 界面中配置阿里云 SLS 的访问凭证，包括 `Endpoint`、`AccessKey ID` 和 `AccessKey Secret`
2. 在 n8n 界面中添加 `Sls` 节点，配置相应的参数后即可在工作流中使用阿里云 SLS 的功能。当前支持的操作主要包括：日志搜索。

## 许可证
本项目采用 [MIT 许可证](LICENSE.md)。
