import { useEffect, useState } from "react";
import { getUserInfo } from "../API/Api.js"; // Ensure path is correct
import { Container, Card, Spinner } from "react-bootstrap";

// Import the CSS file for this component
import '../Css/Profile.css'; // You'll create this file next

const Profile = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserInfo();
        setLoggedUser(response.loggedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Container className="profile-container d-flex justify-content-center align-items-center">
      <Card className="profile-card">
        <h3 className="profile-title">Your Profile</h3>
        <p className="profile-subtitle text-center mb-4">
          View your account information
        </p>

        {loading ? (
          <div className="text-center">
            {/* Change Spinner variant to a color from your palette, or omit if you'll style it with CSS */}
            <Spinner animation="border" className="profile-spinner" />
          </div>
        ) : loggedUser ? (
          <>
            <p className="profile-info-item">
              <strong className="profile-info-label">Name:</strong>{" "}
              <span className="profile-info-value">{loggedUser.name}</span>
            </p>
            <p className="profile-info-item">
              <strong className="profile-info-label">Email:</strong>{" "}
              <span className="profile-info-value">{loggedUser.email}</span>
            </p>
            <p className="profile-info-item">
              <strong className="profile-info-label">Admin:</strong>{" "}
              <span className="profile-info-value">
                {loggedUser.isAdmin ? "Yes" : "No"}
              </span>
            </p>
          </>
        ) : (
          <p className="profile-error-message">Failed to load profile.</p>
        )}
      </Card>
    </Container>
  );
};

export default Profile;