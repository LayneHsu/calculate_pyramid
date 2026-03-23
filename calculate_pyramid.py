# 下跌侧各档占 10 份 (总和 10); 上涨侧为同档数的倒序
_DOWN_PARTS_BY_TIERS = {
    3: (1, 3, 6),
    4: (1, 2, 3, 4),
    5: (1, 2, 2, 2, 3),
}


def _ratios_down(num_tiers):
    """返回下跌金字塔各档占比列表, 总和为 1."""
    if num_tiers not in _DOWN_PARTS_BY_TIERS:
        raise ValueError("档位数须为 3、4 或 5")
    parts = _DOWN_PARTS_BY_TIERS[num_tiers]
    s = float(sum(parts))
    return [p / s for p in parts]


def _ratios_up(num_tiers):
    """上涨侧为下跌份数倒序."""
    return list(reversed(_ratios_down(num_tiers)))


def calculate_down_pyramid(
    current_price, total_capital, price_step=0.03, num_tiers=4
):
    """
    下跌金字塔建仓 (左侧交易)
    价格越低档位资金占比越高; 档位数 3/4/5 对应 10 份比例 (与网页一致).
    """
    ratios = _ratios_down(num_tiers)
    parts = _DOWN_PARTS_BY_TIERS[num_tiers]
    parts_str = ":".join(str(x) for x in parts)
    print(f"--- 📉 下跌金字塔布局 (初始价: {current_price}, {num_tiers}档 份数 {parts_str}) ---")

    for i, ratio in enumerate(ratios):
        # 每一级价格比上一级下跌 price_step (默认 3%)
        target_price = current_price * (1 - price_step * i)
        buy_amount = total_capital * ratio
        print(
            f"第 {i + 1} 阶: 价格 {target_price:>7.2f} | 投入资金 {buy_amount:>10.2f} | 占比 {ratio * 100:>2.0f}%"
        )


def calculate_up_pyramid(
    current_price, total_capital, price_step=0.02, num_tiers=4
):
    """
    上涨金字塔加码 (右侧交易)
    价格越高档位资金占比越低; 份数为下跌倒序.
    """
    ratios = _ratios_up(num_tiers)
    parts = tuple(reversed(_DOWN_PARTS_BY_TIERS[num_tiers]))
    parts_str = ":".join(str(x) for x in parts)
    print(f"\n--- 📈 上涨金字塔加码 (初始价: {current_price}, {num_tiers}档 份数 {parts_str}) ---")

    for i, ratio in enumerate(ratios):
        # 每一级价格比上一级上涨 price_step (默认 2%)
        target_price = current_price * (1 + price_step * i)
        buy_amount = total_capital * ratio
        print(
            f"第 {i + 1} 阶: 价格 {target_price:>7.2f} | 投入资金 {buy_amount:>10.2f} | 占比 {ratio * 100:>2.0f}%"
        )


# 示例：假设你有 10 万资金，当前金价 980 元
total_money = 100_000
current_gold_price = 980

calculate_down_pyramid(current_gold_price, total_money)
calculate_up_pyramid(current_gold_price, total_money)
