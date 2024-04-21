
import  { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate  } from "react-router-dom";
import {set, clear} from "local-storage";

const Home = () => {
  const [games, setGames] = useState([]);
  const navigation = useNavigate();
  useEffect(()=>{
  clear();
  fetchHistory();
  const timeoutId = setTimeout(() => {
    fetchHistory();
  }, 1000);

  // Clear timeout if the component unmounts before the timeout fires
  return () => clearTimeout(timeoutId);
  },[games]);

  const fetchHistory = async () => {
    try {
      const response = await fetch('https://tic-tac-toe-backend-goz5.onrender.com/api/history');
      const data = await response.json();

      if (data.status === 'success') {
        setGames(data.data.history);
      } else {
        console.error('Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const deleteHistory = async (id) => {
    try {
      const response = await fetch(`https://tic-tac-toe-backend-goz5.onrender.com/api/history/delete-history/${id}`, {
        method: 'DELETE',
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        console.log('History entry deleted successfully');
        alert("Successfully deleted")
        fetchHistory();
      } else {
        console.error('Failed to delete history entry');
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; 
    
    return `${month} ${day}, ${year} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };


 


  const playerXName = () => {
    Swal.fire({
      title: "Enter Player X Name",
      input: "text", 
      inputPlaceholder: "Enter your name", 
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        if (name) {
          console.log(`Player name entered: ${name}`);
          set('playerX', name)
          playerOName();

          return name;
        } else {
          Swal.showValidationMessage("Player name is required");
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const playerName = result.value;
        console.log(`Player name submitted: ${playerName}`);
       
      }
    });
  };

  const playerOName = () => {
    Swal.fire({
      title: "Enter Player O Name",
      input: "text", 
      inputPlaceholder: "Enter your name", 
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        if (name) {
      
          console.log(`Player name entered: ${name}`);
          set('playerO', name)
       
          return name;
        } else {
          Swal.showValidationMessage("Player name is required");
        }
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const playerName = result.value;
        console.log(`Player name submitted: ${playerName}`);
        startGameModal();
        navigation('/play')
      }
    });
  };

  const startGameModal = () => {
    Swal.fire({
      title: "Game Start",
      text: "Are you ready to start the game?",
      icon: "info",
      confirmButtonText: "Start",
      showCancelButton: false, 
      allowOutsideClick: false, 
      allowEscapeKey: false, 
    }).then((result) => {
      if (result.isConfirmed) {
      
        console.log("Game started");
      
      }
    });
  };

  return (
    <div style={styles.container}>
      <h1>Tic Tac Toe</h1>

      <button style={styles.button} onClick={playerXName}>
        Start New Game
      </button>

      <h3>Previous Games</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Player X Name</th>
            <th style={styles.tableHeader}>Player O Name</th>
            <th style={styles.tableHeader}>X Wins</th>
            <th style={styles.tableHeader}>O Wins</th>
            <th style={styles.tableHeader}>Draw</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{game.xPlayerName}</td>
              <td style={styles.tableCell}>{game.oPlayerName}</td>
              <td style={styles.tableCell}>{game.xWins}</td>
              <td style={styles.tableCell}>{game.oWins}</td>
              <td style={styles.tableCell}>{game.draw}</td>
              <td style={styles.tableCell}>{formatDate(game.dateCreated)}</td>
              <td style={styles.tableCell}><button onClick={()=>deleteHistory(game._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "center",
    padding: "20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    margin: "10px 0",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "100px", 
    maxHeight: "100px",
    overflowY: "auto", 
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
    padding: "12px 15px",
    fontWeight: "bold",
    textAlign: "center",
    borderBottom: "2px solid #ddd",
    margin: "0",
  },
  tableRow: {
    borderBottom: "1px solid #e0e0e0",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  tableCell: {
    textAlign: "center",
    padding: "10px",
  },
};

// Responsive styles using media queries
const mediaQueries = {
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
};

// Update styles for responsive design
styles.container = {
  ...styles.container,
  padding: "20px 10px",
};

styles.button = {
  ...styles.button,
  padding: "8px 16px",
  fontSize: "14px",
};

styles.tableHeader = {
  ...styles.tableHeader,
  padding: "10px 12px",
};

styles.tableCell = {
  ...styles.tableCell,
  padding: "8px 10px",
};

styles.table = {
  ...styles.table,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};


export default Home;
