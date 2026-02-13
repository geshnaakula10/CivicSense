import { useState } from 'react'
import ReportForm from '../components/report/ReportForm'
import ReportResult from '../components/report/ReportResult'
import { submitReport } from '../services/api'

function ReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [result, setResult] = useState(null)

  const handleSubmit = async (values) => {
    setIsSubmitting(true)
    setApiError(null)

    const formData = new FormData()
    formData.append('description', values.description)
    formData.append('category', values.category)
    formData.append('latitude', values.latitude.toString())
    formData.append('longitude', values.longitude.toString())

    if (values.address && values.address.trim()) {
      formData.append('address', values.address.trim())
    }

    formData.append('near_school', values.near_school ? 'true' : 'false')
    formData.append('near_hospital', values.near_hospital ? 'true' : 'false')
    formData.append(
      'high_density_area',
      values.high_density_area ? 'true' : 'false'
    )
    formData.append('peak_hour', values.peak_hour ? 'true' : 'false')
    formData.append('public_danger', values.public_danger ? 'true' : 'false')

    if (values.image) {
      formData.append('image', values.image)
    }

    try {
      const data = await submitReport(formData)
      setResult(data)
    } catch (error) {
      setApiError(error.message || 'Failed to submit report.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAnother = () => {
    setResult(null)
    setApiError(null)
  }

  const handleTrackReport = () => {
    if (!result?.report_id) {
      window.alert('Report ID not available. Please submit a report first.')
      return
    }
    // In a real app this would navigate to a tracking page/route.
    window.alert(`Tracking for report #${result.report_id} is not implemented yet.`)
  }

  return (
    <div className="report-page">
      <div className="report-page-header">
        <h2 className="page-title">Report a civic issue</h2>
        <p className="page-helper">
          Share details about what you are seeing. Our AI will prioritize and
          route your report to the right city team.
        </p>
      </div>

      {!result && (
        <ReportForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          apiError={apiError}
        />
      )}

      {result && (
        <ReportResult
          result={result}
          onSubmitAnother={handleSubmitAnother}
          onTrackReport={handleTrackReport}
        />
      )}
    </div>
  )
}

export default ReportPage

