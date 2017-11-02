using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Generic;
using WorldOfWords.Domain.Services.IServices;

namespace WorldofWords.Hubs
{
    [HubName("ticketNotification")]
    [TicketHubAuthorization]
    public class TicketNotificationHub : Hub
    {
        private IUserService _userService;
        public TicketNotificationHub(IUserService userService)
        {
            _userService = userService;
        }

        public override System.Threading.Tasks.Task OnConnected()
        {

            // I get all user's courses on connection and create groups by courses names

            int userId = int.Parse(Context.QueryString.Get("id"));
            IEnumerable<string> userCourses = _userService.GetCoursesNamesByUserId(userId);
            foreach(string course in userCourses)
            {
                Groups.Add(Context.ConnectionId, course);
            }

            var roles = Context.QueryString.Get("role");
            if (roles.Contains("Admin"))
            {
                Groups.Add(Context.ConnectionId, "Admins");

                if(roles.Contains("Student") )
                {
                    Groups.Add(Context.ConnectionId, "Students");
                    Clients.Caller.updateUnreadTicketCounterForUser();
                }
                if(roles.Contains("Teacher"))
                {
                    Clients.Caller.updateUnreadTicketCounterForUser();
                }
                return Clients.Caller.updateUnreadTicketCounterForAdmin();
            }
            return Clients.Caller.updateUnreadTicketCounterForUser();
        }

        public void RemoveFromGroups()
        {
            int userId = int.Parse(Context.QueryString.Get("id"));
            IEnumerable<string> userCourses = _userService.GetCoursesNamesByUserId(userId);
            foreach (string course in userCourses)
            {
                Groups.Remove(Context.ConnectionId, course);
            }
        }
        // TODO : Fix OnDisconnect(bool) else-part logic when some load balanser will be used 
        // Ex: https://github.com/SignalR/SignalR/blob/2.1.0/src/Microsoft.AspNet.SignalR.Core/Hubs/HubBase.cs#L50

        // stopCalled: 
        // true, if stop was called on the client closing the connection gracefully;
        // false, if the client timed out. Timeouts can be caused by clients reconnecting to another SignalR server in scaleout.

        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            
            RemoveFromGroups();
            
            return base.OnDisconnected(stopCalled);
        }

        public void NotifyAboutChangeTicketState(string ownerId, string subject, string reviewStatus)
        {
            UpdateTicketTable(ownerId);
            UpdateUnreadTicketCounterForUser(ownerId);
            UpdateUnreadTicketCounterForAdmin();
            Clients.User(ownerId).notifyAboutChangeTicketState(subject, reviewStatus);
        }

        public void UpdateTicketTable(string ownerId)
        {
            Clients.User(ownerId).updateTicketTable();
            Clients.Group("Admins").updateTicketTable();
        }

        public void NotifyAdminsAboutNewTicket(string subject, string ownerId)
        {
            UpdateTicketTable(ownerId);
            UpdateUnreadTicketCounterForAdmin();
            Clients.Group("Admins").notifyAboutNewTicket(subject);
        }

        public void NotifyAboutSharedWordSuites(string[] teachersToShareId)
        {
            foreach (var id in teachersToShareId)
            {
                Clients.User(id).notifyAboutSharedWordSuites();
            }
        }

        public void UpdateUnreadTicketCounterForAdmin()
        {
             Clients.Group("Admins").updateUnreadTicketCounterForAdmin();
        }

        public void UpdateUnreadTicketCounterForUser(string ownerId)
        {
             Clients.User(ownerId).updateUnreadTicketCounterForUser();
        }

        public void NotifyAboutCourseChange(string courseName)
        {
            Clients.Group(courseName).notifyAboutCourseChange(courseName);
        }
    }
}