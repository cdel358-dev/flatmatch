import React from 'react';

type State = { hasError: boolean; message?: string };

export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: any): State {
    return { hasError: true, message: err?.message || String(err) };
  }
  componentDidCatch(err: any, info: any) {
    console.error('App crashed:', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-600">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

