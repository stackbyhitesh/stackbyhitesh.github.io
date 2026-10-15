import { Component } from 'react';
import { profile } from '../data';

/** Shows a friendly fallback instead of a blank page if something in the UI crashes. */
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('UI error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main style={{ maxWidth: 560, margin: '20vh auto', padding: 24, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>Please reload the page. You can also reach Hitesh at <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </main>
    );
  }
}
