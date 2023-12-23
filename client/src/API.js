const BASE_URL = 'http://localhost:5000/api';

export const saveCanvas = async (canvasData) => {
  try {
    console.log('canvasData',canvasData);
    const formData = new FormData();

    // console.log(FormData);
    formData.append('canvasData', canvasData);

    const response = await fetch(`${BASE_URL}/canvas`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save canvas');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving canvas:', error);
    throw error;
  }
};

export const getCanvases = async () => {
  try {
    const response = await fetch(`${BASE_URL}/canvases`);

    if (!response.ok) {
      throw new Error('Failed to retrieve canvases');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving canvases:', error);
    throw error;
  }
};
