import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import "./App.scss";
import Modal from "./components/Modal";

const LOCAL_KEY = "app";
const PREFIX = "inspeccionamos-";
const NONE_VALUE = "NONE";

const IMAGES = {
  [`${PREFIX}0`]: null,
  [`${PREFIX}1`]: null,
  [`${PREFIX}2`]: null,
  [`${PREFIX}3`]: null,
  [`${PREFIX}4`]: null,
  [`${PREFIX}5`]: null,
  [`${PREFIX}6`]: null,
  [`${PREFIX}7`]: null,
  [`${PREFIX}8`]: null,
  [`${PREFIX}9`]: null,
};

const getImageNameFromURL = (str = "") => {
  if (
    !(
      str.startsWith("http") &&
      (str.endsWith(".jpg") || str.endsWith(".png") || str.endsWith(".jpeg"))
    )
  ) {
    return "";
  }
  return str.split("/").pop().split(".")[0];
};

function App() {
  const [qrCode, setQrCode] = useState("");
  const [images, setImages] = useState(IMAGES);
  const [previewedImage, setPreviewedImage] = useState(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ qrCode, images }));
  }, [qrCode, images]);

  useEffect(() => {
    const stateFromStorage = localStorage.getItem(LOCAL_KEY);
    if (stateFromStorage) {
      const { qrCode: storedQrCode, images: storedImages } =
        JSON.parse(stateFromStorage);
      setQrCode(storedQrCode);
      setImages(storedImages);
    }
  }, []);

  const handleScan = (result) => {
    if (result) {
      const url = result.text;
      const imageName = getImageNameFromURL(url);

      if (Object.keys(images).includes(imageName)) {
        setQrCode(url);
      } else {
        setQrCode(NONE_VALUE);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleAddImage = (url) => {
    const imageName = getImageNameFromURL(url);
    setImages((prevImages) => ({ ...prevImages, [imageName]: url }));
    setQrCode("");
  };

  const renderCell = ([key, imageURL], index) => {
    return (
      <div key={key} className="cell">
        {imageURL ? (
          <img
            src={imageURL}
            alt={`Imagen ${index + 1}`}
            onClick={() => setPreviewedImage(imageURL)}
          />
        ) : (
          <div className="number">{index + 1}</div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Inspeccionemos</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onResult={handleScan}
        constraints={{ facingMode: "environment" }}
      />
      <div className="grid-section">
        <div className="grid">{Object.entries(images).map(renderCell)}</div>
      </div>
      {qrCode && (
        <div className="image-popup">
          {qrCode !== NONE_VALUE ? (
            <>
              <div className="preview-wrapper">
                <img src={qrCode} className="preview" alt="preview" />
              </div>
              <button className="add" onClick={() => handleAddImage(qrCode)}>
                Agregar
              </button>
            </>
          ) : (
            <>
              <h2>Esta imagen no hace parte del juego</h2>
              <button className="cancel" onClick={() => setQrCode("")}>
                Cerrar
              </button>
            </>
          )}
        </div>
      )}
      {previewedImage && (
        <Modal
          onDismiss={() => setPreviewedImage(null)}
          image={previewedImage}
        />
      )}
    </div>
  );
}

export default App;
