import React, { useState } from 'react';

const AntiRaggingForm = () => {
  const [complaint, setComplaint] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true); // Show confirmation modal
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false); // Close confirmation modal
    try {
      const response = await fetch('http://localhost:4000/api/antiragging/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ complaint }),
      });

      if (response.ok) {
        setShowSuccessModal(true); // Show success modal
        setComplaint(''); // Clear the form after submission
      } else {
        // Handle errors
        console.error('Error submitting complaint');
        alert('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit complaint. Please try again.');
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false); // Close confirmation modal without submitting
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Anti-Ragging Complaint Form</h1>
        <p style={styles.disclaimer}>
          * All complaints are anonymous and will be handled with strict confidentiality.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="complaint" style={styles.label}>Your Complaint:</label>
            <textarea
              id="complaint"
              style={styles.textarea}
              rows="5"
              value={complaint}
              onChange={handleComplaintChange}
              required
            />
          </div>
          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitButton}
              onMouseOver={(e) => e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor}
              onMouseOut={(e) => e.target.style.backgroundColor = styles.submitButton.backgroundColor}
            >
              Submit
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCloseSuccessModal}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <p>Are you sure you want to submit this complaint?</p>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.modalButton}
                  onClick={handleConfirmSubmit}
                >
                  Confirm
                </button>
                <button
                  style={{ ...styles.modalButton, ...styles.modalCancelButton }}
                  onClick={handleCancelSubmit}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <p>Complaint submitted successfully!</p>
              <button
                style={styles.modalButton}
                onClick={handleCloseSuccessModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#2f2f2f', // Dark grey background
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#ffffff', // White container
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginLeft: '500px',
    marginTop: '10px',
    marginBottom: '10px',
    marginRight: '500px',
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: '600',
  },
  disclaimer: {
    color: '#FF0000',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '14px',
  },
  formGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#34495e',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    marginBottom: '10px',
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'vertical',
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  submitButton: {
    width: '48%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  submitButtonHover: {
    backgroundColor: '#2980b9',
  },
  cancelButton: {
    width: '48%',
    padding: '12px',
    backgroundColor: '#95a5a6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalButton: {
    padding: '10px 20px',
    marginTop: '15px',
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalCancelButton: {
    backgroundColor: '#95a5a6',
    marginLeft: '10px',
  },
};

export default AntiRaggingForm;
