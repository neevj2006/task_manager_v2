import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  // Updates state when an error occurs in child components
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  // Logs error details to console for debugging
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
