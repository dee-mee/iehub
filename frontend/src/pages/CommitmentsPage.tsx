import { PageHeader } from '@/components/ui/PageHeader'

export function CommitmentsPage() {
  const commitments = [
    { country: "Kenya", commitment: "Increase budget for special needs education by 10% by 2027.", status: "In Progress", color: "bg-blue-500" },
    { country: "Tanzania", commitment: "Establish 5 new inclusive teacher training centers.", status: "Achieved", color: "bg-green-500" },
    { country: "Uganda", commitment: "Implement UDL in all primary schools by 2030.", status: "Ongoing", color: "bg-orange-500" },
    { country: "Somalia", commitment: "Ratify the AU Protocol on Disability by 2026.", status: "Pending", color: "bg-gray-400" },
  ]

  return (
    <>
      <PageHeader 
        title="Global Commitments Tracker" 
        description="Monitoring the implementation of educational commitments from the Global Disability Summit across Africa."
      />
      <div className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {commitments.map((item, i) => (
            <div key={i} className="flex flex-col md:flex-row border-2 border-[#2d2d2d] bg-white overflow-hidden transition-all hover:shadow-[4px_4px_0_#2d2d2d]">
              <div className={`w-full md:w-48 p-6 flex flex-col justify-center items-center text-white font-bold ${item.color}`}>
                <span className="text-sm uppercase tracking-wider mb-1">Country</span>
                <span className="text-xl">{item.country}</span>
              </div>
              <div className="flex-1 p-6 border-t-2 md:border-t-0 md:border-l-2 border-[#2d2d2d]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 border-2 border-[#2d2d2d] bg-gray-50">
                    Status: {item.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-ink leading-tight">
                  {item.commitment}
                </p>
                <button className="mt-4 text-sm font-bold text-primary-600 hover:underline">
                  View Full Policy Brief →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-8 border-2 border-[#2d2d2d] bg-blue-50">
          <h3 className="text-lg font-bold mb-4">About the Regional Tracker</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            This tracker evaluates how African countries implement their specific educational commitments from the Global Disability Summit. 
            We focus on historical tracking from past summits co-hosted by Kenya/UK, Norway/Ghana, and Berlin/Jordan.
          </p>
        </div>
      </div>
    </>
  )
}
