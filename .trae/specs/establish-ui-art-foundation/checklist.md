# Checklist — 里程碑一：UI 与艺术风格基础

> 验证每个检查点。通过则在 `[ ]` 中打 `x`。未通过的检查点需在 tasks.md 新建修复任务。

## 项目骨架
- [ ] Unity 2022 LTS+ 项目可正常打开，无报错
- [ ] 标准目录结构存在（Scripts/Art/Prefabs/Resources/Scenes），各目录有 asmdef 或 README 说明
- [ ] Boot 场景为 Build Settings index 0，启动后正确初始化全局服务
- [ ] git 仓库已初始化，Library/Temp 等被忽略

## 屏幕管理系统
- [ ] `UIScreen` 基类定义了 OnEnter/OnExit/OnPause/OnResume 生命周期
- [ ] `ScreenManager` 支持 Push/Pop/Switch/Clear，栈状态正确
- [ ] Pop 到空栈不报错，重复 Push 同类型有合理处理
- [ ] 屏幕过渡动画平滑无闪烁（淡入淡出 + 位移）
- [ ] ScreenManager 单元测试通过

## 主菜单屏幕
- [ ] 显示标题《九州》、水墨背景占位、4 个按钮（开始/继续/设置/退出）
- [ ] 背景有缓慢呼吸/视差动画占位
- [ ] 开始→朝代选择（Switch）、设置→设置（Push）、退出→确认对话框→退出
- [ ] 进入主菜单播放 BGM，按钮点击播放 SFX

## 朝代选择屏幕
- [ ] 展示至少 4 个占位朝代卡片（周/秦/唐/宋）
- [ ] 每张卡片显示朝代名、领袖名占位、特色图标占位
- [ ] 选中卡片有视觉反馈，详情面板刷新
- [ ] 点击开始→跳转到游戏内 HUD；返回→Pop 回主菜单

## 设置/存档屏幕
- [ ] 分组完整：音频（主音量/BGM/SFX 滑条）、画面（分辨率/全屏/画质）、语言、游戏
- [ ] 音量滑条实时影响 AudioManager，数值持久化跨启动
- [ ] 语言下拉仅中文可选，其他禁用并标注「敬请期待」
- [ ] 存档子页 3 个槽位占位，按钮点击仅弹占位提示
- [ ] 设置序列化为 JSON，启动时加载

## 游戏内 HUD 屏幕
- [ ] 顶部资源条（金钱/粮食/产能/科技/文化 5 个图标 + 数值）
- [ ] 顶部右侧回合数显示
- [ ] 右下小地图占位框、左下信息面板占位、右下回合结束按钮
- [ ] `FiveElementsBar` 独立组件存在，金木水火土 5 个图标位 + 「—」占位
- [ ] `FengShuiPanel` 独立组件存在，显示「风水：—」占位
- [ ] 城市按钮弹出城市面板占位（含 FengShuiPanel）
- [ ] 菜单按钮 Push 设置屏幕

## Design Tokens 与主题
- [ ] `DesignTokenSet` ScriptableObject 定义完整（色板/字体/间距/圆角/装饰）
- [ ] 「基准水墨主题」资产存在（墨色主、朱砂点缀、米黄底）
- [ ] `ThemeManager.ApplyTheme()` 可调用，广播变更事件
- [ ] `ThemedComponent` 子类订阅主题变更自动刷新
- [ ] 运行时修改 token 资产，UI 实时刷新

## i18n 国际化
- [ ] `StringTable` ScriptableObject 定义，按命名空间分组
- [ ] 中文字符串表覆盖本里程碑所有 UI 文案
- [ ] `I18n.Get(key)` 正确返回中文文案
- [ ] `LocalizedText` 组件绑定 key 自动刷新
- [ ] 所有 UI 文本通过 key 引用，无硬编码中文

## AudioManager
- [ ] `AudioManager` 单例存在，BGM + SFX 双通道
- [ ] `PlayBgm` 带淡入淡出，`PlaySfx` 即时播放
- [ ] 三通道音量控制（主/BGM/SFX）实时生效
- [ ] 占位 BGM 与 SFX clip 存在
- [ ] 音量设置持久化

## 占位资源管理
- [ ] `PlaceholderAssetLoader` 按 id 加载，无硬编码路径
- [ ] 占位 Sprite 齐全（背景/图标/卡片/头像/五行/小地图）
- [ ] 占位资产有水印标识
- [ ] 资产替换流程文档化，替换无需改代码

## 端到端流程
- [ ] 完整跳转链跑通：Boot→主菜单→朝代选择→HUD→设置→返回
- [ ] 所有屏幕过渡动画一致
- [ ] 运行时主题切换全屏刷新
- [ ] 语言切换调用不报错
- [ ] 音量调整跨屏幕生效并持久化
- [ ] 占位资产呈现统一水墨风格
- [ ] README.md 更新（简介/运行/目录/后续路线图）
