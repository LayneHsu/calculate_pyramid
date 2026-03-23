def calculate_down_pyramid(current_price, total_capital, price_step=0.03):
    """
    下跌金字塔建仓（左侧交易）
    逻辑：价格越低，买入比例越高 (1:2:3:4)
    """
    ratios = [0.1, 0.2, 0.3, 0.4]
    print(f"--- 📉 下跌金字塔布局 (初始价: {current_price}) ---")
    
    for i, ratio in enumerate(ratios):
        # 每一级价格比上一级下跌 price_step (默认3%)
        target_price = current_price * (1 - price_step * i)
        buy_amount = total_capital * ratio
        print(f"第 {i+1} 阶: 价格 {target_price:>7.2f} | 投入资金 {buy_amount:>10.2f} | 占比 {ratio*100:>2.0f}%")

def calculate_up_pyramid(current_price, total_capital, price_step=0.02):
    """
    上涨金字塔加码（右侧交易）
    逻辑：价格越高，买入比例越低 (4:3:2:1)，防止大幅拉高成本
    """
    ratios = [0.4, 0.3, 0.2, 0.1]
    print(f"\n--- 📈 上涨金字塔加码 (初始价: {current_price}) ---")
    
    for i, ratio in enumerate(ratios):
        # 每一级价格比上一级上涨 price_step (默认2%)
        target_price = current_price * (1 + price_step * i)
        buy_amount = total_capital * ratio
        print(f"第 {i+1} 阶: 价格 {target_price:>7.2f} | 投入资金 {buy_amount:>10.2f} | 占比 {ratio*100:>2.0f}%")

# 示例：假设你有 10 万资金，当前金价 980 元
total_money = 100000
current_gold_price = 980

calculate_down_pyramid(current_gold_price, total_money)
calculate_up_pyramid(current_gold_price, total_money)