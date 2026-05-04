export const RightComponent = () => {
  <div className="d-flex flex-row">
    <div className="col-8">
      <div className="d-flex flex-column">
        <div>
          <span>Content</span>
        </div>
        <div>
          <h4>Activity & Comments</h4>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              <div className="col-2">Icon</div>
              <div className="col-10 d-flex flex-column">
                <div className="d-flex flex-row">
                  <div className="col-8 d-flex justify-content-start">
                    <h4>FirstName LastName</h4>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <span>Oct 24, 4:12PM</span>
                  </div>
                </div>
                <span>Comment written by user...</span>
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="col-2">Icon</div>
              <div className="col-10 d-flex flex-column">
                <div className="d-flex flex-row">
                  <div className="col-8 d-flex justify-content-start">
                    <h4>FirstName LastName</h4>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <span>Oct 24, 4:12PM</span>
                  </div>
                </div>
                <span>Comment written by user...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-4">
      <div className="d-flex flex-column">
        <div>
          <h4>Assignee</h4>
          <span>User</span>
        </div>
        <div>
          <h4>Properties</h4>
          <span>Due Date : </span>
          <span>Creation Date : </span>
          <span>Point estimation : </span>
        </div>
        <div>
          <h4>Tags</h4>
          <span>Tag 1, Tag 2, Tag 3</span>
        </div>
        <div>
          <button>Delete Task</button>
        </div>
      </div>
    </div>
  </div>;
};
