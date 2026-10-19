namespace practiseApi.Dtos
{
    public class ExecutiveDashboardDto
    {
        public decimal TotalStockValuation { get; set; }
        public decimal TotalAccountsPayable { get; set; }
        public int OpenPurchaseOrders { get; set; }
        public int LowStockAlertsCount { get; set; }
        public List<MonthlySpendDto> MonthlyTrends { get; set; } = new();
        public List<RecentActivityDto> RecentTransactions { get; set; } = new();
    }

    public class MonthlySpendDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class RecentActivityDto
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string TimeAgo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
