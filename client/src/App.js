import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import { saveCanvas, getCanvases } from './API';

const App = () => {
  const [selectedTool, setSelectedTool] = useState('draw');
  const [annotationsVisible, setAnnotationsVisible] = useState(true);
  const [canvases, setCanvases] = useState([]);

  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const data = await getCanvases();
        setCanvases(data);


        console.log('Canvases retrieved successfully:', data);
        // alert('Canvases retrieved successfully!');
      } catch (error) {
        console.error('Error fetching canvases:', error);
        // alert('Error fetching canvases. Please try again.');
      }
    };

    fetchCanvases();
  }, []); 
  const handleShapeChange = (shapeType) => {
    setSelectedTool(shapeType);
  };

  const handleEraserChange = (toolType) => {
    setSelectedTool(toolType);
  };

  const handleSaveCanvas = (canvasId) => {
    console.log('Canvas saved with ID:', canvasId);
  };
  console.log('Canvas',canvases)
  return (
    <div>
      <Toolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        onToggleAnnotations={() => setAnnotationsVisible(!annotationsVisible)}
        onShapeChange={handleShapeChange}
        onEraserChange={handleEraserChange}
      />
      <Canvas selectedTool={selectedTool} annotationsVisible={annotationsVisible} onSaveCanvas={handleSaveCanvas} />
      <div>
        {/* <h2>Saved Canvases</h2> */}
        <ul>
          {canvases.map((canvas) => (
            <li key={canvas.id}>{`Canvas ${canvas.id}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;

