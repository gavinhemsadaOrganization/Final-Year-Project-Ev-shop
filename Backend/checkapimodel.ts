

async function listAvailableModels() {
  const apiKey = "AIzaSyDW6NWCvHe5vbCmk0Gs6V7hvI5CpN7c0yo";
  const url = 'https://generativelanguage.googleapis.com/v1beta/models';

  try {
    const response = await fetch(`${url}?key=${apiKey}`);
    
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Log the name of each available model
    console.log("Available Models:");
    for (const model of data.models) {
        console.log(model.name);
    }

    return data.models;

  } catch (error) {
    console.error("Failed to list models:", error);
    return null;
  }
}

// Call the function to see the list
listAvailableModels();