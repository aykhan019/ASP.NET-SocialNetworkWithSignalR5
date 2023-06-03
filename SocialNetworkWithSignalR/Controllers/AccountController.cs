using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SocialNetworkWithSignalR.Entities;
using SocialNetworkWithSignalR.Helpers;
using SocialNetworkWithSignalR.Models;
using System.Data;

namespace SocialNetworkWithSignalR.Controllers
{
    public class AccountController : Controller
    {
        private UserManager<CustomIdentityUser> _userManager;
        private RoleManager<CustomIdentityRole> _roleManager;
        private SignInManager<CustomIdentityUser> _signInManager;
        private readonly IWebHostEnvironment _webhost;

        public AccountController(UserManager<CustomIdentityUser> userManager,
            RoleManager<CustomIdentityRole> roleManager,
            SignInManager<CustomIdentityUser> signInManager,
            IWebHostEnvironment webhost)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _webhost = webhost;
        }

        // GET: AccountController
        public ActionResult Register()
        {
            return View();
        }

    

        [Authorize(Roles = "Admin")]
        public ActionResult RegisterEditor()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var helper = new ImageHelper(_webhost);
                model.ImageUrl = await helper.SaveFile(model.File);
                CustomIdentityUser user = new CustomIdentityUser
                {
                    UserName = model.Username,
                    Email = model.Email,
                    ImageUrl = model.ImageUrl,
                };
                IdentityResult result = _userManager.CreateAsync(user, model.Password).Result;

                if (result.Succeeded)
                {
                    if (!_roleManager.RoleExistsAsync("Admin").Result)
                    {
                        CustomIdentityRole role = new CustomIdentityRole
                        {
                            Name = "Admin"
                        };

                        IdentityResult roleResult = _roleManager.CreateAsync(role).Result;
                        if (!roleResult.Succeeded)
                        {
                            ModelState.AddModelError("", "We can not add the role");
                            return View(model);
                        }
                    }

                    _userManager.AddToRoleAsync(user, "Admin").Wait();
                    return RedirectToAction("Login", "Account");
                }
            }
            return View(model);
        }

        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false).Result;
                if (result.Succeeded)
                {
                    return RedirectToAction("Index", "Home");
                }
                ModelState.AddModelError("", "Invalid Login");
            }
            return View(model);
        }


        public IActionResult LogOut()
        {
            _signInManager.SignOutAsync().Wait();
            return RedirectToAction("Login", "Account");
        }
    }
}
