using Microsoft.AspNetCore.Mvc;
using practiseApi.Dtos;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet("executive-overview")]
        public IActionResult GetExecutiveOverview()
        {
            // Initial data mockup (ithu database queries vechu dynamic aakkaam)
            var data = new ExecutiveDashboardDto
            {
                TotalStockValuation = 1845200.00m,
                TotalAccountsPayable = 342150.00m,
                OpenPurchaseOrders = 12,
                LowStockAlertsCount = 7,
                MonthlyTrends = new List<MonthlySpendDto>
                {
                    new() { Month = "Jun", Amount = 120000 },
                    new() { Month = "Jul", Amount = 145000 },
                    new() { Month = "Aug", Amount = 190000 },
                    new() { Month = "Sep", Amount = 160000 },
                    new() { Month = "Oct", Amount = 210000 }
                },
                RecentTransactions = new List<RecentActivityDto>
                {
                    new() { Title = "PO-2026-089 Issued to ABC Pharma", Type = "Procurement", TimeAgo = "10 mins ago", Status = "Approved" },
                    new() { Title = "GRN-1044 Inward Stock Received", Type = "Inventory", TimeAgo = "45 mins ago", Status = "Received" },
                    new() { Title = "Vendor Payment Scheduled (₹75,000)", Type = "Finance", TimeAgo = "2 hours ago", Status = "Pending" },
                    new() { Title = "Stock Reconciliation Discrepancy Flagged", Type = "Audit", TimeAgo = "5 hours ago", Status = "Review" }
                }
            };

            return Ok(data);
        }
        [HttpGet("inventory-analytics")]
        public IActionResult GetInventoryAnalytics()
        {
            var data = new InventoryAnalyticsDto
            {
                TotalItemsCount = 1240,
                LowStockCount = 18,
                OutOfStockCount = 4,
                TotalStockValue = 3450000.00m,
                CategoryBreakdown = new List<CategoryStockDto>
        {
            new() { CategoryName = "Raw Materials", ItemCount = 420, TotalValue = 1450000, Percentage = 42 },
            new() { CategoryName = "Finished Goods", ItemCount = 510, TotalValue = 1350000, Percentage = 39 },
            new() { CategoryName = "Packaging Supplies", ItemCount = 210, TotalValue = 450000, Percentage = 13 },
            new() { CategoryName = "Spare Parts & Tools", ItemCount = 100, TotalValue = 200000, Percentage = 6 }
        },
                WarehouseCapacities = new List<WarehouseUtilizationDto>
        {
            new() { WarehouseName = "Main Central Depot (Kochi)", TotalCapacity = 10000, UsedCapacity = 8200, UtilizationPercentage = 82 },
            new() { WarehouseName = "Regional Warehouse A (Kollam)", TotalCapacity = 5000, UsedCapacity = 3200, UtilizationPercentage = 64 },
            new() { WarehouseName = "Buffer Storage Facility", TotalCapacity = 3000, UsedCapacity = 1100, UtilizationPercentage = 36 }
        },
                ItemTurnoverList = new List<TopMovingItemDto>
        {
            new() { Sku = "SKU-9901", ItemName = "Hydraulic Seal Kit 40mm", Category = "Spare Parts", CurrentStock = 12, ReorderLevel = 25, MovementSpeed = "Fast", Status = "Critical" },
            new() { Sku = "SKU-4412", ItemName = "HDPE Corrugated Sheets", Category = "Packaging", CurrentStock = 45, ReorderLevel = 50, MovementSpeed = "Fast", Status = "Low" },
            new() { Sku = "SKU-1088", ItemName = "Industrial Grade Solvent 5L", Category = "Raw Materials", CurrentStock = 240, ReorderLevel = 80, MovementSpeed = "Medium", Status = "Optimal" },
            new() { Sku = "SKU-7731", ItemName = "Aluminum Heat Sink Bar", Category = "Raw Materials", CurrentStock = 510, ReorderLevel = 100, MovementSpeed = "Slow", Status = "Optimal" },
            new() { Sku = "SKU-2090", ItemName = "Thermal Paste 50g", Category = "Consumables", CurrentStock = 0, ReorderLevel = 30, MovementSpeed = "Fast", Status = "Out of Stock" }
        }
            };

            return Ok(data);
        }
    }
}
