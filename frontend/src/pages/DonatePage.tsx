import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/ui/PageHeader'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export function DonatePage() {
  const { t } = useTranslation()
  const [step, setStep] = useState<'amount' | 'payment' | 'success'>('amount')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '20',
    currency: 'USD',
    isAnonymous: false,
  })

  const submitDonationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Simulate API call to backend and payment gateway
      const response = await fetch(`${API_BASE_URL}/donations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          amount: parseFloat(data.amount),
          currency: data.currency,
          is_anonymous: data.isAnonymous,
          transaction_reference: `SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        })
      })
      if (!response.ok) throw new Error('Failed to record donation')
      return response.json()
    },
    onSuccess: () => {
      setStep('success')
    }
  })

  const handleAmountSelect = (val: string) => {
    setFormData(prev => ({ ...prev, amount: val }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  return (
    <>
      <PageHeader 
        title={t('nav.donate')} 
        description="Your contribution supports inclusive education practitioners and communities across Africa." 
      />

      <div className="container-page py-12">
        <div className="max-w-2xl mx-auto">
          {step === 'amount' && (
            <div className="card space-y-8 p-8">
              <div>
                <h2 className="text-xl font-bold text-ink mb-4">Choose an amount</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['10', '20', '50', '100'].map(val => (
                    <button
                      key={val}
                      onClick={() => handleAmountSelect(val)}
                      className={`py-3 rounded-lg border-2 font-bold transition-all ${
                        formData.amount === val 
                          ? 'border-primary-600 bg-primary-50 text-primary-700' 
                          : 'border-primary-100 hover:border-primary-300 text-muted'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="label">Or enter custom amount ($)</label>
                  <input 
                    type="number" 
                    name="amount"
                    className="input" 
                    placeholder="Other amount"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-ink">Your Information</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Full Name</label>
                    <input type="text" name="fullName" required className="input" value={formData.fullName} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <input type="email" name="email" required className="input" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isAnonymous"
                    className="w-5 h-5 rounded border-gray-300 text-primary-600" 
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                  />
                  <span className="text-sm text-muted">Make this an anonymous donation</span>
                </label>
              </div>

              <button 
                onClick={() => setStep('payment')}
                disabled={!formData.fullName || !formData.email || !formData.amount}
                className="btn-primary w-full py-4 text-lg"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="card p-8">
              <button onClick={() => setStep('amount')} className="text-primary-700 font-bold text-sm mb-6 flex items-center gap-1">
                ← Back to amount
              </button>
              <h2 className="text-xl font-bold text-ink mb-6">Complete Payment</h2>
              <div className="p-6 bg-primary-50 rounded-xl border border-primary-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted">Donation Amount</span>
                  <span className="font-bold text-ink text-xl">${formData.amount}</span>
                </div>
                <p className="text-xs text-muted">Secured by Flutterwave. Supporting African payment methods including Mobile Money and Cards.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => submitDonationMutation.mutate(formData)}
                  disabled={submitDonationMutation.isPending}
                  className="btn-primary w-full py-4 bg-accent-500 hover:bg-accent-600 text-ink font-bold text-lg flex items-center justify-center gap-2"
                >
                  {submitDonationMutation.isPending ? 'Processing...' : (
                    <>
                      <span>Pay Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-muted">
                  By clicking "Pay Now", you agree to our terms and conditions.
                </p>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="card p-12 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-ink">Thank you for your support!</h2>
              <p className="text-muted text-lg">
                Your donation of ${formData.amount} has been successfully received. 
                A receipt has been sent to {formData.email}.
              </p>
              <div className="pt-6">
                <a href="/dashboard" className="btn-primary">Return to Dashboard</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
