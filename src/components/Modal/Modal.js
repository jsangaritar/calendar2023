export default function Modal({ onDismiss, image }) {
  return (
    <div className="image-popup">
      <div className="preview-wrapper">
        <img src={image} className="preview" alt="preview" />
      </div>
      <button className="cancel" onClick={onDismiss}>
        Cerrar
      </button>
    </div>
  );
}
