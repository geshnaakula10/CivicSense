import PropTypes from 'prop-types'

function ReportResult({ result, onSubmitAnother, onTrackReport }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'priority-badge priority-critical'
      case 'High':
        return 'priority-badge priority-high'
      default:
        return 'priority-badge priority-normal'
    }
  }

  return (
    <section className="section-card result-card">
      <header className="section-header">
        <h2 className="section-title">Report submitted</h2>
        <p className="section-helper">
          Our AI has triaged your report and routed it to the right team.
        </p>
      </header>

      <div className="result-summary">
        <div className="result-row result-row-main">
          <div>
            <span className="result-label">Report ID</span>
            <div className="result-id">#{result.report_id}</div>
          </div>
          <div className="result-priority">
            <span className="result-label">Priority</span>
            <span className={getPriorityClass(result.priority)}>
              {result.priority}
            </span>
          </div>
        </div>

        <div className="result-row">
          <span className="result-label">Risk score</span>
          <span className="result-value">{result.score}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Routed to</span>
          <span className="result-value">{result.routed_to}</span>
        </div>

        <div className="result-row">
          <span className="result-label">Image uploaded</span>
          <span className="result-value">
            {result.image_uploaded ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="result-status">
          <span className="status-pill">Status: Pending</span>
          <p className="result-note">
            A city operator will review this report shortly. You can track its
            progress or submit another issue.
          </p>
        </div>
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={onSubmitAnother}
        >
          Submit another report
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onTrackReport}
        >
          Track report
        </button>
      </div>
    </section>
  )
}

ReportResult.propTypes = {
  result: PropTypes.shape({
    report_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    priority: PropTypes.string.isRequired,
    score: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    routed_to: PropTypes.string.isRequired,
    image_uploaded: PropTypes.bool.isRequired,
  }).isRequired,
  onSubmitAnother: PropTypes.func.isRequired,
  onTrackReport: PropTypes.func.isRequired,
}

export default ReportResult

