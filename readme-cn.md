

# ChatGPT 高级命令指南

## 简介

本仓库提供了关于 ChatGPT 的高级prompt,以及如何创建高级Prompt.
目前搜集了 40+个chatgpt高级命令，是一个非盈利性的仓库，生成了一个 web 网站方便使用，目前网站没有任何广告，内容包含chatgpt高级命令手册、详解、学习，内容来自网络和网友的补充，非常值得收藏的chatgpt高级prompt速查手册。
版权归属原作者，对任何法律问题及风险不承担任何责任，没有任何商业目的，如果认为侵犯了您的版权，请来信告知。我不能完全保证内容的正确性。通过使用本站内容带来的风险与我无关。当使用本站时，代表您已接受了本站的使用条款和隐私条款。

## 仓库地址

[GitHub Repo - chatgpt-advanced-prompts](https://github.com/hougarry/chatgpt-advanced-prompts)

## 目录

- [简介](#简介)
- [安装](#安装)
- [高级命令](#高级命令)
  - [温度（Temperature）](#温度)
  - [最大令牌（Max Tokens）](#最大令牌)
  - [前缀（Prefix）](#前缀)
  - [系统指令（System Instructions）](#系统指令)
- [示例](#示例)
- [常见问题](#常见问题)
- [贡献](#贡献)
- [许可证](#许可证)

## 安装

你可以轻松地自行部署网页版，只需从 gh-pages 分支克隆代码到你的静态服务器即可。当然，你也可以从 `command` 目录拿走 Markdown 文件，并转换成 HTML 格式。另外，我们也提供了 Docker 部署方法。

⚠️ 如果你决定部署自己的静态网站版本，请考虑添加一个指向原 GitHub 仓库的链接，以便大家能共同完善这份命令文档，使其更加全面和丰富。当然，如果你选择移除所有与本站相关的信息，我并不会介意，我默认你有权这样做，且我不会负任何责任。如果你也进行了部署，欢迎在下方分享你的网站地址 :)。

### VPS部署

点击下面按钮一键部署至 [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hougarry/chatgpt-advanced-prompts)

<details>
<summary>部署结果</summary>

![](./assets/vercel.png)

</details>


### Docker 部署

### Vercel 部署


## 高级命令

### 温度（Temperature）

`温度` 是一个介于 0 和 1 之间的值，用于控制 ChatGPT 输出结果的随机性。较高的值（如 0.8 或 1）会让模型更加创造性，但可能导致不稳定的输出。较低的值（如 0.2 或 0.1）会让模型更加稳重，但可能较少创新。

### 最大令牌（Max Tokens）

`最大令牌` 是输出的字符数量上限。例如，如果设置为 50，则输出结果不会超过 50 个字符。

### 前缀（Prefix）

`前缀` 是一个字符串，用于给模型的输出添加特定的开头。例如，使用前缀 "注意：" 可以让模型的所有输出都以 "注意：" 开始。

### 系统指令（System Instructions）

这些是用于指导模型行为的指令。例如，你可以给模型一个指令，让它在回答问题时采用正式的语气。

## 示例

### 使用温度和最大令牌

```bash
# 使用温度 0.8 和最大令牌 100 运行 ChatGPT
gpt-3.5-turbo --temperature=0.8 --max_tokens=100 "你好，ChatGPT。"
```

### 使用前缀

```bash
# 使用前缀 "注意：" 运行 ChatGPT
gpt-3.5-turbo --prefix="注意：" "请告诉我今天的天气。"
```

## 常见问题

1. **高温度值会导致什么问题？**

   高温度值可能会导致模型输出变得不稳定和难以预测。

2. **我可以同时使用多个高级命令吗？**

   是的，你可以同时使用多个高级命令来自定义模型的行为。

## 贡献

如果你有好的想法或者建议，请通过 Pull Requests 或者在 Issues 区域进行提交。

## 许可证

本项目采用 MIT 许可证。请参照仓库中的 `LICENSE` 文件了解更多信息。

---

希望这个 README.md 能够帮助你更有效地使用 ChatGPT！
