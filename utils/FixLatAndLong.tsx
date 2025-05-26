"use client"

import updateCoordinates from "./updateCoordinates";

function FixLatAndLong() {
  const start = async () => {

    await updateCoordinates();
    alert('Coordinates updated!');
  }
  return (
    <button
      type="button"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={start}
    >
      Update Coordinates
    </button>
  )
}

export default FixLatAndLong
