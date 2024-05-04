import PropTypes from "prop-types";

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="notifi">{message}</div>;
};

ErrorNotification.propTypes = {
  message: PropTypes.string.isRequired,
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
};

export { Notification, ErrorNotification };
