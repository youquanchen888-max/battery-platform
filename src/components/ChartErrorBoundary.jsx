import React from 'react'

class ChartErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#d32f2f' }}>
          图表渲染错误，请刷新页面后重试。
        </div>
      )
    }
    return this.props.children
  }
}

export default ChartErrorBoundary