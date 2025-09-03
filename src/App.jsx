import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CollectionPage from "./components/common/CollectionPage";
import PerkForm from "./pages/PerkForm";
import Navbar from "./components/common/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import { appStyles } from "./styles/layoutStyles.style";

// Collection configurations
const COLLECTIONS = {
  PERKS: {
    id: "689046505062d22cb6485ac6",
    name: "Perks",
    description: "Manage your perks and special offers for members.",
  },
  OFFERS: {
    id: "686cd18f382b5b2f1dcc787b",
    name: "Offers",
    description: "Manage available offers and deals.",
  },
  PLACES: {
    id: "688b15b04ee8c4d17f71c5c3",
    name: "Places",
    description: "Manage locations and venues.",
  },
};

// Generic Form Component for reusability
const GenericForm = ({ collectionId, collectionName }) => {
  return (
    <PerkForm collectionId={collectionId} collectionName={collectionName} />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div style={appStyles.appContainer}>
          <Navbar />
          <main style={appStyles.mainContent}>
            <Routes>
              {/* Perks Routes */}
              <Route
                path="/"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.PERKS.id}
                    title={COLLECTIONS.PERKS.name}
                    description={COLLECTIONS.PERKS.description}
                  />
                }
              />
              <Route path="/perks/add" element={<PerkForm />} />
              <Route path="/perks/edit/:id" element={<PerkForm />} />

              {/* Offers Routes */}
              <Route
                path="/offers"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.OFFERS.id}
                    title={COLLECTIONS.OFFERS.name}
                    description={COLLECTIONS.OFFERS.description}
                  />
                }
              />
              <Route
                path="/offers/add"
                element={
                  <GenericForm
                    collectionId={COLLECTIONS.OFFERS.id}
                    collectionName={COLLECTIONS.OFFERS.name}
                  />
                }
              />
              <Route
                path="/offers/edit/:id"
                element={
                  <GenericForm
                    collectionId={COLLECTIONS.OFFERS.id}
                    collectionName={COLLECTIONS.OFFERS.name}
                  />
                }
              />

              {/* Places Routes */}
              <Route
                path="/places"
                element={
                  <CollectionPage
                    collectionId={COLLECTIONS.PLACES.id}
                    title={COLLECTIONS.PLACES.name}
                    description={COLLECTIONS.PLACES.description}
                  />
                }
              />
              <Route
                path="/places/add"
                element={
                  <GenericForm
                    collectionId={COLLECTIONS.PLACES.id}
                    collectionName={COLLECTIONS.PLACES.name}
                  />
                }
              />
              <Route
                path="/places/edit/:id"
                element={
                  <GenericForm
                    collectionId={COLLECTIONS.PLACES.id}
                    collectionName={COLLECTIONS.PLACES.name}
                  />
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
