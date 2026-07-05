# 九州 · UI 与艺术风格基础 Spec（里程碑一）

> 工作标题《九州》为暂定名，可在后续里程碑调整。
> 本 spec 对应长线项目的第一块里程碑：**艺术风格 + UI 原型**。

## Why

《九州》是一款类文明 6 的中国风经营策略游戏，长线制作。在动工写任何玩法代码之前，必须先确立**视觉方向**与 **UI 框架地基**——否则后续所有玩法系统（地图、城市、战斗、科技树）都会因为缺少统一的屏幕体系与美术规范而各自为政、反复返工。

本里程碑交付一个可在 Unity 编辑器中运行、屏幕可互相跳转、风格统一的 UI 原型，使用占位资源验证布局、交互与艺术方向，为后续所有里程碑奠定基础。

## What Changes

- **新建** Unity 2022 LTS+ 项目，建立标准目录结构与场景管理架构
- **新增** 屏幕管理系统（`UIScreen` 基类 + `ScreenManager` 栈式管理），支持屏幕压栈/出栈/切换与过渡动画
- **新增** 4 个核心 UI 屏幕：主菜单、朝代选择、设置/存档、游戏内 HUD
- **新增** 跨朝代水墨风格的设计规范（Design Tokens：色板、字体、间距、装饰元素），以可配置资产形式存在
- **新增** 占位资源管理系统，便于后续用真实美术资产平滑替换
- **新增** `AudioManager` 骨架（BGM / SFX 双通道），设置界面的音量滑条接入
- **新增** 国际化架构（字符串表），中文优先、预留多语言切换
- **预留** 前向 UI 接口：资源面板的五行属性位、城市面板的风水修饰位（仅占位，不实现机制）

## Impact

- **Affected specs**: 无（项目首份 spec，是后续所有 spec 的前置依赖）
- **Affected code**:
  - `Assets/Scripts/Core/` — 项目基础设施（场景管理、单例、配置加载）
  - `Assets/Scripts/UI/` — 屏幕系统、各 UI 屏幕、UI 组件库
  - `Assets/Scripts/Audio/` — AudioManager
  - `Assets/Scripts/i18n/` — 本地化系统
  - `Assets/Art/Placeholders/` — 占位美术资产
  - `Assets/Resources/DesignTokens/` — 设计规范配置资产
  - `Assets/Scenes/` — Boot / MainMenu / DynastySelect / GameHUD 等场景

## ADDED Requirements

### Requirement: Unity 项目骨架

项目 SHALL 以 Unity 2022 LTS 或更新版本创建，采用清晰的目录结构分离脚本、美术、预制体、场景与配置。

#### Scenario: 项目结构标准化
- **WHEN** 开发者打开 Unity 项目
- **THEN** 看到 `Assets/Scripts/{Core,UI,Audio,i18n,Data}`、`Assets/Art/{Placeholders,Icons,Backgrounds}`、`Assets/Prefabs/UI/`、`Assets/Resources/DesignTokens/`、`Assets/Scenes/` 等标准目录
- **AND** 每个目录下有 README 或 asmdef 说明用途

#### Scenario: 场景管理
- **WHEN** 项目启动
- **THEN** 从 Boot 场景进入，Boot 负责初始化全局服务（ScreenManager、AudioManager、i18n）
- **AND** 之后所有屏幕切换通过 `ScreenManager` 加载，不直接 `SceneManager.LoadScene` 调用业务场景

### Requirement: 屏幕管理系统

系统 SHALL 提供统一的屏幕栈管理，支持主菜单、朝代选择、设置、HUD 等屏幕的压栈、出栈、切换与过渡动画。

#### Scenario: 屏幕切换
- **WHEN** 调用 `ScreenManager.Push<T>()` 或 `ScreenManager.Switch<T>()`
- **THEN** 新屏幕加载并播放入场过渡动画
- **AND** 旧屏幕（若压栈）保留在栈中或（若切换）卸载

#### Scenario: 返回上一屏
- **WHEN** 玩家在子屏幕（如设置）点击返回
- **THEN** `ScreenManager.Pop()` 出栈当前屏幕，回到上一屏幕
- **AND** 过渡动画平滑无闪烁

#### Scenario: 屏幕基类契约
- **WHEN** 新建一个屏幕
- **THEN** 该屏幕继承 `UIScreen`，实现 `OnEnter` / `OnExit` / `OnPause` / `OnResume` 生命周期回调
- **AND** 可声明是否独占输入、是否缓存实例

### Requirement: 主菜单屏幕

主菜单 SHALL 作为玩家第一印象，展示游戏标题、背景占位图与主要入口按钮。

#### Scenario: 主菜单展示
- **WHEN** 玩家从 Boot 进入主菜单
- **THEN** 看到居中的游戏标题（暂定《九州》）、水墨风格背景占位图
- **AND** 看到按钮：开始游戏、继续游戏、设置、退出
- **AND** 背景有缓慢的视差/呼吸动画占位

#### Scenario: 按钮跳转
- **WHEN** 点击「开始游戏」
- **THEN** 跳转到朝代选择屏幕
- **WHEN** 点击「设置」
- **THEN** 将设置屏幕压栈（主菜单保留在底层）
- **WHEN** 点击「退出」
- **THEN** 弹出确认对话框，确认后退出应用（编辑器内模拟退出）

### Requirement: 朝代选择屏幕

朝代选择屏幕 SHALL 展示可选朝代势力列表（占位数据），并显示选中朝代的简介与特色。

#### Scenario: 朝代列表展示
- **WHEN** 进入朝代选择屏幕
- **THEN** 看到至少 4 个占位朝代卡片（如周、秦、唐、宋），以横向/网格排列
- **AND** 每张卡片显示朝代名、领袖名占位、特色图标占位

#### Scenario: 朝代详情
- **WHEN** 选中某张朝代卡片
- **THEN** 右侧/下方面板展示该朝代的简介文本占位、起始加成占位、特色单位/奇观占位
- **AND** 卡片有选中态视觉反馈（高亮边框/水墨晕染）

#### Scenario: 确认进入游戏
- **WHEN** 点击「开始」按钮
- **THEN** 跳转到游戏内 HUD 屏幕（本里程碑不实际生成地图，仅进入 HUD 占位）

### Requirement: 设置/存档屏幕

设置屏幕 SHALL 提供音量、画质、语言等选项，并存档/读档入口（占位）。

#### Scenario: 设置项展示
- **WHEN** 打开设置屏幕
- **THEN** 看到分组：音频（主音量/BGM/SFX 滑条）、画面（分辨率下拉、全屏切换、画质下拉）、语言（下拉，本里程碑仅中文可选）、游戏（自动存档开关占位）
- **AND** 所有设置项变更即时生效（音量滑条实时影响 AudioManager）

#### Scenario: 设置持久化
- **WHEN** 玩家修改设置并关闭屏幕
- **THEN** 设置通过 `PlayerPrefs` 或 JSON 文件持久化
- **AND** 下次启动时自动加载

#### Scenario: 存档/读档占位
- **WHEN** 进入存档子页
- **THEN** 看到 3 个存档槽位（占位，显示「空」或「占位存档」），含保存/读取/删除按钮
- **AND** 按钮点击仅弹出占位提示（不实际序列化游戏状态）

### Requirement: 游戏内 HUD 屏幕

游戏内 HUD SHALL 展示回合数、资源条、小地图占位、信息面板，为后续玩法系统预留接口。

#### Scenario: HUD 默认布局
- **WHEN** 进入游戏内 HUD
- **THEN** 看到顶部资源条（金钱、粮食、产能、科技、文化 5 个占位图标 + 数值）
- **AND** 看到顶部右侧回合数显示（如「回合 1 / 300」）
- **AND** 看到右下角小地图占位框
- **AND** 看到左下角当前选中信息面板占位
- **AND** 看到右下角回合结束按钮

#### Scenario: 五行属性前向接口
- **WHEN** 查看资源条
- **THEN** 资源条预留「五行」展示区（金木水火土 5 个图标位，本里程碑显示占位图标与「—」数值）
- **AND** 该区域有独立 UI 组件 `FiveElementsBar`，便于后续机制接入

#### Scenario: 城市面板前向接口
- **WHEN** 点击占位的「城市」按钮
- **THEN** 弹出城市面板占位，包含名称、人口、产出列表
- **AND** 面板预留「风水」修饰区占位（显示「风水：—」），有独立组件 `FengShuiPanel` 供后续接入

### Requirement: 跨朝代水墨设计规范

项目 SHALL 以可配置 Design Tokens 形式定义跨朝代水墨风格的设计规范，便于统一调整与后续朝代演进。

#### Scenario: Design Tokens 可配置
- **WHEN** 美术/设计调整风格
- **THEN** 修改 `Assets/Resources/DesignTokens/` 下的配置资产（色板、字体、间距、圆角、装饰元素）
- **AND** 所有 UI 组件自动应用新值，无需改代码

#### Scenario: 朝代主题切换预留
- **WHEN** 后续里程碑需要按游戏阶段切换视觉主题（上古→中古→近世）
- **THEN** Design Tokens 系统支持多套主题配置，本里程碑先实现「基准水墨主题」一套
- **AND** 主题切换接口 `ThemeManager.ApplyTheme(tokenSet)` 已定义并可调用

### Requirement: 占位资源管理

项目 SHALL 建立占位资源体系，所有 UI 使用的图片、图标、背景均为占位，但通过统一管线加载，便于后续替换为真实美术资产。

#### Scenario: 占位资源统一加载
- **WHEN** UI 需要某张图片
- **THEN** 通过 `PlaceholderAssetLoader` 或地址引用加载，不硬编码路径
- **AND** 占位资源有统一命名规范（如 `placeholder_<用途>_<尺寸>`）与水印标识，避免误当作成品

#### Scenario: 资源替换路径
- **WHEN** 美术交付真实资产
- **THEN** 替换 `Assets/Art/Placeholders/` 下对应文件即可，无需改代码
- **AND** 替换后 UI 自动使用新资产

### Requirement: AudioManager 骨架

项目 SHALL 提供 `AudioManager` 单例，管理 BGM 与 SFX 双通道，设置界面的音量控制接入。

#### Scenario: BGM 播放
- **WHEN** 进入主菜单
- **THEN** `AudioManager.PlayBgm(clipId)` 播放占位 BGM（可为静音 clip 占位）
- **AND** BGM 支持淡入淡出

#### Scenario: 音量控制
- **WHEN** 玩家在设置界面拖动音量滑条
- **THEN** AudioManager 的主音量/BGM/SFX 通道音量实时变化
- **AND** 数值持久化，下次启动生效

#### Scenario: SFX 占位
- **WHEN** UI 按钮点击
- **THEN** 触发 `AudioManager.PlaySfx("button_click")` 占位音效（可为静音）
- **AND** 后续替换音效资产无需改代码

### Requirement: 国际化架构

项目 SHALL 基于字符串表实现 i18n，中文优先，预留多语言切换接口。

#### Scenario: 中文文案加载
- **WHEN** 项目启动
- **THEN** 从字符串表加载中文文案，所有 UI 文本通过 key 引用（如 `i18n.Get("main_menu.start")`）
- **AND** 界面显示中文

#### Scenario: 语言切换预留
- **WHEN** 后续需要添加英文等其他语言
- **THEN** 只需新增对应语言的字符串表，无需改 UI 代码
- **AND** 设置界面的语言下拉预留切换入口（本里程碑仅中文可选，其他选项禁用并标注「敬请期待」）

## MODIFIED Requirements

无（项目首份 spec）。

## REMOVED Requirements

无。
