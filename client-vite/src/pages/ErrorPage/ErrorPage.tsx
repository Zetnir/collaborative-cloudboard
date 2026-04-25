import "./ErrorPage.scss";

export const ErrorPage = () => {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-4">404 - Page Not Found</h1>
          <p className="lead">
            Sorry, the page you are looking for does not exist.
          </p>
          <a href="/" className="btn btn-primary">
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};
