export default function MessageBox({ type, message }) {
  const styles = {
    info: {
      backgroundColor: '#d9edf7',
      color: '#31708f',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    error: {
      backgroundColor: '#f2dede',
      color: '#a94442',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '10px',
    },
  };

  return (
    <div style={styles[type] || {}}>
      <p>{message}</p>
    </div>
  );
}
