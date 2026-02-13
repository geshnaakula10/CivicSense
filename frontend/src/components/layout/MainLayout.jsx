import PropTypes from 'prop-types'

function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <h1 className="app-brand">CivicSense</h1>
            <p className="app-tagline">
              Smart civic issue reporting powered by AI
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">{children}</div>
      </main>
    </div>
  )
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MainLayout

