# 金字塔建仓计算器

浏览器内使用的下跌 / 上涨金字塔资金与目标价试算，逻辑与仓库内 [`calculate_pyramid.py`](calculate_pyramid.py) 一致。

## 本地预览

在仓库根目录双击打开 `index.html`，或使用本地静态服务器打开同一目录。

## 部署到 GitHub Pages

目标仓库: [LayneHsu/calculate_pyramid](https://github.com/LayneHsu/calculate_pyramid)

1. 将本仓库推送到 GitHub 默认分支 **`main`**，保证根目录包含 `index.html`、`app.js`、`styles.css`。
2. 在 GitHub 打开该仓库 → **Settings** → **Pages**。
3. **Source** 选择 **Deploy from a branch**；**Branch** 选 `main`，文件夹选 **`/ (root)`**。
4. 保存后等待约 1～2 分钟，站点地址为: **https://laynehsu.github.io/calculate_pyramid/**

首次推送示例（若本地尚未关联远程）:

```bash
git init
git add .
git commit -m "Add static pyramid calculator for GitHub Pages"
git branch -M main
git remote add origin https://github.com/LayneHsu/calculate_pyramid.git
git push -u origin main
```

## 说明

计算均在用户浏览器中完成，不会上传任何数据到服务器。
