import React, { useRef, useEffect, useState } from 'react';
import { saveCanvas } from '../API';

const Canvas = ({ selectedTool, annotationsVisible, onSaveCanvas }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleMouseDown = (e) => {
      setDrawing(true);
      const { clientX, clientY } = e;
      const canvasRect = canvas.getBoundingClientRect();
      const offsetX = clientX - canvasRect.left;
      const offsetY = clientY - canvasRect.top;

      if (selectedTool === 'draw' || selectedTool === 'eraser') {
        setShapes([...shapes, { type: selectedTool, points: [{ x: offsetX, y: offsetY }] }]);
      } else if (selectedTool === 'select') {
        const clickedShape = shapes.find(
          (shape) =>
            shape.type !== 'select' &&
            offsetX >= shape.startX &&
            offsetX <= shape.endX &&
            offsetY >= shape.startY &&
            offsetY <= shape.endY
        );
        setSelectedShape(clickedShape || null);
      } else if (['circle', 'rectangle', 'ellipse'].includes(selectedTool)) {
        setShapes([...shapes, { type: selectedTool, startX: offsetX, startY: offsetY }]);
      }
    };

    const handleMouseMove = (e) => {
      if (!drawing) return;

      const { clientX, clientY } = e;
      const canvasRect = canvas.getBoundingClientRect();
      const offsetX = clientX - canvasRect.left;
      const offsetY = clientY - canvasRect.top;

      const updatedShapes = [...shapes];
      let currentShape = updatedShapes[updatedShapes.length - 1];

      if (!currentShape) {
        currentShape = { type: selectedTool, points: [] };
        updatedShapes.push(currentShape);
      }

      if (selectedTool === 'draw' || selectedTool === 'eraser') {
        currentShape.points.push({ x: offsetX, y: offsetY });
        drawShapes(updatedShapes);
      } else if (selectedTool === 'select' && selectedShape) {
        const deltaX = offsetX - selectedShape.startX;
        const deltaY = offsetY - selectedShape.startY;
        selectedShape.startX = offsetX;
        selectedShape.startY = offsetY;
        selectedShape.endX += deltaX;
        selectedShape.endY += deltaY;

        drawShapes(updatedShapes);
      } else if (['circle', 'rectangle', 'ellipse'].includes(selectedTool)) {
        currentShape.endX = offsetX;
        currentShape.endY = offsetY;
        drawShapes(updatedShapes);
      }
    };

    const handleMouseUp = () => {
      setDrawing(false);
      setSelectedShape(null);
    };

    const drawShapes = (shapesToDraw) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapesToDraw.forEach((shape) => {
        switch (shape.type) {
          case 'draw':
            drawFreehandShape(ctx, shape.points);
            break;
          case 'eraser':
            drawFreehandShape(ctx, shape.points, true); // true indicates eraser mode
            break;
          case 'select':
            drawSelectionBox(ctx, shape);
            break;
          case 'circle':
            drawCircle(ctx, shape);
            break;
          case 'rectangle':
            drawRectangle(ctx, shape);
            break;
          case 'ellipse':
            drawEllipse(ctx, shape);
            break;
          default:
            break;
        }
      });
    };

    const drawFreehandShape = (context, points, eraserMode = false) => {
      if (!points || points.length === 0) {
        return;
      }

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }

      if (eraserMode) {
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 10; // Set the desired thickness for the eraser
      } else {
        context.globalCompositeOperation = 'source-over';
        context.lineWidth = 1; // Set the default line thickness
      }

      context.stroke();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 1; // Reset line thickness to default
    };

    const drawSelectionBox = (context, shape) => {
      context.strokeStyle = 'blue';
      context.lineWidth = 2;
      context.strokeRect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
      context.strokeStyle = 'black';
      context.lineWidth = 1;
    };

    const drawCircle = (context, shape) => {
      const radius = Math.sqrt(
        Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2)
      );
      context.beginPath();
      context.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
      context.stroke();
    };

    const drawRectangle = (context, shape) => {
      context.beginPath();
      context.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY);
      context.stroke();
    };

    const drawEllipse = (context, shape) => {
      const radiusX = Math.abs((shape.endX - shape.startX) / 2);
      const radiusY = Math.abs((shape.endY - shape.startY) / 2);
      const centerX = shape.startX + radiusX;
      const centerY = shape.startY + radiusY;

      context.beginPath();
      context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      context.stroke();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drawing, selectedTool, shapes, selectedShape]);

  const handleSaveCanvas = async () => {
    const canvas = canvasRef.current;
    const canvasData = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });

    const formData = new FormData();
    // context.rect(shape.startX, shape.startY, shape.endX - shape.startX, shape.endY - shape.startY)
    formData.append('canvasData', canvasData);

    try {
      const response = await saveCanvas(formData);
      onSaveCanvas(response.canvasId);
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

  return (
    <div style={{display:'flex', flexDirection:'column', width:700, height: 700}}>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #000' }}
      ></canvas>
      <button onClick={handleSaveCanvas}>Save Canvas</button>
      </div>
  );
};

export default Canvas;
