using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class DeveloperDelayRiskDtocs
    {
        public string? DeveloperName { get; set; }
        public int OpenTasksCount { get; set; }
        public double AvGDelayDays { get; set; }
        public DateTime? NearestDueDate { get; set; }
        public DateTime? LatestDueDate { get; set; }
        public DateTime? PredictedCompletionDate { get; set; }
        public int HighRiskFlag { get; set; }
    }
}
