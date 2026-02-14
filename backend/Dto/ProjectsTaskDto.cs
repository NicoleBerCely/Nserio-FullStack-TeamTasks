using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class ProjectsTaskDto
    {
        public int TaskId { get; set; }
        public int ProjectId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int EstimatedComplexity { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public int AssigneeId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
