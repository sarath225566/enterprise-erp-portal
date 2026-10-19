namespace practiseApi.Dtos
{
    public class InventoryAnalyticsDto
    {
        public int TotalItemsCount { get; set; }
        public int LowStockCount { get; set; }
        public int OutOfStockCount { get; set; }
        public decimal TotalStockValue { get; set; }
        public List<CategoryStockDto> CategoryBreakdown { get; set; } = new();
        public List<WarehouseUtilizationDto> WarehouseCapacities { get; set; } = new();
        public List<TopMovingItemDto> ItemTurnoverList { get; set; } = new();
    }

    public class CategoryStockDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int ItemCount { get; set; }
        public decimal TotalValue { get; set; }
        public int Percentage { get; set; }
    }

    public class WarehouseUtilizationDto
    {
        public string WarehouseName { get; set; } = string.Empty;
        public int TotalCapacity { get; set; }
        public int UsedCapacity { get; set; }
        public int UtilizationPercentage { get; set; }
    }

    public class TopMovingItemDto
    {
        public string Sku { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int CurrentStock { get; set; }
        public int ReorderLevel { get; set; }
        public string MovementSpeed { get; set; } = string.Empty; // Fast, Medium, Slow
        public string Status { get; set; } = string.Empty; // Optimal, Low, Critical
    }
}
