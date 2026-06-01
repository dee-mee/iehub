import { PageHeader } from '@/components/ui/PageHeader'
import { Link } from 'react-router-dom'

export function ProgramsPage() {
  return (
    <>
      <PageHeader 
        title="Our Programmes" 
        description="Driving systemic change for inclusive education across Africa through targeted interventions and partnerships."
      />

      <div className="bg-white">
        <div className="container-page py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold text-ink">A Holistic Approach to Inclusion</h2>
              <p className="text-lg text-muted leading-relaxed">
                The Inclusive Education Hub (IE Hub) Africa implements evidence-based programmes 
                designed to address the complex barriers facing learners with disabilities. 
                Our work spans from grassroots community level to national policy reform.
              </p>
              <div className="pt-4">
                <Link to="/register" className="btn-primary">
                  Join our Community of Practice
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
               <img 
                 src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800" 
                 alt="Students in a classroom"
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        </div>

        <section className="bg-slate-50 py-20 border-y-2 border-slate-900">
          <div className="container-page">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Program 1 */}
              <div id="early-childhood" className="bg-white p-8 border-2 border-slate-900 shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-12 h-12 bg-pink text-white flex items-center justify-center text-2xl font-bold mb-6 border-2 border-slate-900">1</div>
                <h3 className="text-xl font-bold text-ink mb-4">ECDE & Early Intervention</h3>
                <p className="text-muted mb-6">
                  Identifying and supporting learners with disabilities from the earliest possible age. 
                  We focus on training caregivers and improving accessibility in pre-primary centers.
                </p>
              </div>

              {/* Program 2 */}
              <div id="teacher-training" className="bg-white p-8 border-2 border-slate-900 shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-12 h-12 bg-green text-white flex items-center justify-center text-2xl font-bold mb-6 border-2 border-slate-900">2</div>
                <h3 className="text-xl font-bold text-ink mb-4">Teacher Capacity Building</h3>
                <p className="text-muted mb-6">
                  Equipping educators with the pedagogical skills, curriculum adaptation techniques, 
                  and inclusive classroom management strategies needed for success.
                </p>
              </div>

              {/* Program 3 */}
              <div id="policy-reform" className="bg-white p-8 border-2 border-slate-900 shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-12 h-12 bg-purple text-white flex items-center justify-center text-2xl font-bold mb-6 border-2 border-slate-900">3</div>
                <h3 className="text-xl font-bold text-ink mb-4">Policy Advocacy & Reform</h3>
                <p className="text-muted mb-6">
                  Working with governments and regional bodies to integrate inclusive education 
                  principles into national budgets, legislation, and education sector plans.
                </p>
              </div>

              {/* Program 4 */}
              <div id="community" className="bg-white p-8 border-2 border-slate-900 shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-12 h-12 bg-blue text-white flex items-center justify-center text-2xl font-bold mb-6 border-2 border-slate-900">4</div>
                <h3 className="text-xl font-bold text-ink mb-4">Community Engagement</h3>
                <p className="text-muted mb-6">
                  Sensitizing parents, local leaders, and community members to challenge stigma 
                  and promote the rights of children with disabilities to receive a quality education.
                </p>
              </div>

              {/* Program 5 */}
              <div id="technology" className="bg-white p-8 border-2 border-slate-900 shadow-[8px_8px_0_#1e293b] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center text-2xl font-bold mb-6 border-2 border-slate-900">5</div>
                <h3 className="text-xl font-bold text-ink mb-4">Digital Inclusion & Assistive Tech</h3>
                <p className="text-muted mb-6">
                  Leveraging low-cost technology and assistive devices to remove learning barriers 
                  and ensure all students have access to digital literacy opportunities.
                </p>
              </div>

              {/* CTA Card */}
              <div className="bg-[#1e293b] p-8 flex flex-col justify-center items-center text-center">
                <h3 className="text-xl font-bold text-white mb-4">Want to partner with us?</h3>
                <p className="text-slate-300 text-sm mb-6">
                  We are always looking for collaborators to scale our impact across the continent.
                </p>
                <Link to="/contact" className="btn-pink w-full">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 container-page text-center">
           <h2 className="text-3xl font-extrabold text-ink mb-6">Measuring Our Impact</h2>
           <p className="text-muted max-w-2xl mx-auto mb-12">
             We track our progress through rigorous data collection and storytelling, 
             ensuring our programmes remain effective and responsive to the needs of the community.
           </p>
           <div className="grid gap-8 sm:grid-cols-3">
              <div className="p-6">
                 <p className="text-5xl font-black text-green mb-2">12+</p>
                 <p className="text-sm font-bold uppercase tracking-widest text-muted">Countries Reached</p>
              </div>
              <div className="p-6">
                 <p className="text-5xl font-black text-pink mb-2">5,400</p>
                 <p className="text-sm font-bold uppercase tracking-widest text-muted">Teachers Trained</p>
              </div>
              <div className="p-6">
                 <p className="text-5xl font-black text-purple mb-2">250k+</p>
                 <p className="text-sm font-bold uppercase tracking-widest text-muted">Learners Impacted</p>
              </div>
           </div>
        </section>
      </div>
    </>
  )
}
