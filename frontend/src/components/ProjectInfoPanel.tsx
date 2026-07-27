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
          A full-stack development exercise. Practical application of model relationships, coding principles, and lightweight technologies. 
          The frontend is built with React and TypeScript, while the backend is built with FastAPI and SQLite.Content is delivered by loosely coupled 
          models and components, with a focus on reusability and maintainability. User flow is prioritized via responsive single page design,
          smooth transitions of UI components, request state notifications, and the application communicates what actions users can take.
        </p>

        <h3>Property Managers can:</h3>
        <ul>
          <li>Add communities and manage their details.</li>
          <li>View, edit, delete community notes.</li>
          <li>Save changes through the backend API and persist them.</li>
          <li>Delete communities and their associated notes.</li>
        </ul>

        <h3>Features:</h3>
        <ul>
          <li>On page load, available communities are loaded in from the backend.</li>
          <li>On community select, community details are fetched. Notes are independently requested, functionally decoupled.</li>
          <li>ID's are managed by the server, not the client.</li>
          <li>Each community and note has a unique identifier.</li>
          <li>Notes cannot exist without a community. Community on delete cascade deletes notes.</li>
          <li>Communities must have a name to save state, all other fields are optional.</li>
          <li>Users can only save the state of a community edit if there is a change to a field. Helps communicate a change was made.</li>
          <li>Communities have a delete confirmation window while notes do not.</li>
          <li>Notes cannot be saved with a blank message and the message must be 500 characters or less in order to be saved.</li>
          <li>Unit Tests are validated on server startup.</li>
          <li>Request states are communicated via Toast notifications.</li>
        </ul>

      </div>
    </div>
  );
}