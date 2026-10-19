namespace practiseApi.Dtos
{
    public class MenuItemResponseDto
    {
        public string Id { get; set; } = string.Empty; // Frontend-le menu item id
        public string Label { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public bool Expanded { get; set; } = false;
        public List<MenuItemResponseDto>? Children { get; set; }
    }

    public class CreateMenuItemDto
    {
        public string MenuKey { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
        public string Icon { get; set; } = "bi bi-circle";
        public string? RouteUrl { get; set; }
        public int? ParentId { get; set; } // Sub-menu aaneel Main Menu-nte ID
        public int SortOrder { get; set; } = 0;
    }
}
