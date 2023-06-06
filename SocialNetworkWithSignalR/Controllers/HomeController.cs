using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialNetworkWithSignalR.Entities;
using SocialNetworkWithSignalR.Models;
using System.Diagnostics;

namespace SocialNetworkWithSignalR.Controllers
{
    [Authorize(Roles ="Admin")]
    public class HomeController : Controller
    {
        private UserManager<CustomIdentityUser> _userManager;
        private  IHttpContextAccessor httpContextAccessor;
        private CustomIdentityDbContext _dbContext;

        public HomeController(UserManager<CustomIdentityUser> userManager,
            IHttpContextAccessor httpContextAccessor,
            CustomIdentityDbContext dbContext)
        {
            _userManager = userManager;
            this.httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        public async Task<IActionResult> Index()
        {
            var user=await _userManager.GetUserAsync(HttpContext.User);
            ViewBag.User = user;
            return View();
        }

        public async Task<IActionResult> GetAllUsers()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var users = _dbContext.Users.Where(u=>u.Id!=user.Id).OrderByDescending(x => x.IsOnline);
            return Ok(users);
        }
      
    }
}