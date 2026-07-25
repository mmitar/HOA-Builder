export function ProjectInfoPanel({ isExpanded, onToggleExpand }: { isExpanded?: boolean; onToggleExpand?: () => void }) {
  return (
    <div className={`project-info ${isExpanded ? 'expanded' : ''}`}>
      <div className="project-info-header">
        <h2>Community Notes Application</h2>
        {onToggleExpand && (
          <button 
            className="project-info-toggle" 
            onClick={onToggleExpand} 
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
      </div>
      <div className="project-info-content">
        <h3>Purpose</h3>
        <p>
          This exercise evaluates your ability to build a small feature across a frontend, backend
          API, and database. We are interested in how you think through the full workflow—not just
          whether the screen looks finished.
        </p>

        <h3>Instructions</h3>
        <p>Build a small application that allows a property manager to maintain notes for communities.</p>

        <h3>Technology requirements</h3>
        <ul>
          <li>Frontend: React with TypeScript</li>
          <li>Backend: Python with FastAPI</li>
          <li>Database: SQLite</li>
        </ul>

        <h3>Functional requirements</h3>
        <ul>
          <li>Display a list of communities.</li>
          <li>Allow the user to select a community.</li>
          <li>Display and edit community notes (max 500 characters).</li>
          <li>Save changes through the backend API and persist them.</li>
          <li>Show loading/success/error states and prevent blank notes.</li>
          <li>Include at least one backend automated test.</li>
        </ul>
      </div>
    </div>
  );
}