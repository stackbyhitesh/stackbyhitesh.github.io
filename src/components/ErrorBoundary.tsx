import { Component, type ErrorInfo, type ReactNode } from 'react';
import { profile } from '../data';

interface Props {
  children: ReactNode;
}
interface State {
  failed: boolean;
}

/** Shows a friendly fallback instead of a blank page if something in the UI crashes. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="mx-auto my-[20vh] max-w-[560px] p-6 text-center">
        <h1 className="mb-3 text-3xl font-extrabold">Something went wrong</h1>
        <p className="mb-5 text-muted">Please reload the page. You can also reach Hitesh at <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
      </main>
    );
  }
}
