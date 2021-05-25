import PropTypes from 'prop-types';

type ErrorDisplayerProps = {
  errorMessage: string;
};

const ErrorDisplayer = ({ errorMessage }: ErrorDisplayerProps) => {
  if (!errorMessage) {
    return null;
  }
  return <div className="m-2 text-danger">{errorMessage}</div>;
};

ErrorDisplayer.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorDisplayer;
