export default function MessageBox({ type, message }) {
  return (
    <div className={`message-box ${type}`}>
      <p>{message}</p>
      <style jsx>{`
        .message-box {
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
        }
        .info {
          background-color: #d9edf7;
          color: #31708f;
        }
        .error {
          background-color: #f2dede;
          color: #a94442;
        }
      `}</style>
    </div>
  );
}
