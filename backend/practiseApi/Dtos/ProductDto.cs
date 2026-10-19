using System.ComponentModel.DataAnnotations;

namespace practiseApi.Dtos
{
    public class ProductDto
    {
        [Required(ErrorMessage = "Product Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; } = string.Empty;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Stock quantity is required")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public int StockQuantity { get; set; }

        // Optional / Default value ഉള്ള Stock Management fields
        public string SKU { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal PurchasePrice { get; set; } = 0;
        public int ReorderLevel { get; set; } = 10;
        public string UnitOfMeasure { get; set; } = "Pcs";
        public bool IsActive { get; set; } = true;
    }
}
