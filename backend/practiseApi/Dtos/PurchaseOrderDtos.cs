namespace practiseApi.Dtos
{
    public class PurchaseOrderCreateDto
    {
        public string VendorName { get; set; } = string.Empty;
        public DateTime ExpectedDeliveryDate { get; set; }
        public string? Notes { get; set; }
        public List<PurchaseOrderItemDto> Items { get; set; } = new();
    }

    public class PurchaseOrderItemDto
    {
        public string ItemSku { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TaxPercent { get; set; }
    }
}
