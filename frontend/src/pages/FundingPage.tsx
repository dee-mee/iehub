import { PageHeader } from '@/components/ui/PageHeader'

export function FundingPage() {
  const opportunities = [
    { 
      title: "Inclusive Education Innovation Grant", 
      donor: "European Union Delegation", 
      amount: "Up to €500,000",
      deadline: "July 30, 2026",
      category: "Regional"
    },
    { 
      title: "Disability-Inclusive ECD Pilot", 
      donor: "USAID / LEGO Foundation", 
      amount: "Variable",
      deadline: "August 15, 2026",
      category: "Kenya/Uganda"
    },
    { 
      title: "Teacher Training Capacity Building", 
      donor: "GIZ / German Embassy", 
      amount: "Up to $100,000",
      deadline: "Ongoing",
      category: "Tanzania"
    }
  ]

  return (
    <>
      <PageHeader 
        title="Funding & Grant Tracker" 
        description="Mapping active bilateral/multilateral funding streams and grant opportunities for inclusive education in East Africa."
      />
      <div className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {opportunities.map((opt, i) => (
              <div key={i} className="card hover:border-blue-400 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-[#2d2d2d] bg-blue-100 text-blue-700">
                    {opt.category}
                  </span>
                  <span className="text-xs font-bold text-red-600">Deadline: {opt.deadline}</span>
                </div>
                <h3 className="text-xl font-extrabold mb-2">{opt.title}</h3>
                <p className="text-sm font-semibold text-gray-500 mb-4">Source: {opt.donor}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-gray-100">
                  <span className="text-lg font-bold text-green-600">{opt.amount}</span>
                  <button className="btn-primary py-2 px-4 text-xs">View Details</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="border-2 border-[#2d2d2d] bg-gray-50 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Donor Trends</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                We are currently tracking a 15% increase in funding calls specifically targeting Early Childhood Development (ECD) and disability-inclusive climate resilience across the East African region.
              </p>
              <button className="text-xs font-bold text-blue-600 hover:underline">Download Q2 Trend Report →</button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
