using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class TaskDto
    {
        public int TaskId { get; set; }  
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int EstimatedComplexity { get; set; }
    }
}
