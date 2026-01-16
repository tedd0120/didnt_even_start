# 甚至没有开始 (Didn't Even Start)

一个反向 Todo 的 iOS/Android App：记录“打算做但最后放弃”的事，用轻松幽默缓解焦虑。

## 主要功能
- 放弃清单：记录放弃事项，支持置顶、删除（可撤销）、转移到“临时上进”
- 临时上进：展示已达成事项，副标题每次打开随机切换
- 勋章墙：普通勋章与隐藏勋章分层展示，隐藏勋章占位为“？？？”
- 勋章分享：一键生成勋章拼图并保存到相册

## 技术栈
- React Native + Expo (SDK 54)
- TypeScript
- Expo Router (app/ 目录路由)
- AsyncStorage 本地持久化
- @expo/vector-icons

## 本地运行
```bash
npm install
npx expo start
```

## 目录结构（核心）
```text
app/                 # 页面与路由
components/          # 复用 UI 组件
hooks/               # 状态与业务逻辑
lib/                 # 存储、勋章规则、时间与主题
types/               # TypeScript 类型
openspec/            # 规范与变更记录
```

## 交互说明
- 删除不会影响勋章统计（勋章按累计放弃次数解锁）
- 转移到“临时上进”也不会回退勋章

## 备注
如需更新规范，请查看 `openspec/` 目录并使用 `openspec-cn` 命令验证。
