// Toolbar.js
import React from 'react';

const Toolbar = ({ selectedTool, onToolChange, onToggleAnnotations, onShapeChange, onEraserChange }) => {
  return (
    <div>
      <button onClick={() => onToolChange('draw')} disabled={selectedTool === 'draw'}>
        Draw
      </button>
      <button onClick={() => onToolChange('select')} disabled={selectedTool === 'select'}>
        Select
      </button>
      <button onClick={() => onToolChange('view')} disabled={selectedTool === 'view'}>
        View
      </button>
      <button onClick={() => onShapeChange('circle')} disabled={selectedTool === 'circle'}>
        Circle
      </button>
      <button onClick={() => onShapeChange('rectangle')} disabled={selectedTool === 'rectangle'}>
        Rectangle
      </button>
      <button onClick={() => onShapeChange('ellipse')} disabled={selectedTool === 'ellipse'}>
        Ellipse
      </button>
      <button onClick={() => onEraserChange('eraser')} disabled={selectedTool === 'eraser'}>
        Eraser
      </button>
      <button onClick={onToggleAnnotations}>Toggle Annotations</button>
    </div>
  );
};

export default Toolbar;
