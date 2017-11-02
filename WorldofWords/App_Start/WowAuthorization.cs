using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using WorldOfWords.Domain.Services.MessagesAndConsts;

namespace WorldofWords
{
    sealed public class WowAuthorization : AuthorizeAttribute
    {
        private string[] _allRoles = new string[ConstContainer.MaxRoles];
        public string[] AllRoles 
        {
            get { return _allRoles; }
            set { _allRoles = value; } 
        }

        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            IPrincipal principal = Thread.CurrentPrincipal;
            return principal != null && principal.Identity != null && principal.Identity.IsAuthenticated;
        }

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (CheckHttpContext(actionContext))
            {
                if ((Thread.CurrentPrincipal.IsInRole(Roles)) || (IsInRoles(AllRoles)))
                {
                    return;
                }

                actionContext.Response = new HttpResponseMessage(HttpStatusCode.NoContent);
                return;
            }
            actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
        }

        private static bool IsInRoles(string[] roles)
        {
            if (roles != null)
            {
                return roles.Any(role => Thread.CurrentPrincipal.IsInRole(role));
            }

            return false;
        }

        private bool CheckHttpContext(HttpActionContext actionContext)
        {
            return ((actionContext != null) 
                && (actionContext.Request.Headers.Authorization != null)
                && (actionContext.Request.Headers.Authorization.Scheme != null)) 
                && IsAuthorized(actionContext);
        }
    }
    /*sealed public class RequireHttps : AuthorizationFilterAttribute
    {
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext != null && !actionContext.Request.RequestUri.Scheme.Equals(Uri.UriSchemeHttps))
            {
                var controllerFilters = actionContext.ControllerContext.ControllerDescriptor.GetFilters();
                var actionFilters = actionContext.ActionDescriptor.GetFilters();

                if ((controllerFilters != null && controllerFilters.Select
                (t => t.GetType() == typeof(RequireHttps)).Count() > 0) ||
                    (actionFilters != null && actionFilters.Select(t =>
                    t.GetType() == typeof(RequireHttps)).Count() > 0))
                {
                    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden)
                                                {
                                                    ReasonPhrase = "HTTPS Required"
                                                };
                }
            }
        }
    }*/
}
