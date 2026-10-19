using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace practiseApi.Models
{
    public class MenuItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string MenuKey { get; set; } = string.Empty; // e.g. 'purchase-requisition'

        [Required]
        [MaxLength(150)]
        public string Label { get; set; } = string.Empty; // e.g. 'Purchase Requisition (PR)'

        [MaxLength(100)]
        public string Icon { get; set; } = "bi bi-circle"; // e.g. 'bi bi-file-earmark-text'

        public string? RouteUrl { get; set; }

        public int? ParentId { get; set; } // Null aaneel Main Menu, allenkil Parent-inte Id

        [ForeignKey("ParentId")]
        public virtual MenuItem? Parent { get; set; }

        public virtual ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();

        public int SortOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
