using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dto
{
    public class DeveloperWorkloadDto
    {
        public string? DeveloperName { get; set; }
        public int OpenTasksCount { get; set; }
        public decimal AverageEstimatedComplexity  { get; set; }
    }
}
