# yinxiang-mcp-server
印象笔记MCP，权限全开
# 印象笔记 MCP Server

让 AI 助手（如 Claude、Cursor 等）直接管理你的印象笔记！支持搜索、创建、更新、删除笔记，管理笔记本和标签。

---

## 快速开始（你只需做这几步）

### 第一步：准备环境

- **Node.js** - 检测是否已安装，若未安装，可从 [nodejs.org](https://nodejs.org) 下载安装
- **印象笔记开发者 Token** - 从 [app.yinxiang.com/api/DeveloperToken.action](https://app.yinxiang.com/api/DeveloperToken.action) 获取（注意：Token 有效期只有 **7 天**，过期后需重新获取）

### 第二步：安装

```bash
# 克隆仓库
git clone https://github.com/示例用户/示例项目.git
cd yinxiang-mcp-server

# 安装依赖
npm install

# 编译
npm run build
```

### 第三步：配置 MCP

将以下内容添加到你的 MCP 配置文件（如 Claude Desktop Config）：

```json
{
  "mcpServers": {
    "yinxiang": {
      "command": "node",
      "args": [
        "C:\\路径\\到\\yinxiang-mcp-server\\dist\\index.js"
      ],
      "env": {
        "YINXIANG_AUTH_TOKEN": "你的开发者Token",
        "YINXIANG_SANDBOX": "false"
      }
    }
  }
}
```

> **⚠️ 注意**：Token 需要自行填入，建议通过环境变量或配置文件传入，不要硬编码在代码中。

### 第四步：测试

配置完成后，AI 助手即可调用以下工具管理你的印象笔记。

---

## 可用功能列表

| 工具名称 | 功能说明 | 参数 |
|---------|---------|------|
| `list_notebooks` | 列出所有笔记本 | 无 |
| `get_default_notebook` | 获取默认笔记本 | 无 |
| `list_tags` | 列出所有标签 | 无 |
| `create_note` | 创建新笔记 | `title`(标题), `content`(内容，支持HTML), `notebookGuid`(可选，笔记本GUID), `tagNames`(可选，标签列表) |
| `search_notes` | 搜索笔记 | `query`(关键词), `maxResults`(可选，默认20) |
| `get_note` | 获取笔记详情 | `guid`(笔记GUID) |
| `update_note` | 更新笔记 | `guid`(笔记GUID), `title`(可选，新标题), `content`(可选，新内容) |
| `delete_note` | 删除笔记（移到回收站） | `guid`(笔记GUID) |
| `create_notebook` | 创建笔记本 | `name`(笔记本名称) |
| `create_tag` | 创建标签 | `name`(标签名称) |

---

## 注意事项

1. **Token 有效期**：印象笔记开发者 Token 有效期仅为 **7 天**，过期后需重新获取并更新配置。
2. **数据安全**：Token 是访问你笔记的钥匙，请勿泄露给他人，建议通过环境变量传入。
3. **沙盒环境**：如需测试，可将 `YINXIANG_SANDBOX` 设为 `"true"`。
4. **网络要求**：需要能正常访问印象笔记服务。
5. **权限范围**：Token 拥有对你账户的完全访问权限，请谨慎使用。

---

## 项目结构

```
yinxiang-mcp-server/
├── src/
│   └── index.ts          # 主入口文件
├── dist/                 # 编译输出
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
└── README.md             # 本文件
```

---

## 技术栈

- TypeScript
- Node.js
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol)
- [evernote](https://www.npmjs.com/package/evernote) 官方 SDK

---

## 开源协议

MIT

---

> 由 AI 助手协助构建，让印象笔记管理更智能！
