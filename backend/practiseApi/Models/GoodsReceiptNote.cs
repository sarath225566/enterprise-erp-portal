using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace practiseApi.Models
{
    public class GoodsReceiptNote
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string GrnNumber { get; set; } = string.Empty; // e.g. GRN-2026-0001

        public int? PurchaseOrderId { get; set; }

        [ForeignKey("PurchaseOrderId")]
        public virtual PurchaseOrder? PurchaseOrder { get; set; }

        [MaxLength(50)]
        public string? PoNumber { get; set; }

        [Required]
        [MaxLength(150)]
        public string VendorName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string ChallanNumber { get; set; } = string.Empty;

        public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string WarehouseLocation { get; set; } = "Main Central Depot";

        [MaxLength(50)]
        public string ReceivedBy { get; set; } = "Store Keeper";

        [MaxLength(30)]
        public string Status { get; set; } = "Completed"; // Draft, Under Inspection, Completed, Rejected

        [MaxLength(500)]
        public string? Remarks { get; set; }

        public virtual ICollection<GoodsReceiptNoteItem> Items { get; set; } = new List<GoodsReceiptNoteItem>();
    }

    public class GoodsReceiptNoteItem
    {
        [Key]
        public int Id { get; set; }

        public int GoodsReceiptNoteId { get; set; }

        [ForeignKey("GoodsReceiptNoteId")]
        public virtual GoodsReceiptNote? GoodsReceiptNote { get; set; }

        [Required]
        [MaxLength(50)]
        public string ItemSku { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        public int OrderedQty { get; set; }

        public int ReceivedQty { get; set; }

        public int AcceptedQty { get; set; }

        public int DamagedQty { get; set; }

        [MaxLength(50)]
        public string? BatchNumber { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(50)]
        public string StorageBinLocation { get; set; } = "General-Bin";

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
    }
}
