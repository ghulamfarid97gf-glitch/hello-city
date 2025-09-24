import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import CollectionPage from "./components/common/CollectionPage";
import PerkForm from "./pages/PerkForm";
import OfferForm from "./pages/OfferForm";
import PlaceForm from "./pages/PlaceForm";
import Navbar from "./components/common/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import { appStyles } from "./styles/layoutStyles.style";
import NonMemberForm from "./pages/NonMemberForm";
import EliteForm from "./pages/EliteForm";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./components/common/LoginPage";
// import LoginPage from "./pages/LoginPage";
// import ProtectedRoute from "./components/common/ProtectedRoute";

// Collection configurations
const COLLECTIONS = {
  PERKS: {
    id: "689046505062d22cb6485ac6",
    name: "Perks",
    description: "Manage your perks and special offers for members.",
  },
  OFFERS: {
    id: "686cd18f382b5b2f1dcc787b",
    name: "Free Member Offers",
    description: "Manage available Free offers and deals.",
  },
  ELITE: {
    id: "68c9944867e93829d28f767f",
    name: "Elite Member Offers",
    description: "Manage available Elite offers and deals.",
  },
  NON_MEMBERS: {
    id: "68cab08b7569afdf5b23fd30",
    name: "Non Member Offers",
    description: "Manage available Non Member offers and deals.",
  },
  PLACES: {
    id: "688b15b04ee8c4d17f71c5c3",
    name: "Places",
    description: "Manage locations and venues.",
  },
};

// Hardcoded credentials
const VALID_CREDENTIALS = {
  email: "admin@example.com",
  password: "password123",
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    if (
      email === VALID_CREDENTIALS.email &&
      password === VALID_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      return { success: true };
    } else {
      return { success: false, error: "Invalid email or password" };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <LoginPage onLogin={login} />
        <ToastContainer />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div style={appStyles.appContainer}>
          <Navbar onLogout={logout} />
          <main style={appStyles.mainContent}>
            <Routes>
              {/* Perks Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <CollectionPage
                      collectionId={COLLECTIONS.PERKS.id}
                      title={COLLECTIONS.PERKS.name}
                      description={COLLECTIONS.PERKS.description}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perks/add"
                element={
                  <ProtectedRoute>
                    <PerkForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perks/edit/:id"
                element={
                  <ProtectedRoute>
                    <PerkForm />
                  </ProtectedRoute>
                }
              />

              {/* Offers Routes */}
              <Route
                path="/offers"
                element={
                  <ProtectedRoute>
                    <CollectionPage
                      collectionId={COLLECTIONS.OFFERS.id}
                      title={COLLECTIONS.OFFERS.name}
                      description={COLLECTIONS.OFFERS.description}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offers/add"
                element={
                  <ProtectedRoute>
                    <OfferForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/offers/edit/:id"
                element={
                  <ProtectedRoute>
                    <OfferForm />
                  </ProtectedRoute>
                }
              />

              {/* Elite Member Offer */}
              <Route
                path="/elite-offers"
                element={
                  <ProtectedRoute>
                    <CollectionPage
                      collectionId={COLLECTIONS.ELITE.id}
                      title={COLLECTIONS.ELITE.name}
                      description={COLLECTIONS.ELITE.description}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/elite-offers/add"
                element={
                  <ProtectedRoute>
                    <EliteForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/elite-offers/edit/:id"
                element={
                  <ProtectedRoute>
                    <EliteForm />
                  </ProtectedRoute>
                }
              />

              {/* Non Member Offer */}
              <Route
                path="/non-members-offers"
                element={
                  <ProtectedRoute>
                    <CollectionPage
                      collectionId={COLLECTIONS.NON_MEMBERS.id}
                      title={COLLECTIONS.NON_MEMBERS.name}
                      description={COLLECTIONS.NON_MEMBERS.description}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/non-members-offers/add"
                element={
                  <ProtectedRoute>
                    <NonMemberForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/non-members-offers/edit/:id"
                element={
                  <ProtectedRoute>
                    <NonMemberForm />
                  </ProtectedRoute>
                }
              />

              {/* Places Routes */}
              <Route
                path="/places"
                element={
                  <ProtectedRoute>
                    <CollectionPage
                      collectionId={COLLECTIONS.PLACES.id}
                      title={COLLECTIONS.PLACES.name}
                      description={COLLECTIONS.PLACES.description}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/places/add"
                element={
                  <ProtectedRoute>
                    <PlaceForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/places/edit/:id"
                element={
                  <ProtectedRoute>
                    <PlaceForm />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
