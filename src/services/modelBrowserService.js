export function getModels() {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: ['Male_shoes.glb'] }), 500)
    );
  }
  