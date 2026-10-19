using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using practiseApi.Data;
using practiseApi.Dtos;
using practiseApi.Models;

namespace practiseApi.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MenusController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: Frontend Sidebar-ലേക്ക് Tree Structure ആയി മെനുകൾ എടുക്കാൻ
        [HttpGet("sidebar-menus")]
        public async Task<IActionResult> GetSidebarMenus()
        {
            var allMenus = await _context.MenuItems
                .AsNoTracking()
                .Where(m => m.IsActive)
                .OrderBy(m => m.SortOrder)
                .ToListAsync();

            // Main Menus (ParentId == null)
            var parentMenus = allMenus.Where(m => m.ParentId == null).ToList();

            var result = parentMenus.Select(parent => new MenuItemResponseDto
            {
                Id = parent.MenuKey,
                Label = parent.Label,
                Icon = parent.Icon,
                Expanded = false,
                Children = allMenus
                    .Where(child => child.ParentId == parent.Id)
                    .OrderBy(c => c.SortOrder)
                    .Select(child => new MenuItemResponseDto
                    {
                        Id = child.MenuKey,
                        Label = child.Label,
                        Icon = child.Icon,
                        Expanded = false,
                        Children = null
                    }).ToList()
            }).ToList();

            // Children onnum illatha Main Menu aanenkil children array null aakkunnu
            foreach (var item in result)
            {
                if (item.Children != null && item.Children.Count == 0)
                {
                    item.Children = null;
                }
            }

            return Ok(result);
        }

        // 2. POST: Admin-ന് പുതിയ Menu / Sub-menu ചേർക്കാൻ
        [HttpPost]
        public async Task<IActionResult> CreateMenu([FromBody] CreateMenuItemDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var menuItem = new MenuItem
            {
                MenuKey = dto.MenuKey,
                Label = dto.Label,
                Icon = dto.Icon,
                RouteUrl = dto.RouteUrl,
                ParentId = dto.ParentId,
                SortOrder = dto.SortOrder,
                IsActive = true
            };

            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Menu created successfully", id = menuItem.Id });
        }
    }
}
