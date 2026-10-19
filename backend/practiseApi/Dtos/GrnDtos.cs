namespace practiseApi.Dtos
{
    public class GrnCreateDto
    {
        public int? PurchaseOrderId { get; set; }
        public string? PoNumber { get; set; }
        public string VendorName { get; set; } = string.Empty;
        public string ChallanNumber { get; set; } = string.Empty;
        public string WarehouseLocation { get; set; } = "Main Central Depot";
        public string? Remarks { get; set; }
        public List<GrnItemInputDto> Items { get; set; } = new();
    }

    public class GrnItemInputDto
    {
        public string ItemSku { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public int OrderedQty { get; set; }
        public int ReceivedQty { get; set; }
        public int DamagedQty { get; set; }
        public string? BatchNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string StorageBinLocation { get; set; } = "General-Bin";
        public decimal UnitPrice { get; set; }
    }
}
