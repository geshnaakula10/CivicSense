import { useState } from 'react'
import PropTypes from 'prop-types'

const initialFormState = {
  description: '',
  category: '',
  latitude: '',
  longitude: '',
  address: '',
  near_school: false,
  near_hospital: false,
  high_density_area: false,
  peak_hour: false,
  public_danger: false,
  image: null,
}

function ReportForm({ onSubmit, isSubmitting, apiError }) {
  const [formValues, setFormValues] = useState(initialFormState)
  const [formError, setFormError] = useState(null)

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (field, checked) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0]
    handleChange('image', file || null)
  }

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Geolocation is not supported by your browser.')
      return
    }

    setFormError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormValues((prev) => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
        }))
      },
      () => {
        setFormError(
          'Unable to retrieve your location. Please enter it manually.'
        )
      }
    )
  }

  const handlePinOnMap = () => {
    // Placeholder for future map integration
    window.alert(
      'Map pinning will be available soon. For now, please enter coordinates manually.'
    )
  }

  const validate = () => {
    if (!formValues.description.trim()) {
      return 'Please describe the issue.'
    }
    if (!formValues.category) {
      return 'Please select a category.'
    }
    if (!formValues.latitude || !formValues.longitude) {
      return 'Please provide latitude and longitude.'
    }
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError(null)
    onSubmit(formValues)
  }

  return (
    <form className="report-form" onSubmit={handleSubmit} noValidate>
      {/* Top-level errors */}
      {(formError || apiError) && (
        <div className="alert alert-error">
          {formError ? formError : apiError}
        </div>
      )}

      {/* 1️⃣ Issue Details */}
      <section className="section-card">
        <header className="section-header">
          <h2 className="section-title">Issue Details</h2>
          <p className="section-helper">
            Describe what happened so we can assess the urgency and impact.
          </p>
        </header>

        <div className="field-group">
          <label htmlFor="description" className="field-label">
            Description
          </label>
          <textarea
            id="description"
            className="field-textarea"
            rows={4}
            placeholder="Describe what happened, its impact, and whether it poses immediate risk."
            value={formValues.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <p className="field-helper">
            Describe what happened, its impact, and whether it poses immediate
            risk.
          </p>
        </div>

        <div className="field-group">
          <label htmlFor="category" className="field-label">
            Category
          </label>
          <select
            id="category"
            className="field-select"
            value={formValues.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Road Safety">Road safety</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Public Safety">Public safety</option>
            <option value="Environment">Environment</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </section>

      {/* 2️⃣ Location */}
      <section className="section-card">
        <header className="section-header section-header-row">
          <div>
            <h2 className="section-title">Location</h2>
            <p className="section-helper">
              Exact location helps our teams and AI understand impact and
              routing.
            </p>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={handleAutoDetectLocation}
              disabled={isSubmitting}
            >
              Auto Detect
            </button>
            <button
              type="button"
              className="btn-ghost btn-sm"
              onClick={handlePinOnMap}
              disabled={isSubmitting}
            >
              Pin on Map
            </button>
          </div>
        </header>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="latitude" className="field-label">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="0.000001"
              className="field-input"
              placeholder="e.g. 12.971599"
              value={formValues.latitude}
              onChange={(e) => handleChange('latitude', e.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="longitude" className="field-label">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="0.000001"
              className="field-input"
              placeholder="e.g. 77.594566"
              value={formValues.longitude}
              onChange={(e) => handleChange('longitude', e.target.value)}
            />
          </div>
        </div>

        <div className="field-group">
          <label htmlFor="address" className="field-label">
            Address (optional)
          </label>
          <input
            id="address"
            type="text"
            className="field-input"
            placeholder="Nearby landmark, street name, or full address"
            value={formValues.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        <p className="field-helper">
          Location details help city teams verify the issue quickly and send
          the right responders.
        </p>
      </section>

      {/* 3️⃣ Additional Context (Optional) */}
      <section className="section-card">
        <header className="section-header">
          <h2 className="section-title">Additional Context (Optional)</h2>
          <p className="section-helper">
            These help our AI prioritize your report faster.
          </p>
        </header>

        <div className="context-grid">
          <label className="context-item">
            <input
              type="checkbox"
              checked={formValues.near_school}
              onChange={(e) =>
                handleCheckboxChange('near_school', e.target.checked)
              }
            />
            <span className="context-label">Near a school</span>
          </label>

          <label className="context-item">
            <input
              type="checkbox"
              checked={formValues.near_hospital}
              onChange={(e) =>
                handleCheckboxChange('near_hospital', e.target.checked)
              }
            />
            <span className="context-label">Near a hospital</span>
          </label>

          <label className="context-item">
            <input
              type="checkbox"
              checked={formValues.high_density_area}
              onChange={(e) =>
                handleCheckboxChange('high_density_area', e.target.checked)
              }
            />
            <span className="context-label">High foot/vehicle traffic</span>
          </label>

          <label className="context-item">
            <input
              type="checkbox"
              checked={formValues.peak_hour}
              onChange={(e) =>
                handleCheckboxChange('peak_hour', e.target.checked)
              }
            />
            <span className="context-label">Peak traffic hours</span>
          </label>

          <label className="context-item">
            <input
              type="checkbox"
              checked={formValues.public_danger}
              onChange={(e) =>
                handleCheckboxChange('public_danger', e.target.checked)
              }
            />
            <span className="context-label">Immediate public danger</span>
          </label>
        </div>
      </section>

      {/* 4️⃣ Upload Evidence (Optional) */}
      <section className="section-card">
        <header className="section-header">
          <h2 className="section-title">Upload Evidence (Optional)</h2>
          <p className="section-helper">
            Clear photos help our AI and city teams understand severity and
            context.
          </p>
        </header>

        <label className="upload-box">
          <div className="upload-icon" aria-hidden="true">
            <span className="upload-icon-body" />
            <span className="upload-icon-lens" />
          </div>
          <div className="upload-text">
            <span className="upload-title">Tap to upload a photo</span>
            <span className="upload-subtitle">
              JPG or PNG, up to a few MB. Avoid including faces where possible.
            </span>
            {formValues.image && (
              <span className="upload-file-name">{formValues.image.name}</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="upload-input"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </label>
      </section>

      {/* 5️⃣ Submit Button */}
      <div className="section-actions-bottom">
        <button
          type="submit"
          className="btn-primary btn-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Analyzing your report...' : 'Submit report'}
        </button>
      </div>
    </form>
  )
}

ReportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  apiError: PropTypes.string,
}

ReportForm.defaultProps = {
  isSubmitting: false,
  apiError: null,
}

export default ReportForm

