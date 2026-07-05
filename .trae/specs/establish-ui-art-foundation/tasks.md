# Tasks — 里程碑一：UI 与艺术风格基础

> 目标：交付一个可在 Unity 编辑器中运行、4 屏可互跳、风格统一（水墨占位）的 UI 原型。
> 所有美术资产为占位，验证布局、交互、艺术方向与前向接口。

## Task 1: 搭建 Unity 项目骨架与目录结构
- [ ] 1.1 创建 Unity 2022 LTS+ 项目，配置 ProjectSettings（公司名、产品名《九州》、默认分辨率 1920×1080）
- [ ] 1.2 建立标准目录：`Assets/Scripts/{Core,UI,Audio,i18n,Data}`、`Assets/Art/{Placeholders,Icons,Backgrounds}`、`Assets/Prefabs/UI/`、`Assets/Resources/{DesignTokens,StringTables,Placeholders}`、`Assets/Scenes/`
- [ ] 1.3 为每个 Scripts 子目录创建 asmdef（`Jiuzhou.Core`、`Jiuzhou.UI` 等），定义依赖关系
- [ ] 1.4 在每个目录放 `.gitignore`（忽略 Library/Temp/obj 等）与简短 README 说明用途
- [ ] 1.5 配置版本控制（git init + .gitignore），首次提交项目骨架

## Task 2: 全局服务基础设施与 Boot 场景
- [ ] 2.1 实现 `PersistentSingleton<T>` 泛型单例基类（DontDestroyOnLoad + 场景切换保护）
- [ ] 2.2 创建 Boot 场景，挂载 `Bootstrapper` 组件，按序初始化 i18n → ThemeManager → AudioManager → ScreenManager
- [ ] 2.3 实现 `ServiceLocator` 或简单 DI 容器，供屏幕与服务获取依赖
- [ ] 2.4 配置 Build Settings：Boot 场景为 index 0

## Task 3: 屏幕管理系统
- [ ] 3.1 定义 `UIScreen` 抽象基类：`OnEnter/OnExit/OnPause/OnResume` 生命周期，`ScreenConfig`（是否独占输入、是否缓存、过渡动画类型）
- [ ] 3.2 实现 `ScreenManager`：栈式管理，`Push<T>()`、`Pop()`、`Switch<T>()`、`Clear()`
- [ ] 3.3 实现过渡动画系统：屏幕入场/出场 Tween（淡入淡出 + 轻微位移），使用 DOTween 或自实现
- [ ] 3.4 屏幕加载支持同步与异步（Addressables 可选，本里程碑用 Resources 即可）
- [ ] 3.5 编写 ScreenManager 单元测试：栈状态正确、Pop 到空栈安全、重复 Push 同类型处理

## Task 4: Design Tokens 与 ThemeManager
- [ ] 4.1 定义 `DesignTokenSet` ScriptableObject：色板（主色/辅色/背景/文字/强调）、字体、间距、圆角、装饰元素引用
- [ ] 4.2 创建「基准水墨主题」token 资产（墨色为主、朱砂点缀、米黄底，参考宋元水墨配色）
- [ ] 4.3 实现 `ThemeManager`：`ApplyTheme(tokenSet)`，广播主题变更事件
- [ ] 4.4 实现 `ThemedComponent` 基类：订阅主题变更，自动刷新颜色/字体；提供 Image/Text/Button 的主题化子类
- [ ] 4.5 验证：运行时修改 token 资产，UI 实时刷新

## Task 5: i18n 国际化系统
- [ ] 5.1 定义 `StringTable` ScriptableObject：`Dictionary<string,string>` 键值对，按命名空间分组（`main_menu.*`、`dynasty_select.*`、`settings.*`、`hud.*`）
- [ ] 5.2 创建中文字符串表，覆盖本里程碑所有 UI 文案
- [ ] 5.3 实现 `I18n` 服务：`Get(key)`、`GetFormatted(key,args)`、`SetLanguage(langId)`、语言变更事件
- [ ] 5.4 实现 `LocalizedText` 组件：绑定 key，语言切换时自动刷新
- [ ] 5.5 设置界面的语言下拉预留英文等选项（禁用态，标注「敬请期待」）

## Task 6: AudioManager 骨架
- [ ] 6.1 实现 `AudioManager` 单例：BGM AudioSource + SFX AudioSource 池（建议 8 个）
- [ ] 6.2 实现 `PlayBgm(clipId)` 带淡入淡出、`PlaySfx(clipId)`、`StopBgm()`
- [ ] 6.3 音量控制：主音量 / BGM / SFX 三通道，`SetVolume(channel,value)`
- [ ] 6.4 占位音频资产：制作 1 个静音 BGM clip、1 个按钮点击 SFX clip（可用简单合成音）
- [ ] 6.5 音量设置持久化（与 Task 10 设置屏幕联动）

## Task 7: 占位资源管理系统
- [ ] 7.1 实现 `PlaceholderAssetLoader`：按 id 加载占位 Sprite，命名规范 `placeholder_<用途>_<尺寸>`
- [ ] 7.2 制作通用占位 Sprite：背景图（水墨纹理）、按钮图标、朝代卡片图、领袖头像、资源图标（金钱/粮食/产能/科技/文化）、五行图标（金木水火土）、小地图框
- [ ] 7.3 占位资产加统一水印标识（半透明「占位」字样），避免误用为成品
- [ ] 7.4 文档化资产替换流程：放哪个目录、命名规则、无需改代码即可生效

## Task 8: 主菜单屏幕
- [ ] 8.1 创建 `MainMenuScreen` 预制体：标题《九州》（LocalizedText）、背景 Image、4 个按钮（开始/继续/设置/退出）
- [ ] 8.2 背景呼吸/视差动画占位（缓慢缩放或轻微位移）
- [ ] 8.3 按钮点击：开始→朝代选择（Switch）、设置→设置（Push）、退出→确认对话框→退出
- [ ] 8.4 进入主菜单时调用 `AudioManager.PlayBgm("main_menu_bgm")`
- [ ] 8.5 所有按钮点击触发 `AudioManager.PlaySfx("button_click")`

## Task 9: 朝代选择屏幕
- [ ] 9.1 创建占位朝代数据：周、秦、唐、宋 4 个，含名称、领袖名占位、简介、起始加成占位、特色单位/奇观占位
- [ ] 9.2 创建 `DynastyCard` 组件：展示朝代名、领袖头像占位、特色图标，支持选中态（水墨晕染高亮）
- [ ] 9.3 创建 `DynastySelectScreen`：网格/横向排列卡片，右侧详情面板
- [ ] 9.4 选中卡片→详情面板刷新；点击「开始」→Switch 到游戏内 HUD
- [ ] 9.5 返回按钮→Pop 回主菜单

## Task 10: 设置/存档屏幕
- [ ] 10.1 创建 `SettingsScreen` 预制体，分组：音频、画面、语言、游戏
- [ ] 10.2 音频组：主音量/BGM/SFX 滑条，onChange 实时调用 AudioManager.SetVolume
- [ ] 10.3 画面组：分辨率下拉、全屏 Toggle、画质下拉（低/中/高）
- [ ] 10.4 语言组：下拉（中文可选，英文等禁用标注「敬请期待」）
- [ ] 10.5 游戏组：自动存档 Toggle 占位
- [ ] 10.6 实现 `SettingsService`：序列化到 JSON（`%userprofile%/AppData/...` 或 Application.persistentDataPath），启动加载
- [ ] 10.7 存档子页：3 个存档槽位占位（空/占位存档），保存/读取/删除按钮仅弹占位提示
- [ ] 10.8 返回按钮→Pop，应用设置变更

## Task 11: 游戏内 HUD 屏幕
- [ ] 11.1 创建 `GameHUDScreen` 预制体，布局：顶部资源条、顶部右侧回合数、右下小地图占位、左下信息面板占位、右下回合结束按钮
- [ ] 11.2 顶部资源条：金钱/粮食/产能/科技/文化 5 个图标 + 占位数值
- [ ] 11.3 实现 `FiveElementsBar` 组件：金木水火土 5 个图标位 + 「—」占位数值，作为独立可复用组件
- [ ] 11.4 实现 `FengShuiPanel` 组件：显示「风水：—」占位，作为城市面板子组件
- [ ] 11.5 城市按钮→弹出城市面板占位（名称/人口/产出列表 + FengShuiPanel）
- [ ] 11.6 回合结束按钮→占位提示（不实际推进回合）
- [ ] 11.7 菜单按钮→Push 设置屏幕（HUD 保留在底）

## Task 12: 屏幕串联与端到端流程
- [ ] 12.1 验证完整跳转链：Boot→主菜单→朝代选择→HUD→设置→返回，所有路径可达
- [ ] 12.2 过渡动画在所有屏幕间一致，无闪烁/卡顿
- [ ] 12.3 主题切换：运行时切换 token，所有屏幕实时刷新
- [ ] 12.4 语言切换骨架：即便仅中文，切换调用不报错
- [ ] 12.5 音量调整在所有屏幕生效，设置持久化跨启动

## Task 13: 占位美术资产制作（水墨风格验证）
- [ ] 13.1 主菜单背景占位（水墨山水横构图，1920×1080）
- [ ] 13.2 4 个朝代卡片背景占位（差异化色调：周/青铜、秦/玄黑、唐/青绿、宋/水墨）
- [ ] 13.3 通用 UI 装饰元素占位（边框花纹、分隔线、按钮底纹）
- [ ] 13.4 资源图标占位 5 个 + 五行图标占位 5 个
- [ ] 13.5 验证：占位资产在屏幕上呈现统一水墨风格，为后续真实美术定调

## Task 14: 端到端验证与文档
- [ ] 14.1 在 Unity 编辑器 Play 模式跑通完整流程，截图存档
- [ ] 14.2 验证 checklist.md 所有检查点
- [ ] 14.3 更新 README.md：项目简介、运行方式、目录结构、后续里程碑路线图占位
- [ ] 14.4 标记本里程碑完成，规划下一里程碑（建议：可交互六边形地图）

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 2
- Task 4、5、6、7 依赖 Task 1、2，可并行
- Task 8、9、10、11 依赖 Task 3、4、5、6、7，四个屏幕可并行开发
- Task 12 依赖 Task 8-11
- Task 13 依赖 Task 7，可与 Task 8-11 并行
- Task 14 依赖 Task 12、13
