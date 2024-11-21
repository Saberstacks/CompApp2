export default function MessageBox({ type, message }) {
  const color = type === 'error' ? 'red' : type === 'info' ? 'blue' : 'green';

  return (
    <div className="message-box" style={{ color }}>
      {message}
    </div>
  );
}
